"""
DeepSeek-OCR Demo Script (CPU Version)
Run OCR on a sample image using CPU
"""

import os
import torch
from transformers import AutoModel, AutoTokenizer

# Force CPU usage
os.environ["CUDA_VISIBLE_DEVICES"] = ''
device = torch.device('cpu')

# Configuration
model_name = 'deepseek-ai/DeepSeek-OCR'

print("Loading model for CPU inference...")
print("(This may take a minute to load on CPU)")

tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModel.from_pretrained(
    model_name, 
    _attn_implementation='eager',
    trust_remote_code=True, 
    use_safetensors=True,
    torch_dtype=torch.float32  # Use float32 for CPU
)
model = model.to(device).eval()

print("\n✓ Model loaded successfully on CPU!")
print("\nRunning OCR on sample image...")

# Run OCR on a sample image
image_file = 'assets/show1.jpg'
prompt = "<image>\nFree OCR."
output_path = 'output'

print(f"\nProcessing: {image_file}")
print(f"Prompt: {prompt}")
print(f"Device: {device}")
print("\nRunning inference (this will take some time on CPU, please be patient)...")
print("="*60)

try:
    res = model.infer(
        tokenizer, 
        prompt=prompt, 
        image_file=image_file, 
        output_path=output_path,
        base_size=640,  # Smaller size for CPU
        image_size=512, 
        crop_mode=False,
        save_results=True, 
        test_compress=True
    )
    
    print("\n" + "="*60)
    print("✓ OCR COMPLETE!")
    print("="*60)
    print("\nResult:")
    print(res)
    print("\n" + "="*60)
    print(f"✓ Results saved to: {output_path}/")
    
except Exception as e:
    import traceback
    print(f"\n✗ Error during inference: {e}")
    print("\nFull error:")
    traceback.print_exc()
    print("\nNote: This may be due to model compatibility issues with CPU.")
    print("The model is optimized for GPU usage.")
