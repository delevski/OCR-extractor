"""
DeepSeek-OCR Full CPU-Compatible Demo
Uses the patched model for CPU inference
"""

import os
import torch
from transformers import AutoModel, AutoTokenizer

# Force CPU usage
os.environ["CUDA_VISIBLE_DEVICES"] = ''
device = torch.device('cpu')

model_name = 'deepseek-ai/DeepSeek-OCR'

print("="*70)
print("DeepSeek-OCR Full CPU-Compatible Demo")
print("="*70)
print()

print("📦 Loading model from HuggingFace...")
print(f"   Model: {model_name}")
print(f"   Device: {device}")
print()

# Load tokenizer
print("🔧 Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
print("   ✓ Tokenizer loaded")
print()

# Load model
print("🤖 Loading model (this may take a minute)...")
model = AutoModel.from_pretrained(
    model_name, 
    _attn_implementation='eager',
    trust_remote_code=True, 
    use_safetensors=True,
    torch_dtype=torch.float32
)

# Move model to CPU
model = model.to(device).eval()
print("   ✓ Model loaded on CPU")
print()

print("="*70)
print("✅ Model ready for CPU inference!")
print("="*70)
print()

# Run OCR on a sample image
image_file = 'assets/show1.jpg'
prompt = "<image>\nFree OCR."
output_path = 'output'

print("🚀 Running OCR on CPU...")
print(f"   Image: {image_file}")
print(f"   Prompt: {prompt}")
print(f"   Output: {output_path}")
print()
print("⏳ This will take some time on CPU (may take 5-15 minutes)...")
print("="*70)
print()

try:
    res = model.infer(
        tokenizer, 
        prompt=prompt, 
        image_file=image_file, 
        output_path=output_path,
        base_size=512,  # Smaller size for CPU
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
    print("="*70)
    print(f"✓ Full results saved to: {output_path}/")
    print()
    
except Exception as e:
    import traceback
    print()
    print("="*70)
    print("✗ Error during inference")
    print("="*70)
    print(f"Error: {e}")
    print()
    print("Full error:")
    traceback.print_exc()
    print()
    print("Note: CPU inference may take much longer than GPU.")
    print("The model has been patched for CPU compatibility.")

print("="*70)
