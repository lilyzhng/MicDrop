#!/usr/bin/env python3
"""
Generate visual mnemonic images for LeetCode problems using OpenAI's image generation API.
Images are saved to the memories/ folder.
"""

import os
import base64
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env.local
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env.local"))

# OpenAI API setup (uses OPENAI_API_KEY from environment)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Output directory
OUTPUT_DIR = "/Users/lilyzhang/Desktop/MicDrop/memories"

# Problems to generate (problem_number, filename, prompt)
PROBLEMS = [
    {
        "number": 1,
        "filename": "001_two_sum.png",
        "prompt": """Create a visual mnemonic for Two Sum (Hash Map Complement Search).

The mechanism: A person walks through a line of numbered boxes, one by one. 
At each box, they flip open a small notebook labeled "SEEN" and quickly check 
if the number they need is written there. If not, they jot down the current 
number and move on. One moment shows them finding a match - eyes lighting up, 
finger pointing at the notebook.

Style: Clean, diagrammatic illustration with soft colors. Show the sequential 
left-to-right motion. The notebook should be prominent. Minimal text, 
numbers only where needed."""
    },
    {
        "number": 11,
        "filename": "011_container_with_most_water.png",
        "prompt": """Create a visual mnemonic for Container With Most Water (Two Pointer Greedy).

The mechanism: Two walls of different heights with water between them. 
A dotted horizontal line shows the water level is CAPPED at the height 
of the shorter wall - water can't rise above it. An arrow points at the 
short wall with the insight: "Moving me might find a taller wall." 
The tall wall has a thought bubble: "Moving me is pointless - the water 
is already capped below my height."

Style: Clean diagram. The KEY visual is showing WHY the short wall is 
the bottleneck - the water line is limited by it. The tall wall's extra 
height is "wasted" - visually grayed out above the water line."""
    },
    {
        "number": 70,
        "filename": "070_climbing_stairs.png",
        "prompt": """Create a visual mnemonic for Climbing Stairs (Fibonacci Dynamic Programming).

The mechanism: A staircase where each step has a number on it. Step 1 shows "1", 
step 2 shows "2", step 3 shows "3" (which equals 1+2). Arrows flow from steps 
N-1 and N-2 into step N, showing how the count combines. A small Fibonacci 
spiral subtly overlays or sits beside the stairs.

Style: Clean educational diagram. The key visual is the "combining arrows" 
showing how each step's count comes from the two before it. 
The Fibonacci connection should click."""
    },
    {
        "number": 121,
        "filename": "121_best_time_to_buy_sell_stock.png",
        "prompt": """Create a visual mnemonic for Best Time to Buy and Sell Stock (Track Minimum).

The mechanism: A stock chart line graph. A "flag" or "pin" is planted 
at the lowest point seen so far. A person stands at the current (higher) 
point, looking back at the flag, measuring the distance between them 
(the profit). The flag represents "min price so far."

Style: Clean line graph illustration. The flag at the minimum is key. 
Show the "looking backward" concept - you can only buy in the past. 
The measuring of the gap between flag and current position = profit."""
    },
    {
        "number": 200,
        "filename": "200_number_of_islands.png",
        "prompt": """Create a visual mnemonic for Number of Islands (DFS Flood Fill).

The mechanism: A grid/map view with several islands. One island is being 
"flooded" or "painted" - the color spreads from the starting cell to 
all connected land cells, sinking them. A counter shows "1" for this 
island. Another untouched island waits to be discovered and will 
increment the counter to "2".

Style: Top-down map view. Show the "spreading" flood-fill from one 
cell to connected cells. The counter incrementing each time a NEW 
island is discovered and sunk."""
    },
    {
        "number": 141,
        "filename": "141_linked_list_cycle.png",
        "prompt": """Create a visual mnemonic for Linked List Cycle Detection (Floyd's Tortoise and Hare).

The mechanism: A chain of connected nodes. Two runners on the chain - 
one taking big strides (fast), one taking small strides (slow). 
The chain curves into a loop. The fast runner has gone around and is 
approaching the slow runner from behind - about to "lap" them. 
The collision point is highlighted.

Style: Show the chain/node structure clearly. The loop is visible. 
The key moment: fast catching up to slow from behind. 
The insight: if they meet, there's a cycle."""
    },
]


def generate_image(prompt: str, filename: str) -> bool:
    """Generate an image using OpenAI's API and save it to the output directory."""
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    print(f"🎨 Generating {filename}...")
    
    try:
        response = client.images.generate(
            model="gpt-image-1.5",
            prompt=prompt,
            n=1,
            size="1536x1024",  # Landscape for algorithm diagrams
            quality="high",
        )
        
        # Get the image data (base64 encoded)
        image_data = response.data[0].b64_json
        
        # Decode and save
        image_bytes = base64.b64decode(image_data)
        with open(output_path, "wb") as f:
            f.write(image_bytes)
        
        print(f"✅ Saved {filename}")
        return True
        
    except Exception as e:
        print(f"❌ Error generating {filename}: {e}")
        return False


def main():
    """Generate all mnemonic images."""
    print("=" * 60)
    print("Visual Mnemonic Image Generator")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Problems to generate: {len(PROBLEMS)}")
    print()
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Generate each image
    success_count = 0
    for problem in PROBLEMS:
        print(f"\n📝 Problem {problem['number']}: {problem['filename']}")
        if generate_image(problem["prompt"], problem["filename"]):
            success_count += 1
    
    print()
    print("=" * 60)
    print(f"Done! Generated {success_count}/{len(PROBLEMS)} images.")
    print(f"Images saved to: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
