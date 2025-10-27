"""
DeepSeek-OCR Simple Demo
This script demonstrates that the model loads successfully.
Note: Full inference requires GPU (CUDA) support.
"""

import os
import torch
from transformers import AutoModel, AutoTokenizer

# Force CPU usage
os.environ["CUDA_VISIBLE_DEVICES"] = ''
device = torch.device('cpu')

model_name = 'deepseek-ai/DeepSeek-OCR'

print("="*70)
print("DeepSeek-OCR Model Loading Demo")
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
    use_safetensors=True
)
model = model.to(device).eval()
print("   ✓ Model loaded")
print()

print("="*70)
print("✅ SUCCESS! Model loaded successfully!")
print("="*70)
print()

print("Model Information:")
print(f"  - Model type: {type(model).__name__}")
print(f"  - Device: {device}")
print(f"  - Parameters: {sum(p.numel() for p in model.parameters()):,}")
print()

print("⚠️  GPU Requirement Notice:")
print()
print("   The DeepSeek-OCR model's inference code requires CUDA (GPU) support.")
print("   The model itself loads successfully on CPU, but the .infer() method")
print("   has hardcoded .cuda() calls that require a GPU.")
print()
print("   To run full OCR inference, you need:")
print("   1. A GPU with CUDA support")
print("   2. CUDA-enabled PyTorch installed")
print("   3. The model will then process images in seconds")
print()
print("   On CPU, you would need to modify the model code to replace")
print("   .cuda() with .to(device) throughout the implementation.")
print()

print("📝 Alternative Solutions:")
print()
print("   1. Use GPU (Recommended)")
print("      - Install CUDA-enabled PyTorch")
print("      - Run on a machine with GPU")
print()
print("   2. Use Cloud GPU")
print("      - Run on Google Colab (free GPU)")
print("      - Use AWS/GCP with GPU instances")
print()
print("   3. Modify Model Code")
print("      - Edit modeling_deepseekocr.py")
print("      - Replace .cuda() with .to(device)")
print()

print("="*70)
print("✅ Model is ready! Setup successful!")
print("="*70)
