# Carousel Images Setup

## Current Status
✅ Carousel component is configured and working
✅ Using high-quality placeholder images from Unsplash
✅ Images are properly sized and optimized for web

## Current Images
The carousel currently displays:
1. **Slide 1**: Beauty salon interior (Welcome message)
2. **Slide 2**: Professional beauty treatment (Services message)  
3. **Slide 3**: Spa and beauty results (Contact/Booking message)

## To Add Your Own Images

### Step 1: Prepare Your Images
- **Recommended size**: 1200px wide × 600px tall (2:1 aspect ratio)
- **Formats**: JPG or PNG
- **File size**: Keep under 500KB for fast loading
- **Content**: High-quality photos of your salon, team, or services

### Step 2: Add Images to Project
1. Save your images in: `/public/images/`
2. Use descriptive names like:
   - `salon-interior.jpg`
   - `team-photo.jpg` 
   - `beauty-results.jpg`

### Step 3: Update Code
Edit `/src/pages/Home.jsx` and change the image URLs:

```jsx
const slides = [
  {
    image: '/images/salon-interior.jpg',  // Your local image
    alt: 'Our beautiful salon interior',
    title: 'Welcome to Sunshine Threading',
    subtitle: 'Experience precise threading and beauty services',
    cta: { text: 'Book Now', href: '/booking' }
  },
  // ... repeat for other slides
];
```

### Step 4: Preview
- View carousel at: http://localhost:5178/
- Check image preview at: http://localhost:5178/carousel-preview.html

## Tips for Great Carousel Images
- Use bright, well-lit photos
- Show your salon's atmosphere and professionalism
- Include photos of actual services being performed
- Ensure faces are clearly visible and smiling
- Use consistent color scheme that matches your brand

## Image Optimization Tools
- Online: TinyPNG, ImageOptim
- Photoshop: Save for Web
- Free tools: GIMP, Canva

## Need Help?
If you need help with image editing or have questions about the carousel setup, just ask!