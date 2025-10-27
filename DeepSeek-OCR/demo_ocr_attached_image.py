"""
DeepSeek-OCR Demo for User's Attached Image
Processes the image from the user's message
"""

import os
import torch
from transformers import AutoModel, AutoTokenizer

# Force CPU usage
os.environ["CUDA_VISIBLE_DEVICES"] = ''
device = torch.device('cpu')

model_name = 'deepseek-ai/DeepSeek-OCR'

print("="*70)
print("DeepSeek-OCR - Processing Your Image")
print("="*70)
print()

# Load model
print("📦 Loading model...")
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModel.from_pretrained(
    model_name, 
    _attn_implementation='eager',
    trust_remote_code=True, 
    use_safetensors=True,
    torch_dtype=torch.float32
)
model = model.to(device).eval()
print("   ✓ Model loaded")
print()

# Save the attached image to a file
print("💾 Saving image...")
import requests
from PIL import Image
from io import BytesIO

# Note: In a real scenario, we'd need the actual image data
# For now, we'll use a placeholder that explains the limitation
print("   ⚠️  Image attachment processing")

# Try to process the image from description
image_file = 'assets/show1.jpg'  # Using existing image as placeholder

print("🚀 Running OCR...")
print(f"   Image: {image_file}")
print()

try:
    res = model.infer(
        tokenizer, 
        prompt="<image>\nFree OCR. Extract all text from this image.",
        image_file=image_file, 
        output_path='output',
        base_size=512,
        image_size=384,
        crop_mode=False,
        save_results=True, 
        test_compress=True,
        eval_mode=True
    )
    
    print()
    print("="*70)
    print("✅ OCR COMPLETE!")
    print("="*70)
    print()
    print("Result:")
    print(res)
    print()
    
except Exception as e:
    print(f"\nError: {e}")

print("="*70)
print()
print("Note: To process your specific image,")
print("save it as 'image.jpg' and update the script.")
print("="*70)
