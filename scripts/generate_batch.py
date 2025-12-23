#!/usr/bin/env python3
"""
Batch generate visual mnemonic images for LeetCode problems.
Uses the prompt library and generates in configurable batch sizes.

Usage:
    python generate_batch.py                    # Generate next 5 ungenerated images
    python generate_batch.py --batch-size 10   # Generate next 10 ungenerated images
    python generate_batch.py --problem 141     # Generate specific problem
    python generate_batch.py --version v2      # Generate with version suffix (for comparison)
    python generate_batch.py --list            # List all available problems
    python generate_batch.py --status          # Show generation status
"""

import os
import sys
import base64
import argparse
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env.local
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env.local"))

# Import the prompt library
from prompt_library import PROMPTS, get_all_problem_numbers, build_prompt

# Configuration
OUTPUT_DIR = "/Users/lilyzhang/Desktop/MicDrop/memories"
MODEL = "gpt-image-1.5"
DEFAULT_BATCH_SIZE = 5
VERSION = None  # Set via command line, e.g., "v2"

# Initialize OpenAI client (uses OPENAI_API_KEY from environment)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def get_existing_images() -> set:
    """Get set of existing image filenames."""
    if not os.path.exists(OUTPUT_DIR):
        return set()
    return set(os.listdir(OUTPUT_DIR))


def get_ungenerated_problems() -> list:
    """Get list of problem numbers that haven't been generated yet."""
    existing = get_existing_images()
    ungenerated = []
    
    for num in get_all_problem_numbers():
        filename = PROMPTS[num]["filename"]
        if filename not in existing:
            ungenerated.append(num)
    
    return ungenerated


def get_versioned_filename(filename: str, version: str = None) -> str:
    """Add version suffix to filename if specified."""
    if not version:
        return filename
    # Insert version before .png: 001_two_sum.png -> 001_two_sum_v2.png
    base, ext = os.path.splitext(filename)
    return f"{base}_{version}{ext}"


def generate_image(problem_number: int, version: str = None) -> bool:
    """Generate image for a specific problem."""
    if problem_number not in PROMPTS:
        print(f"❌ Problem {problem_number} not found in library")
        return False
    
    problem = PROMPTS[problem_number]
    filename = get_versioned_filename(problem["filename"], version)
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    print(f"🎨 Generating #{problem_number}: {problem['title']}")
    print(f"   Punchline: \"{problem['punchline']}\"")
    
    # Build the full prompt with meta instruction
    full_prompt = build_prompt(problem_number)
    
    try:
        response = client.images.generate(
            model=MODEL,
            prompt=full_prompt,
            n=1,
            size="1536x1024",
            quality="high",
        )
        
        # Get and save image
        image_data = response.data[0].b64_json
        image_bytes = base64.b64decode(image_data)
        
        with open(output_path, "wb") as f:
            f.write(image_bytes)
        
        print(f"   ✅ Saved: {filename}")
        return True
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def generate_batch(batch_size: int = DEFAULT_BATCH_SIZE, version: str = None, problems: list = None) -> None:
    """Generate a batch of images. If problems is provided, generate those specific ones."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    if problems:
        batch = problems
    else:
        ungenerated = get_ungenerated_problems()
        if not ungenerated:
            print("✨ All images have been generated!")
            return
        batch = ungenerated[:batch_size]
    
    version_str = f" ({version})" if version else ""
    print("=" * 60)
    print(f"Generating {len(batch)} images{version_str}")
    if not problems:
        ungenerated = get_ungenerated_problems()
        print(f"Remaining after this batch: {len(ungenerated) - len(batch)}")
    print("=" * 60)
    print()
    
    success_count = 0
    for problem_number in batch:
        if generate_image(problem_number, version):
            success_count += 1
        print()
    
    print("=" * 60)
    print(f"Done! Generated {success_count}/{len(batch)} images.")
    print(f"Images saved to: {OUTPUT_DIR}")
    print("=" * 60)


def show_status() -> None:
    """Show generation status for all problems."""
    existing = get_existing_images()
    
    print("=" * 60)
    print("Generation Status")
    print("=" * 60)
    
    generated = []
    missing = []
    
    for num in get_all_problem_numbers():
        problem = PROMPTS[num]
        filename = problem["filename"]
        if filename in existing:
            generated.append((num, problem["title"]))
        else:
            missing.append((num, problem["title"]))
    
    print(f"\n✅ Generated ({len(generated)}):")
    for num, title in generated:
        print(f"   {num:3d}. {title}")
    
    print(f"\n⏳ Not yet generated ({len(missing)}):")
    for num, title in missing:
        print(f"   {num:3d}. {title}")
    
    print(f"\nTotal: {len(generated)}/{len(PROMPTS)} generated")


def list_problems() -> None:
    """List all problems in the library."""
    print("=" * 60)
    print(f"Prompt Library ({len(PROMPTS)} problems)")
    print("=" * 60)
    
    for num in get_all_problem_numbers():
        problem = PROMPTS[num]
        print(f"{num:3d}. {problem['title']}")
        print(f"     \"{problem['punchline']}\"")
        print()


def main():
    parser = argparse.ArgumentParser(description="Generate visual mnemonic images")
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE,
                        help=f"Number of images to generate (default: {DEFAULT_BATCH_SIZE})")
    parser.add_argument("--problem", type=int, help="Generate specific problem number")
    parser.add_argument("--problems", type=str, help="Generate specific problems (comma-separated, e.g., '3,15,19,21,33')")
    parser.add_argument("--version", type=str, help="Version suffix for comparison (e.g., 'v2')")
    parser.add_argument("--list", action="store_true", help="List all problems in library")
    parser.add_argument("--status", action="store_true", help="Show generation status")
    
    args = parser.parse_args()
    
    if args.list:
        list_problems()
    elif args.status:
        show_status()
    elif args.problem:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        generate_image(args.problem, args.version)
    elif args.problems:
        # Parse comma-separated list of problem numbers
        problem_list = [int(p.strip()) for p in args.problems.split(",")]
        generate_batch(len(problem_list), args.version, problem_list)
    else:
        generate_batch(args.batch_size, args.version)


if __name__ == "__main__":
    main()
