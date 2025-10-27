import re

file_path = '/Users/corphd/.cache/huggingface/modules/transformers_modules/deepseek-ai/DeepSeek-OCR/2c968b433af61a059311cbf8997765023806a24d/modeling_deepseekocr.py'

# Read the file
with open(file_path, 'r') as f:
    content = f.read()

# Replace .cuda() with .to(next(self.parameters()).device)
# This will automatically use the device that the model is on
content = content.replace('.cuda()', '.to(next(self.parameters()).device)')

# Also replace torch.autocast("cuda" with "cpu" for CPU compatibility
content = content.replace('torch.autocast("cuda"', 'torch.autocast("cpu"')

# Write back
with open(file_path, 'w') as f:
    f.write(content)

print("Patched model for CPU usage!")
print("Replaced .cuda() with .to(next(self.parameters()).device)")
print("Changed torch.autocast from cuda to cpu")
