# How to Install Python - Step by Step

## ⚠️ You Need to Run These Commands Yourself

The installation requires your admin password. Please run these commands in your terminal:

## Option 1: Fix Homebrew Permissions (Recommended)

Open Terminal and run:

```bash
# Step 1: Fix Homebrew permissions (requires your password)
sudo chown -R corphd /usr/local/share/man/man3 /usr/local/share/man/man5 /usr/local/share/man/man7

# Step 2: Install Python 3.12
brew install python@3.12

# Step 3: Verify installation
python3 --version
```

## Option 2: Use User-Installed Python (No Sudo Required)

If you can't use sudo, you can install Python to your home directory:

```bash
# Create a local directory for Python
mkdir -p ~/local/bin

# Download and install pyenv (Python version manager)
curl https://pyenv.run | bash

# Add to your shell profile (~/.zshrc or ~/.bash_profile)
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc

# Reload your shell
source ~/.zshrc

# Install Python 3.12
pyenv install 3.12.9

# Set as default
pyenv global 3.12.9

# Verify
python3 --version
```

## Option 3: Download Python Directly

1. Go to https://www.python.org/downloads/
2. Download Python 3.12 for macOS
3. Run the installer
4. Verify with: `python3 --version`

## Option 4: Install Anaconda/Miniconda (Easiest)

1. Download from https://www.anaconda.com/download
2. Run the installer
3. Open a new terminal
4. Type: `conda --version` to verify

## After Installation

Once Python is installed, come back here and run:

```bash
cd DeepSeek-OCR
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install torch torchvision torchaudio

# Then run the project
cd DeepSeek-OCR-master/DeepSeek-OCR-hf
python run_dpsk_ocr.py
```

## Why Installation is Needed

Your current system Python (`/usr/bin/python3`) has an Xcode dependency issue. Installing Python via Homebrew, Anaconda, or downloading directly will give you a working Python that can run the DeepSeek-OCR project.
