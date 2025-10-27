#!/bin/bash
set -e

echo "Setting up DeepSeek-OCR environment..."

# Check if conda is available
if command -v conda &> /dev/null; then
    echo "Conda found. Creating environment..."
    conda create -n deepseek-ocr python=3.12.9 -y
    echo "Environment created. Activate it with: conda activate deepseek-ocr"
else
    echo "Conda not found. Using system Python or pip..."
fi

# Install basic requirements
echo "Installing requirements..."
pip install transformers==4.46.3
pip install tokenizers==0.20.3
pip install PyMuPDF
pip install img2pdf
pip install einops
pip install easydict
pip install addict
pip install Pillow
pip install numpy

# Try to install torch (CPU version as fallback)
echo "Installing PyTorch..."
pip install torch torchvision torchaudio || pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Try to install flash-attn (may fail on some systems)
echo "Attempting to install flash-attn..."
pip install flash-attn --no-build-isolation || echo "Warning: flash-attn installation failed, continuing without it..."

echo "Setup complete!"
echo ""
echo "To run the project:"
echo "1. Activate conda environment: conda activate deepseek-ocr"
echo "2. Edit the image file path in DeepSeek-OCR-master/DeepSeek-OCR-hf/run_dpsk_ocr.py"
echo "3. Run: cd DeepSeek-OCR-master/DeepSeek-OCR-hf && python run_dpsk_ocr.py"
