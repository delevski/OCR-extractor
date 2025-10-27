'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './components/FileUpload';
import ResultsPanel from './components/ResultsPanel';
import HistoryPanel from './components/HistoryPanel';
import LoadingAnimation from './components/LoadingAnimation';
import Header from './components/Header';
import { calculateFileHash, getCachedResult, saveToCache, isCached } from './utils/cache';

type TaskType = 'markdown' | 'describe' | 'free' | 'location' | 'custom';

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskType>('free');
  const [customPrompt, setCustomPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ocr-history');
      if (saved) {
        try {
          setHistory(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse history:', e);
        }
      }
    }
  }, []);

  const getPromptForTask = useCallback((task: TaskType, customPromptText: string): string => {
    const basePrompt = '<image>\n';
    
    switch (task) {
      case 'markdown':
        return basePrompt + '<|grounding|>Convert the document to structured markdown.';
      case 'describe':
        return basePrompt + 'Describe this image in detail.';
      case 'free':
        return basePrompt + 'Free OCR.';
      case 'location':
        return basePrompt + '<|grounding|>Find specific text in image.';
      case 'custom':
        return basePrompt + customPromptText;
      default:
        return basePrompt + 'Free OCR.';
    }
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    setIsFromCache(false);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Calculate file hash
      const fileHash = await calculateFileHash(file);
      const prompt = getPromptForTask(selectedTask, customPrompt);
      
      // Check if cached
      const cached = getCachedResult(fileHash);
      
      if (cached && cached.task === selectedTask && cached.prompt === prompt) {
        // Use cached result
        console.log('Using cached result for:', fileHash.substring(0, 16));
        setResult(cached.result);
        setIsFromCache(true);
        setIsProcessing(false);
        
        // Add to history
        const historyItem = {
          id: Date.now(),
          fileName: file.name,
          timestamp: new Date().toISOString(),
          text: cached.result,
          task: selectedTask,
          fromCache: true,
        };
        
        const updatedHistory = [historyItem, ...history];
        setHistory(updatedHistory);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('ocr-history', JSON.stringify(updatedHistory.slice(0, 10)));
        }
        
        return;
      }

      // Not cached, upload to backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', selectedTask);
      formData.append('prompt', prompt);
      formData.append('fileHash', fileHash); // Send hash to backend

      // Change this to your backend endpoint
      const response = await fetch('http://localhost:5000/infer', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const extractedText = data.text || data.result || 'No text extracted';

      // Save to cache
      saveToCache(fileHash, extractedText, selectedTask, prompt);
      
      setResult(extractedText);
      setIsFromCache(false);

      // Save to history
      const historyItem = {
        id: Date.now(),
        fileName: file.name,
        timestamp: new Date().toISOString(),
        text: extractedText,
        task: selectedTask,
      };

      const updatedHistory = [historyItem, ...history];
      setHistory(updatedHistory);
      
      // Save to localStorage only on client side
      if (typeof window !== 'undefined') {
        localStorage.setItem('ocr-history', JSON.stringify(updatedHistory.slice(0, 10)));
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  }, [history, selectedTask, customPrompt, getPromptForTask]);

  const handleNewUpload = () => {
    setResult(null);
    setError(null);
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header showHistory={showHistory} setShowHistory={setShowHistory} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HistoryPanel 
                history={history} 
                onSelect={(item) => {
                  setResult(item.text);
                  setShowHistory(false);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-6">
                {/* Task Selection */}
                {!result && !isProcessing && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Options</h2>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {([
                          { key: 'markdown', label: 'Markdown', desc: 'Convert to structured markdown (grounding ✅)' },
                          { key: 'free', label: 'Free OCR', desc: 'Simple text extraction' },
                          { key: 'location', label: 'Locate', desc: 'Find specific text (grounding ✅)' },
                          { key: 'describe', label: 'Describe', desc: 'General image description' },
                          { key: 'custom', label: 'Custom', desc: 'Your own prompt' }
                        ]).map(({ key, label, desc }) => (
                          <motion.button
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedTask(key as TaskType)}
                            className={`px-4 py-3 rounded-lg font-medium transition-all text-left ${
                              selectedTask === key
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <div className="font-semibold">{label}</div>
                            <div className={`text-xs mt-1 ${selectedTask === key ? 'text-white/90' : 'text-gray-500'}`}>
                              {desc}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {selectedTask === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder='Enter your custom prompt...\nTip: Add <|grounding|> for bounding boxes'
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          💡 Add <code className="bg-gray-100 px-1 rounded">&lt;|grounding|&gt;</code> to your prompt for bounding boxes
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Image Preview */}
                {uploadedImage && !result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Image</h3>
                    <div className="flex justify-center">
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="max-h-96 rounded-lg shadow-md"
                      />
                    </div>
                  </motion.div>
                )}

                {/* File Upload Section */}
                {!result && !isProcessing && (
                  <FileUpload onUpload={handleUpload} />
                )}

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 text-red-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Error</span>
                    </div>
                    <p className="text-red-700 mt-2">{error}</p>
                  </motion.div>
                )}

                {/* Loading Animation */}
                {isProcessing && <LoadingAnimation />}

                {/* Results Panel */}
                {result && !isProcessing && (
                  <ResultsPanel
                    text={result}
                    onNewUpload={handleNewUpload}
                    fromCache={isFromCache}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
