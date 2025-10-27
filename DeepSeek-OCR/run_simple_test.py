"""
Simplified DeepSeek-OCR test script
This demonstrates how to load and use the model without requiring actual image files.
"""

import os
from transformers import AutoModel, AutoTokenizer

# Configuration
model_name = 'deepseek-ai/DeepSeek-OCR'
os.environ["CUDA_VISIBLE_DEVICES"] = '0'

print(f"Loading model: {model_name}")
print("This will download the model on first run (can be several GB)")

try:
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    print("Tokenizer loaded successfully")
    
    print("Model loading... This may take a few minutes.")
    model = AutoModel.from_pretrained(
        model_name, 
        _attn_implementation='eager',  # Use eager attention for compatibility
        trust_remote_code=True, 
        use_safetensors=True
    )
    print("Model loaded successfully")
    
    # Set to evaluation mode
    model = model.eval()
    
    print("\nModel is ready to use!")
    print("\nTo use the model with an image:")
    print("1. Prepare your image file")
    print("2. Call: res = model.infer(tokenizer, prompt='<image>\\nFree OCR.', image_file='your_image.jpg', ...)")
    
except Exception as e:
    print(f"Error: {e}")
    print("\nPossible issues:")
    print("1. CUDA not available - you may need CPU version")
    print("2. Missing dependencies - run setup_and_run.sh")
    print("3. Need to install CUDA toolkit for GPU support")
