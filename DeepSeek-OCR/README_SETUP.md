# DeepSeek-OCR Setup Guide

This repository has been cloned and is ready to use. Follow these steps to get it running.

## Prerequisites

1. **Python 3.8+** (3.12.9 recommended)
2. **CUDA-capable GPU** (for GPU acceleration) or CPU-only setup
3. **Conda** (recommended) or pip for package management

## Installation

### Option 1: Using Conda (Recommended)

```bash
# Create and activate conda environment
conda create -n deepseek-ocr python=3.12.9 -y
conda activate deepseek-ocr

# Install packages
pip install -r requirements.txt
pip install torch torchvision torchaudio

# For GPU support (CUDA 11.8):
pip install torch==2.6.0 torchvision==0.21.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu118

# Optional: Install flash-attn for better performance
pip install flash-attn --no-build-isolation
```

### Option 2: Using System Python

```bash
# Install requirements
pip install -r requirements.txt
pip install torch torchvision torchaudio
pip install transformers==4.46.3 tokenizers==0.20.3

# Optional: Install flash-attn
pip install flash-attn --no-build-isolation
```

### Option 3: Using the Setup Script

```bash
chmod +x setup_and_run.sh
./setup_and_run.sh
```

## Running the Model

### Using Transformers (Simpler)

```bash
cd DeepSeek-OCR-master/DeepSeek-OCR-hf
python run_dpsk_ocr.py
```

**Note:** Edit `run_dpsk_ocr.py` to:
- Change `image_file` to your actual image path
- Change `output_path` to your desired output directory

### Using vLLM (Better Performance)

```bash
cd DeepSeek-OCR-master/DeepSeek-OCR-vllm

# Edit config.py to set INPUT_PATH and OUTPUT_PATH
# Then run:
python run_dpsk_ocr_image.py  # For images
python run_dpsk_ocr_pdf.py    # For PDFs
```

### Simple Test

```bash
python run_simple_test.py
```

## Model Usage Examples

### Example 1: Free OCR
```python
prompt = "<image>\nFree OCR."
```

### Example 2: Convert to Markdown
```python
prompt = "<image>\n<|grounding|>Convert the document to markdown."
```

### Example 3: OCR with Grounding
```python
prompt = "<image>\n<|grounding|>OCR this image."
```

## Image Size Modes

- **Tiny**: base_size=512, image_size=512, crop_mode=False (64 vision tokens)
- **Small**: base_size=640, image_size=640, crop_mode=False (100 vision tokens)
- **Base**: base_size=1024, image_size=1024, crop_mode=False (256 vision tokens)
- **Large**: base_size=1280, image_size=1280, crop_mode=False (400 vision tokens)
- **Gundam**: base_size=1024, image_size=640, crop_mode=True (Dynamic)

## Troubleshooting

1. **CUDA not available**: Install CPU version of PyTorch
2. **Flash-attn fails**: You can run without it, performance will be slightly slower
3. **Model download**: First run will download the model (~several GB)
4. **Xcode errors**: If you see Xcode-related errors, run: `xcode-select --install`

## Project Structure

```
DeepSeek-OCR/
├── DeepSeek-OCR-master/
│   ├── DeepSeek-OCR-hf/          # Transformers implementation
│   │   └── run_dpsk_ocr.py
│   └── DeepSeek-OCR-vllm/        # vLLM implementation
│       ├── run_dpsk_ocr_image.py
│       ├── run_dpsk_ocr_pdf.py
│       └── config.py
├── requirements.txt
├── setup_and_run.sh
├── run_simple_test.py
└── README_SETUP.md
```

## References

- Original Repository: https://github.com/deepseek-ai/DeepSeek-OCR
- Hugging Face Model: https://huggingface.co/deepseek-ai/DeepSeek-OCR
- Paper: DeepSeek_OCR_paper.pdf
