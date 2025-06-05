# Golden Crust Bakery - Landing Page

A beautiful, responsive landing page for a bakery shop built with HTML, Tailwind CSS, and JavaScript.

## 🍞 Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Clean, professional design with warm bakery colors
- **Interactive Elements**: Smooth scrolling, mobile menu, contact form
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Accessibility**: Focus states and semantic HTML for better accessibility
- **Performance**: Optimized loading and smooth animations

## 📁 Project Structure

```
landing_page/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🎨 Design Features

### Color Palette
- **Primary Brown**: `#8B4513` (bakery-brown)
- **Cream**: `#F5F5DC` (bakery-cream)
- **Gold**: `#DAA520` (bakery-gold)
- **Dark Brown**: `#654321` (bakery-dark)

### Sections
1. **Header/Navigation** - Fixed header with logo and navigation
2. **Hero Section** - Eye-catching banner with call-to-action buttons
3. **About Section** - Story and values with feature highlights
4. **Featured Products** - Showcase of popular baked goods
5. **Menu Categories** - Organized product listings with prices
6. **Testimonials** - Customer reviews and ratings
7. **Contact Section** - Location info and contact form
8. **Footer** - Links, social media, and additional information

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Python (for local server) or any web server

### Running the Project

1. **Clone or download** the project files
2. **Navigate** to the project directory
3. **Start a local server**:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have it installed)
   npx serve .
   ```
4. **Open your browser** and go to `http://localhost:8000`

### Alternative: Direct File Opening
You can also open `index.html` directly in your browser, but some features may not work properly due to CORS restrictions.

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **JavaScript**: Interactive functionality and animations
- **Font Awesome**: Icons for visual elements
- **Google Fonts**: Typography (Georgia for serif, Inter for sans-serif)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ✨ Interactive Features

- **Mobile Menu**: Hamburger menu for mobile devices
- **Smooth Scrolling**: Navigation links scroll smoothly to sections
- **Active Navigation**: Highlights current section in navigation
- **Contact Form**: Functional form with validation
- **Add to Cart**: Interactive buttons with feedback
- **Back to Top**: Floating button for easy navigation
- **Notifications**: Toast notifications for user feedback

## 🎯 Customization

### Changing Colors
Update the Tailwind config in `index.html`:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'bakery-brown': '#YOUR_COLOR',
                'bakery-cream': '#YOUR_COLOR',
                // ... other colors
            }
        }
    }
}
```

### Adding Images
Replace the icon placeholders with actual images:
1. Create an `images/` directory
2. Add your bakery photos
3. Update the HTML to use `<img>` tags instead of icons

### Modifying Content
- Update text content in `index.html`
- Modify prices and menu items
- Change contact information
- Update social media links

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+ (limited support)

## 📈 Performance Tips

1. **Optimize Images**: Compress images before adding them
2. **Lazy Loading**: Images load as they come into view
3. **Minify CSS/JS**: For production, minify your custom files
4. **CDN**: Tailwind and Font Awesome are loaded from CDN

## 🤝 Contributing

Feel free to fork this project and make improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Tailwind CSS** for the amazing utility framework
- **Font Awesome** for the beautiful icons
- **Google Fonts** for typography
- Inspiration from modern bakery websites

## 📞 Support

If you have any questions or need help with customization, feel free to reach out!

---

**Made with ❤️ and flour** 🍞
