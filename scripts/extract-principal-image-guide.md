# Principal Photo Extraction Guide

## Source Document
- **File**: `/Users/mohammad/Projects/oiaaedmonton.ca/public/uploads/documents/staff/OIAACADEMY_PRINCIPAL_MB_Application.pdf`
- **Page**: 1 (Cover Letter page)
- **Location**: Top-left circular profile image

## Target Location
- **Path**: `/Users/mohammad/Projects/oiaaedmonton.ca/public/images/faculty/mohamed-bush.jpg`
- **Format**: JPG or PNG
- **Recommended Size**: 400x400px (square)
- **Quality**: High resolution for web display

## Photo Description
The PDF contains a professional circular headshot of Mohamed Bush:
- Professional attire (dark suit, light purple tie)
- Wearing traditional Islamic cap (kufi)
- Professional lighting and composition
- Suitable for leadership profile display

## Manual Extraction Steps
1. Open the PDF in a PDF reader or editor
2. Take a screenshot or use PDF image extraction tools
3. Crop the circular profile image
4. Resize to 400x400px (or similar square format)
5. Save as high-quality JPG
6. Replace the placeholder file at the target location

## Automated Options
```bash
# Using PDF image extraction tools (if available):
# pdfimages -j OIAACADEMY_PRINCIPAL_MB_Application.pdf output/
# convert output/image.ppm -resize 400x400^ -gravity center -crop 400x400+0+0 mohamed-bush.jpg
```

## Verification
After updating the image:
1. Check the admin faculty page at `http://localhost:3000/admin/faculty`
2. Verify the home page leadership section at `http://localhost:3000`
3. Ensure the image displays properly in both locations

## Current Status
✅ Database updated with image path: `/images/faculty/mohamed-bush.jpg`
⏳ Need to replace placeholder with actual extracted image