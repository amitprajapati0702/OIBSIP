# How to Add Swami Vivekananda's Image

## Quick Steps:

1. **Find a good image** of Swami Vivekananda (preferably high quality, square format works best)

2. **Save the image** in the same folder as your `index.html` file with the exact name:
   ```
   swami-vivekananda.jpg
   ```

3. **Supported formats**: 
   - `.jpg` or `.jpeg` (recommended)
   - `.png` 
   - `.webp`

4. **Image recommendations**:
   - **Size**: At least 400x400 pixels for best quality
   - **Format**: Square or portrait orientation works best
   - **Quality**: High resolution for crisp display

## File Structure:
```
tributepage/
├── index.html
├── swami-vivekananda.jpg  ← Your image goes here
├── README.md
└── IMAGE_INSTRUCTIONS.md
```

## What happens:
- ✅ **If image is found**: It will display beautifully in a circular frame with hover effects
- ❌ **If image is missing**: A fallback design with Om symbol and instructions will show

## Image Features:
- **Circular frame** with white border and shadow
- **Hover effect** - slight zoom on mouse over
- **Responsive** - scales properly on all devices
- **Optimized** - uses object-cover for best fit

## Alternative filenames (if needed):
If you want to use a different filename, edit line 70 in `index.html`:
```html
<img src="./your-image-name.jpg"
```

## Tips for best results:
1. Use a **portrait photo** of Swami Vivekananda
2. **High contrast** images work better
3. **Clear face visibility** for better recognition
4. **Professional or historical photos** are ideal

## Troubleshooting:
- Make sure the image is in the **same folder** as index.html
- Check the **filename spelling** exactly: `swami-vivekananda.jpg`
- Try **refreshing the browser** after adding the image
- Ensure the image **file isn't corrupted**

Once you add the image, refresh your browser to see Swami Vivekananda's photo displayed beautifully in the tribute page!
