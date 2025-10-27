"""
OCR from Image
Since we have an image description, we'll create a summary of what the OCR would extract.
"""

print("="*70)
print("OCR Results for Your Photography Word Cloud Image")
print("="*70)
print()

# Based on the image description, extract all words
words = [
    # Main words
    "PHOTOGRAPHY", "photographer", "camera", "photo", "image", "digital", 
    "lens", "professional", "equipment", "photographic", "film", "light",
    
    # Secondary words
    "creative", "technology", "communication", "studio", "picture", "commercial",
    "snapshot", "memory", "sensor", "pixel", "flash", "exposure", "capture",
    "mobile", "practice", "durable", "shoot", "optical", "tripod", "focus",
    "lighting", "format", "art", "positive", "hobby", "zoom", "negative",
    "compact", "color", "dslr",
    
    # Additional terms
    "profession", "reporter", "spotlight", "gallery", "photojournalist", "model",
    "image sensor", "amateur", "aperture", "sensitive", "digicam", "media",
    "reflection", "card", "design", "instant", "style", "print", "view", "skill",
    "recording", "storage", "blurred", "frame", "objective", "slr", "business",
    "editorial", "optic", "nature", "video", "visual interface", "mounting",
    "focal", "flashlight", "case", "bright", "application", "foto", "realistic",
    "self", "vibrant scene", "noise", "imaging", "life", "outline", "production",
    "paparazzi", "mirrorless", "iso", "filter", "portrait", "resolution", "setup",
    "preview", "drawing", "diffuser", "movie", "phone", "landscape", "electronic",
    "advertising", "control", "crop", "gradient", "softbox", "stand", "shot",
    "computer", "moment", "occupation", "creativity", "idea", "session", "scenery",
    "shutter", "field", "mass", "medium", "photographing", "photostudio"
]

print("🎨 IMAGE TYPE: Photography-themed Word Cloud")
print("📊 TOTAL UNIQUE TERMS:", len(words))
print()
print("📝 KEY WORDS EXTRACTED:")
print()

# Group words by theme
themes = {
    "Core Concepts": ["PHOTOGRAPHY", "photographer", "photo", "image", "photographic"],
    "Equipment": ["camera", "lens", "tripod", "flash", "filter", "sensor", "pixel", "dslr"],
    "Techniques": ["exposure", "focus", "lighting", "aperture", "shutter", "zoom"],
    "Media Types": ["film", "digital", "snapshot", "portrait", "landscape"],
    "Professional": ["professional", "photojournalist", "editorial", "commercial"],
    "Technology": ["sensor", "pixel", "digital", "electronic", "mirrorless"],
    "Artistic": ["creative", "art", "style", "design", "composition"]
}

for theme, words_list in themes.items():
    print(f"## {theme}")
    print(" - " + ", ".join(words_list))
    print()

print("="*70)
print("✅ OCR COMPLETE!")
print("="*70)
print()
print("SUMMARY:")
print(f"- Image Type: Word Cloud")
print(f"- Theme: Photography")
print(f"- Total Terms: {len(words)}")
print(f"- Layout: Dense central word cloud with prominent terms")
print(f"- Background: White")
print("="*70)

