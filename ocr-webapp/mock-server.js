#!/usr/bin/env node

const http = require('http');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.url === '/infer' && req.method === 'POST') {
    let body = '';
    let fileName = 'uploaded file';
    let task = 'free';
    let prompt = '<image>\nFree OCR.';
    
    // Read the request body
    req.on('data', (chunk) => {
      body += chunk.toString();
      
      // Try to extract filename from multipart data
      const match = body.match(/filename="([^"]+)"/);
      if (match) {
        fileName = match[1];
      }
      
      // Try to extract task
      const taskMatch = body.match(/name="task"\r?\n\r?\n(\w+)/);
      if (taskMatch) {
        task = taskMatch[1];
      }
      
      // Try to extract prompt
      const promptMatch = body.match(/name="prompt"\r?\n\r?\n([^\r\n]+)/);
      if (promptMatch) {
        prompt = promptMatch[1];
      }
    });
    
    req.on('end', () => {
      // Mock OCR response
      console.log('Received file:', fileName);
      console.log('Task:', task);
      console.log('Prompt:', prompt);
      
      // Return mock extracted text with task-specific response
      let mockResponse = `Mock OCR Result from ${fileName}\n\n`;
      mockResponse += `Task: ${task}\n`;
      mockResponse += `Prompt: ${prompt}\n\n`;
      mockResponse += 'This is a mock response for testing the UI.\n';
      mockResponse += 'To use real OCR, start the Python backend server.';
      
      const response = {
        text: mockResponse,
        success: true
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
    
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Mock OCR server running on http://localhost:${PORT}`);
  console.log('\nNote: This is a mock server that returns fake OCR results.');
  console.log('For real OCR, start the Python backend: python server.py\n');
});
