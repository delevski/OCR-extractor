# 🎨 OCR Web App - New Features

## ✅ Latest Updates

### 1. **Task Selection Options** 🎯

Choose from 5 different task types before processing your image:

- **Markdown**: Convert document to markdown format
- **Describe**: Detailed image description
- **Free OCR**: Standard text extraction
- **Location**: Extract location information
- **Custom**: Enter your own custom prompt

### 2. **Image Preview** 📸

- See a preview of your uploaded image before processing
- Full-size preview with rounded corners
- Fades in smoothly with animation

### 3. **Custom Prompt Input** ✍️

When "Custom" task is selected:
- Text area appears with smooth animation
- Enter your own custom prompt
- Perfect for specific OCR needs

### 4. **Enhanced UI** 🎨

- Beautiful task selection buttons with gradient
- Active task highlighted in blue-purple gradient
- Hover and click animations
- Responsive grid layout (2 cols mobile, 3 cols desktop)

## 📋 Task Prompts

| Task | Prompt | Grounding |
|------|--------|-----------|
| Markdown | Convert the document to structured markdown. | ✅ |
| Free OCR | Free OCR. | ❌ |
| Locate | Find specific text in image. | ✅ |
| Describe | Describe this image in detail. | ❌ |
| Custom | Your custom text here | Optional: Add `<|grounding|>` |

**Grounding**: Enables bounding boxes for visual elements

## 🚀 How to Use

1. **Select a task** from the task options panel
2. For "Custom": Enter your custom prompt in the text area
3. **Upload an image** by drag & drop or click
4. See **image preview**
5. Wait for processing
6. View results with copy/download options

## 💡 Use Cases

### Markdown Task ✅ Grounding
- Convert scanned documents to structured markdown
- Extract formatted content with structure
- Document understanding with grounding

### Free OCR Task
- Standard text extraction
- Simple text recognition
- General OCR needs

### Locate Task ✅ Grounding
- Find specific text in images
- Text location with bounding boxes
- Visual text search

### Describe Task
- Get detailed image descriptions
- General image understanding
- Visual analysis

### Custom Task
- Specific extraction needs
- Custom instructions
- Specialized prompts
- Add `<|grounding|>` for bounding boxes

## 🔧 Technical Details

### Frontend Changes
- Added `selectedTask` state
- Added `customPrompt` state
- Added `uploadedImage` state for preview
- Task buttons with conditional rendering
- Smooth animations with Framer Motion

### Backend Changes
- Accepts `task` parameter in form data
- Accepts `prompt` parameter in form data
- Uses custom prompt for OCR inference
- Mock server updated to handle new parameters

### API Format
```
POST /infer
FormData:
  - file: <File>
  - task: 'markdown' | 'describe' | 'free' | 'location' | 'custom'
  - prompt: '<custom prompt>'
```

## 📱 Responsive Design

- **Mobile**: 2-column grid for task buttons
- **Tablet**: 3-column grid
- **Desktop**: 3-column grid
- All buttons scale and animate nicely

## 🎉 Ready to Use!

All features are now live and working. Try different task options to see how they affect the OCR results!
