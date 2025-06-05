# Temperature Converter

A modern, responsive temperature converter web application that converts between Celsius, Fahrenheit, and Kelvin with an attractive user interface and smooth animations.

## Features

- **Multi-unit Support**: Convert between Celsius (°C), Fahrenheit (°F), and Kelvin (K)
- **Input Validation**: Ensures only valid numbers are accepted and prevents temperatures below absolute zero
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations and transitions
- **Interactive Elements**: 
  - Swap button to quickly exchange input/output units
  - Ripple effects on buttons
  - Floating thermometer icon animation
  - Real-time error feedback
- **Quick Reference**: Built-in reference table for common temperature points
- **Keyboard Support**: Press Enter to convert temperatures
- **Formula Display**: Shows the mathematical formula used for each conversion

## How to Use

1. **Enter Temperature**: Type a temperature value in the input field
2. **Select Units**: Choose the input unit (From) and output unit (To) from the dropdown menus
3. **Convert**: Click the "Convert Temperature" button or press Enter
4. **View Result**: The converted temperature will appear with the conversion formula
5. **Swap Units**: Use the swap button (⇄) to quickly exchange input and output units

## Temperature Conversion Formulas

### Celsius to Fahrenheit
```
°F = (°C × 9/5) + 32
```

### Fahrenheit to Celsius
```
°C = (°F - 32) × 5/9
```

### Celsius to Kelvin
```
K = °C + 273.15
```

### Kelvin to Celsius
```
°C = K - 273.15
```

### Fahrenheit to Kelvin
```
K = ((°F - 32) × 5/9) + 273.15
```

### Kelvin to Fahrenheit
```
°F = ((K - 273.15) × 9/5) + 32
```

## Technical Details

### Files Structure
- `index.html` - Main HTML structure
- `style.css` - CSS styling with modern design and animations
- `script.js` - JavaScript functionality and conversion logic
- `README.md` - Project documentation

### Technologies Used
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with flexbox, grid, gradients, and animations
- **JavaScript (ES6+)**: Object-oriented programming with classes
- **Font Awesome**: Icons for enhanced UI
- **Google Fonts**: Poppins font family for modern typography

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Quick Reference Values

| Description | Celsius | Fahrenheit | Kelvin |
|-------------|---------|------------|--------|
| Absolute Zero | -273.15°C | -459.67°F | 0K |
| Water Freezes | 0°C | 32°F | 273.15K |
| Room Temperature | 20°C | 68°F | 293.15K |
| Human Body Temperature | 37°C | 98.6°F | 310.15K |
| Water Boils | 100°C | 212°F | 373.15K |

## Installation

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. No additional setup or dependencies required!

## Features in Detail

### Input Validation
- Checks for empty inputs
- Validates numeric values
- Prevents temperatures below absolute zero for each unit
- Provides clear error messages

### Responsive Design
- Mobile-first approach
- Flexible layout that adapts to different screen sizes
- Touch-friendly interface elements

### Accessibility
- Semantic HTML structure
- Proper labeling for form elements
- Keyboard navigation support
- High contrast colors for readability

## License

This project is open source and available under the MIT License.
