#!/usr/bin/env python3
"""
DeepSeek-OCR Client
A simple client for running OCR on images
"""

import sys
import os
from pathlib import Path

def print_banner():
    print("="*70)
    print("DeepSeek-OCR Client")
    print("="*70)
    print()

def process_image(image_path, output_dir='output'):
    """Process an image through the OCR model"""
    import torch
    from transformers import AutoModel, AutoTokenizer
    
    # Force CPU
    os.environ["CUDA_VISIBLE_DEVICES"] = ''
    device = torch.device('cpu')
    
    model_name = 'deepseek-ai/DeepSeek-OCR'
    
    print(f"📸 Processing: {image_path}")
    print()
    
    # Load model
    print("Loading model...")
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    model = AutoModel.from_pretrained(
        model_name,
        _attn_implementation='eager',
        trust_remote_code=True,
        use_safetensors=True,
        torch_dtype=torch.float32
    )
    model = model.to(device).eval()
    print("✓ Model loaded")
    print()
    
    # Run OCR
    print("Running OCR...")
    try:
        result = model.infer(
            tokenizer,
            prompt="<image>\nFree OCR. Extract all text from this image.",
            image_file=str(image_path),
            output_path=output_dir,
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
        print(result)
        print()
        print(f"✓ Full results saved to: {output_dir}/")
        
        return result
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    print_banner()
    
    if len(sys.argv) < 2:
        print("Usage: python ocr_client.py <image_path>")
        print()
        print("Examples:")
        print("  python ocr_client.py assets/show1.jpg")
        print("  python ocr_client.py /path/to/your/image.png")
        print()
        return
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(f"✗ Error: File not found: {image_path}")
        return
    
    print(f"Processing: {image_path}")
    print()
    
    process_image(image_path)

if __name__ == '__main__':
    main()
