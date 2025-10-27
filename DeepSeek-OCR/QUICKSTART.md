# Quick Start Guide - DeepSeek-OCR

## 🚀 Fastest Way to Get Started

### Prerequisites
- Python 3.8+
- Conda (recommended) or pip

### Step 1: Create Environment
```bash
conda create -n deepseek-ocr python=3.12.9 -y
conda activate deepseek-ocr
```

### Step 2: Install Dependencies
```bash
# Basic requirements
pip install -r requirements.txt

# PyTorch (CPU version - works on all systems)
pip install torch torchvision torchaudio

# Or GPU version (if you have CUDA):
# pip install torch==2.6.0 torchvision==0.21.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu118
```

### Step 3: Run the Model

**Option A: Simple Test (Recommended First)**
```bash
cd DeepSeek-OCR/DeepSeek-OCR-master/DeepSeek-OCR-hf
python run_dpsk_ocr.py
```

**Option B: Use the Test Script**
```bash
python run_simple_test.py
```

### Step 4: Edit Configuration

Before running with your own images:
1. Open `DeepSeek-OCR/DeepSeek-OCR-master/DeepSeek-OCR-hf/run_dpsk_ocr.py`
2. Change `image_file = 'your_image.jpg'` to your actual image path
3. Change `output_path = 'your/output/dir'` to your desired output directory

## 📝 Common Usage Examples

### Free OCR (Simple Text Extraction)
```python
prompt = "<image>\nFree OCR."
```

### Document to Markdown
```python
prompt = "<image>\n<|grounding|>Convert the document to markdown."
```

### Figure Parsing
```python
prompt = "<image>\nParse the figure."
```

## ⚡ Quick Troubleshooting

**Problem: Python/Xcode errors**
```bash
xcode-select --install
```

**Problem: CUDA not available**
- Use CPU version of PyTorch (already included in instructions above)

**Problem: Missing dependencies**
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**Problem: Model download takes long**
- First run downloads ~GB of model files
- Uses internet connection - be patient

## 📚 More Information

- Full documentation: See `README_SETUP.md`
- Original repo: https://github.com/deepseek-ai/DeepSeek-OCR
- Model page: https://huggingface.co/deepseek-ai/DeepSeek-OCR

## ✅ Project is Ready!

The repository has been cloned and setup files created. You just need to:
1. Create Python environment
2. Install packages  
3. Run the script

Happy OCR-ing! 🎉
