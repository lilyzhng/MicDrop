#!/usr/bin/env python3
"""
Upload mnemonic images to Supabase Storage and update blind_problems table.

This script:
1. Finds all images in the memories folder
2. Identifies the LATEST version of each image (e.g., _v3 over _v2 over base)
3. Uploads them to Supabase Storage bucket 'mnemonic-images'
4. Updates the blind_problems table with the public URL

Usage:
    python upload_mnemonics_to_supabase.py                 # Upload all latest images
    python upload_mnemonics_to_supabase.py --dry-run      # Preview what would be uploaded
    python upload_mnemonics_to_supabase.py --problem 141  # Upload specific problem

Prerequisites:
    pip install supabase python-dotenv

Environment variables (in .env.local or .env):
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Needed for storage uploads
"""

import os
import re
import sys
import argparse
from pathlib import Path

# Configuration
MEMORIES_DIR = Path(__file__).parent.parent / "memories"
BUCKET_NAME = "mnemonic-images"

# Lazy imports - only load heavy dependencies when needed
_supabase_client = None

def _load_env():
    """Load environment variables (lazy)."""
    try:
        from dotenv import load_dotenv
        load_dotenv(Path(__file__).parent.parent / ".env.local")
        load_dotenv(Path(__file__).parent.parent / ".env")
    except ImportError:
        pass  # dotenv not available, rely on system env vars

def _get_env():
    """Get Supabase environment variables."""
    _load_env()
    url = os.getenv("VITE_SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")
    return url, key


def get_supabase_client():
    """Create and return Supabase client."""
    global _supabase_client
    if _supabase_client:
        return _supabase_client
    
    try:
        from supabase import create_client
    except ImportError:
        print("❌ supabase package not installed. Install with: pip install supabase")
        sys.exit(1)
    
    url, key = _get_env()
    if not url or not key:
        raise ValueError(
            "Missing Supabase environment variables. "
            "Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)"
        )
    _supabase_client = create_client(url, key)
    return _supabase_client


def parse_filename(filename: str) -> tuple[int, int, str]:
    """
    Parse a mnemonic image filename to extract problem number and version.
    
    Examples:
        001_two_sum.png -> (1, 0, "001_two_sum.png")
        003_longest_substring_v2.png -> (3, 2, "003_longest_substring_v2.png")
        003_longest_substring_v3.png -> (3, 3, "003_longest_substring_v3.png")
        141_linked_list_detection_v2.png -> (141, 2, "141_linked_list_detection_v2.png")
    
    Returns:
        (problem_number, version, filename)
    """
    # Extract problem number from start of filename (e.g., "001", "141")
    match = re.match(r'^(\d+)_', filename)
    if not match:
        return None
    
    problem_number = int(match.group(1))
    
    # Extract version if present (e.g., "_v2", "_v3")
    version_match = re.search(r'_v(\d+)\.png$', filename)
    version = int(version_match.group(1)) if version_match else 0
    
    return (problem_number, version, filename)


def get_latest_images() -> dict[int, str]:
    """
    Scan memories folder and return dict of {problem_number: latest_filename}.
    Only includes the highest version for each problem.
    """
    if not MEMORIES_DIR.exists():
        raise FileNotFoundError(f"Memories directory not found: {MEMORIES_DIR}")
    
    # Collect all images with their versions
    images = {}  # {problem_number: [(version, filename), ...]}
    
    for filepath in MEMORIES_DIR.glob("*.png"):
        parsed = parse_filename(filepath.name)
        if not parsed:
            print(f"⚠️  Skipping unrecognized file: {filepath.name}")
            continue
        
        problem_number, version, filename = parsed
        
        if problem_number not in images:
            images[problem_number] = []
        images[problem_number].append((version, filename))
    
    # Select latest version for each problem
    latest = {}
    for problem_number, versions in images.items():
        # Sort by version descending and take the first (highest version)
        versions.sort(key=lambda x: x[0], reverse=True)
        latest[problem_number] = versions[0][1]
    
    return latest


def upload_image(supabase, filename: str, dry_run: bool = False) -> str | None:
    """
    Upload an image to Supabase Storage.
    
    Returns:
        Public URL of the uploaded image, or None if dry run.
    """
    filepath = MEMORIES_DIR / filename
    
    if not filepath.exists():
        print(f"❌ File not found: {filepath}")
        return None
    
    if dry_run:
        print(f"  📁 Would upload: {filename}")
        return f"https://example.com/{BUCKET_NAME}/{filename}"
    
    # Read the image
    with open(filepath, "rb") as f:
        file_data = f.read()
    
    # Upload to Supabase Storage (upsert to overwrite if exists)
    try:
        # First try to remove existing file (ignore errors if doesn't exist)
        try:
            supabase.storage.from_(BUCKET_NAME).remove([filename])
        except Exception:
            pass
        
        # Upload the file
        supabase.storage.from_(BUCKET_NAME).upload(
            path=filename,
            file=file_data,
            file_options={"content-type": "image/png"}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)
        print(f"  ✅ Uploaded: {filename}")
        return public_url
        
    except Exception as e:
        print(f"  ❌ Failed to upload {filename}: {e}")
        return None


def update_problem_url(supabase, leetcode_number: int, image_url: str, dry_run: bool = False) -> bool:
    """
    Update the blind_problems table with the mnemonic image URL.
    
    Returns:
        True if successful, False otherwise.
    """
    if dry_run:
        print(f"  📝 Would update problem #{leetcode_number} with URL")
        return True
    
    try:
        result = supabase.table("blind_problems").update(
            {"mnemonic_image_url": image_url}
        ).eq("leetcode_number", leetcode_number).execute()
        
        if result.data:
            print(f"  📝 Updated problem #{leetcode_number}")
            return True
        else:
            print(f"  ⚠️  No problem found with leetcode_number={leetcode_number}")
            return False
            
    except Exception as e:
        print(f"  ❌ Failed to update problem #{leetcode_number}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Upload mnemonic images to Supabase")
    parser.add_argument("--dry-run", action="store_true", help="Preview without uploading")
    parser.add_argument("--problem", type=int, help="Upload specific problem number only")
    parser.add_argument("--upload-only", action="store_true", help="Upload to storage only, don't update table")
    parser.add_argument("--list", action="store_true", help="List latest images without uploading")
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("Mnemonic Image Uploader for Supabase")
    print("=" * 60)
    
    # Get latest images
    print("\n🔍 Scanning memories folder...")
    latest_images = get_latest_images()
    
    if args.list:
        print(f"\n📋 Latest images ({len(latest_images)} problems):\n")
        for problem_number in sorted(latest_images.keys()):
            filename = latest_images[problem_number]
            print(f"  #{problem_number:3d}: {filename}")
        return
    
    # Filter to specific problem if requested
    if args.problem:
        if args.problem not in latest_images:
            print(f"\n❌ No image found for problem #{args.problem}")
            return
        latest_images = {args.problem: latest_images[args.problem]}
    
    if args.dry_run:
        print("\n🏃 DRY RUN - No changes will be made\n")
    
    # Initialize Supabase client
    if not args.dry_run:
        print("\n🔌 Connecting to Supabase...")
        supabase = get_supabase_client()
    else:
        supabase = None
    
    # Process images
    print(f"\n📤 Processing {len(latest_images)} images...\n")
    
    success_count = 0
    for problem_number in sorted(latest_images.keys()):
        filename = latest_images[problem_number]
        print(f"Problem #{problem_number}: {filename}")
        
        # Upload image
        image_url = upload_image(supabase, filename, dry_run=args.dry_run)
        
        if image_url and not args.upload_only:
            # Update database
            if update_problem_url(supabase, problem_number, image_url, dry_run=args.dry_run):
                success_count += 1
        elif image_url:
            success_count += 1
        
        print()
    
    print("=" * 60)
    print(f"Done! Processed {success_count}/{len(latest_images)} images.")
    print("=" * 60)


if __name__ == "__main__":
    main()
