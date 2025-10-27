"""
DeepSeek-OCR Demo Script
Run OCR on a sample image
"""

import os
from transformers import AutoModel, AutoTokenizer

# Configuration
model_name = 'deepseek-ai/DeepSeek-OCR'
os.environ["CUDA_VISIBLE_DEVICES"] = '0'

print("Loading model...")
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModel.from_pretrained(
    model_name, 
    _attn_implementation='eager',
    trust_remote_code=True, 
    use_safetensors=True
)
model = model.eval()

print("\nModel loaded successfully!")
print("\nRunning OCR on sample image...")

# Run OCR on a sample image
image_file = 'assets/show1.jpg'
prompt = "<image>\nFree OCR."
output_path = 'output'

print(f"\nProcessing: {image_file}")
print(f"Prompt: {prompt}")
print("\nRunning inference (this may take a minute on CPU)...")

try:
    res = model.infer(
        tokenizer, 
        prompt=prompt, 
        image_file=image_file, 
        output_path=output_path,
        base_size=1024, 
        image_size=640, 
        crop_mode=True, 
        save_results=True, 
        test_compress=True
    )
    
    print("\n" + "="*60)
    print("OCR RESULT:")
    print("="*60)
    print(res)
    print("="*60)
    print(f"\nResults saved to: {output_path}")
    
except Exception as e:
    print(f"\nError during inference: {e}")
    print("\nThis is normal if running on CPU - it may take a very long time.")
    print("Try with a smaller image or wait for the full model to load.")
