#!/usr/bin/env python3
"""
Simple OCR Backend Server
Handles file uploads and returns extracted text
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import sys
import json
import hashlib
from datetime import datetime, timedelta

# Add DeepSeek-OCR to path
sys.path.insert(0, '../DeepSeek-OCR')

app = Flask(__name__)
CORS(app)

# Cache storage
CACHE_FILE = 'cache_data.json'
CACHE_EXPIRY_DAYS = 30

def load_cache():
    """Load cache from file"""
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_cache(cache):
    """Save cache to file"""
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f)

def is_cache_valid(timestamp_str):
    """Check if cache entry is still valid"""
    try:
        timestamp = datetime.fromisoformat(timestamp_str)
        age = datetime.now() - timestamp
        return age < timedelta(days=CACHE_EXPIRY_DAYS)
    except:
        return False

def clean_expired_cache(cache):
    """Remove expired entries from cache"""
    cleaned = {}
    for key, entry in cache.items():
        if is_cache_valid(entry.get('timestamp', '')):
            cleaned[key] = entry
    return cleaned

@app.route('/infer', methods=['POST'])
def infer():
    """Handle OCR inference requests"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Get task, prompt, and file hash from request
        task = request.form.get('task', 'free')
        prompt = request.form.get('prompt', '<image>\nFree OCR.')
        file_hash = request.form.get('fileHash', '')
        
        print(f"Task: {task}")
        print(f"Prompt: {prompt}")
        print(f"File hash: {file_hash[:16] if file_hash else 'N/A'}")
        
        # Check cache if hash is provided
        if file_hash:
            cache = load_cache()
            cache = clean_expired_cache(cache)
            
            cache_key = f"{file_hash}_{task}_{prompt}"
            if cache_key in cache:
                entry = cache[cache_key]
                print(f"Cache hit: {cache_key[:32]}")
                return jsonify({
                    'text': entry['result'],
                    'success': True,
                    'fromCache': True
                })
        
        print("Cache miss, processing file...")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name
        
        try:
            # Import OCR model
            import torch
            from transformers import AutoModel, AutoTokenizer
            
            # Force CPU
            os.environ["CUDA_VISIBLE_DEVICES"] = ''
            device = torch.device('cpu')
            model_name = 'deepseek-ai/DeepSeek-OCR'
            
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
            
            # Run OCR
            print(f"Processing: {file.filename}")
            result = model.infer(
                tokenizer,
                prompt=prompt,
                image_file=tmp_path,
                output_path='output',
                base_size=512,
                image_size=384,
                crop_mode=False,
                save_results=True,
                test_compress=True,
                eval_mode=True
            )
            
            # Save to cache if hash is provided
            if file_hash:
                cache = load_cache()
                cache = clean_expired_cache(cache)
                
                cache_key = f"{file_hash}_{task}_{prompt}"
                cache[cache_key] = {
                    'result': result,
                    'timestamp': datetime.now().isoformat(),
                    'task': task,
                    'prompt': prompt
                }
                save_cache(cache)
                print(f"Saved to cache: {cache_key[:32]}")
            
            return jsonify({'text': result, 'success': True, 'fromCache': False})
            
        except Exception as e:
            print(f"Error during OCR: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e), 'success': False}), 500
        
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("Starting OCR Backend Server...")
    print("Make sure DeepSeek-OCR is set up in ../DeepSeek-OCR")
    app.run(host='0.0.0.0', port=5000, debug=True)
