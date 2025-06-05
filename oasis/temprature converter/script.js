// Temperature Converter JavaScript

class TemperatureConverter {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.temperatureInput = document.getElementById('temperature-input');
        this.fromUnit = document.getElementById('from-unit');
        this.toUnit = document.getElementById('to-unit');
        this.convertBtn = document.getElementById('convert-btn');
        this.swapBtn = document.getElementById('swap-units');
        this.resultSection = document.getElementById('result-section');
        this.resultValue = document.getElementById('result-value');
        this.resultFormula = document.getElementById('result-formula');
        this.inputError = document.getElementById('input-error');
    }

    attachEventListeners() {
        this.convertBtn.addEventListener('click', () => this.convertTemperature());
        this.swapBtn.addEventListener('click', () => this.swapUnits());
        this.temperatureInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertTemperature();
            }
        });
        this.temperatureInput.addEventListener('input', () => this.clearError());
    }

    validateInput(value) {
        if (value === '' || value === null || value === undefined) {
            return { isValid: false, message: 'Please enter a temperature value' };
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return { isValid: false, message: 'Please enter a valid number' };
        }

        // Check for absolute zero violations
        if (this.fromUnit.value === 'kelvin' && numValue < 0) {
            return { isValid: false, message: 'Kelvin temperature cannot be negative' };
        }

        if (this.fromUnit.value === 'celsius' && numValue < -273.15) {
            return { isValid: false, message: 'Temperature cannot be below absolute zero (-273.15°C)' };
        }

        if (this.fromUnit.value === 'fahrenheit' && numValue < -459.67) {
            return { isValid: false, message: 'Temperature cannot be below absolute zero (-459.67°F)' };
        }

        return { isValid: true, value: numValue };
    }

    convertTemperature() {
        const inputValue = this.temperatureInput.value.trim();
        const validation = this.validateInput(inputValue);

        if (!validation.isValid) {
            this.showError(validation.message);
            return;
        }

        const temperature = validation.value;
        const fromUnit = this.fromUnit.value;
        const toUnit = this.toUnit.value;

        if (fromUnit === toUnit) {
            this.showResult(temperature, toUnit, 'Same unit - no conversion needed');
            return;
        }

        const result = this.performConversion(temperature, fromUnit, toUnit);
        const formula = this.getConversionFormula(temperature, fromUnit, toUnit);
        
        this.showResult(result, toUnit, formula);
    }

    performConversion(temp, from, to) {
        // Convert to Celsius first (as base unit)
        let celsius;
        
        switch (from) {
            case 'celsius':
                celsius = temp;
                break;
            case 'fahrenheit':
                celsius = (temp - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = temp - 273.15;
                break;
        }

        // Convert from Celsius to target unit
        switch (to) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return (celsius * 9/5) + 32;
            case 'kelvin':
                return celsius + 273.15;
        }
    }

    getConversionFormula(temp, from, to) {
        const formulas = {
            'celsius-fahrenheit': `(${temp} × 9/5) + 32`,
            'fahrenheit-celsius': `(${temp} - 32) × 5/9`,
            'celsius-kelvin': `${temp} + 273.15`,
            'kelvin-celsius': `${temp} - 273.15`,
            'fahrenheit-kelvin': `((${temp} - 32) × 5/9) + 273.15`,
            'kelvin-fahrenheit': `((${temp} - 273.15) × 9/5) + 32`
        };

        return formulas[`${from}-${to}`] || 'Direct conversion';
    }

    showResult(value, unit, formula) {
        const unitSymbols = {
            celsius: '°C',
            fahrenheit: '°F',
            kelvin: 'K'
        };

        const roundedValue = Math.round(value * 100) / 100;
        this.resultValue.textContent = `${roundedValue}${unitSymbols[unit]}`;
        this.resultFormula.textContent = formula;
        
        this.resultSection.classList.add('show');
        this.clearError();
    }

    showError(message) {
        this.inputError.textContent = message;
        this.resultSection.classList.remove('show');
        this.temperatureInput.focus();
    }

    clearError() {
        this.inputError.textContent = '';
    }

    swapUnits() {
        const fromValue = this.fromUnit.value;
        const toValue = this.toUnit.value;
        
        this.fromUnit.value = toValue;
        this.toUnit.value = fromValue;

        // If there's a current result, convert it automatically
        if (this.temperatureInput.value.trim() !== '') {
            this.convertTemperature();
        }
    }

    getUnitName(unit) {
        const names = {
            celsius: 'Celsius',
            fahrenheit: 'Fahrenheit',
            kelvin: 'Kelvin'
        };
        return names[unit];
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverter();
    
    // Add some interactive effects
    addInteractiveEffects();
});

function addInteractiveEffects() {
    // Add floating animation to the thermometer icon
    const thermometerIcon = document.querySelector('.header i');
    if (thermometerIcon) {
        setInterval(() => {
            thermometerIcon.style.transform = `translateY(${Math.sin(Date.now() * 0.002) * 3}px)`;
        }, 16);
    }

    // Add ripple effect to buttons
    document.querySelectorAll('.convert-btn, .swap-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
