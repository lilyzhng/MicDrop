#!/usr/bin/env python3
"""
Test single image generation with gpt-image-1.5
"""

import os
import base64
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env.local
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env.local"))

# OpenAI API setup (uses OPENAI_API_KEY from environment)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

OUTPUT_DIR = "/Users/lilyzhang/Desktop/MicDrop/memories"
FILENAME = "141_linked_list_cycle_v2.png"

PROMPT = """Create a visual mnemonic for Linked List Cycle Detection (Floyd's Tortoise and Hare).

The mechanism: A chain of connected nodes. Two runners on the chain - 
one taking big strides (fast), one taking small strides (slow). 
The chain curves into a loop. The fast runner has gone around and is 
approaching the slow runner from behind - about to "lap" them. 
The collision point is highlighted.

Style: Show the chain/node structure clearly. The loop is visible. 
The key moment: fast catching up to slow from behind. 
The insight: if they meet, there's a cycle."""

print("🎨 Generating 141 Linked List Cycle with gpt-image-1.5...")

try:
    response = client.images.generate(
        model="gpt-image-1.5",
        prompt=PROMPT,
        n=1,
        size="1536x1024",
        quality="high",
    )
    
    # Get the image data
    image_data = response.data[0].b64_json
    
    # Decode and save
    output_path = os.path.join(OUTPUT_DIR, FILENAME)
    image_bytes = base64.b64decode(image_data)
    with open(output_path, "wb") as f:
        f.write(image_bytes)
    
    print(f"✅ Saved to {output_path}")

except Exception as e:
    print(f"❌ Error: {e}")
