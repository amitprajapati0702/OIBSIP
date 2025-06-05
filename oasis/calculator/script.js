// Calculator State
let currentInput = '0';
let previousInput = null;
let operator = null;
let waitingForNewInput = false;

// Get display element
const display = document.getElementById('display');

// Update display function
function updateDisplay() {
    // Format the number to avoid overflow
    let displayValue = currentInput;
    
    // Handle very long numbers
    if (displayValue.length > 12) {
        if (displayValue.includes('e')) {
            displayValue = parseFloat(displayValue).toExponential(2);
        } else {
            displayValue = parseFloat(displayValue).toPrecision(8);
        }
    }
    
    display.textContent = displayValue;
}

// Input number function
function inputNumber(num) {
    if (waitingForNewInput) {
        currentInput = num;
        waitingForNewInput = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

// Input decimal function
function inputDecimal() {
    if (waitingForNewInput) {
        currentInput = '0.';
        waitingForNewInput = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

// Clear function
function clear() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForNewInput = false;
    updateDisplay();
}

// Toggle sign function
function toggleSign() {
    if (currentInput !== '0') {
        currentInput = currentInput.startsWith('-') 
            ? currentInput.slice(1) 
            : '-' + currentInput;
        updateDisplay();
    }
}

// Percentage function
function percentage() {
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

// Set operator function
function setOperator(op) {
    if (operator !== null && !waitingForNewInput) {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    waitingForNewInput = true;
}

// Calculate function
function calculate() {
    if (operator === null || waitingForNewInput) {
        return;
    }
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert('Error: Division by zero');
                clear();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operator = null;
    previousInput = null;
    waitingForNewInput = true;
    updateDisplay();
}

// Event listeners for buttons
document.addEventListener('DOMContentLoaded', function() {
    // Number buttons
    document.getElementById('zero').addEventListener('click', () => inputNumber('0'));
    document.getElementById('one').addEventListener('click', () => inputNumber('1'));
    document.getElementById('two').addEventListener('click', () => inputNumber('2'));
    document.getElementById('three').addEventListener('click', () => inputNumber('3'));
    document.getElementById('four').addEventListener('click', () => inputNumber('4'));
    document.getElementById('five').addEventListener('click', () => inputNumber('5'));
    document.getElementById('six').addEventListener('click', () => inputNumber('6'));
    document.getElementById('seven').addEventListener('click', () => inputNumber('7'));
    document.getElementById('eight').addEventListener('click', () => inputNumber('8'));
    document.getElementById('nine').addEventListener('click', () => inputNumber('9'));
    
    // Operation buttons
    document.getElementById('add').addEventListener('click', () => setOperator('+'));
    document.getElementById('subtract').addEventListener('click', () => setOperator('-'));
    document.getElementById('multiply').addEventListener('click', () => setOperator('×'));
    document.getElementById('divide').addEventListener('click', () => setOperator('÷'));
    
    // Special buttons
    document.getElementById('equals').addEventListener('click', calculate);
    document.getElementById('clear').addEventListener('click', clear);
    document.getElementById('decimal').addEventListener('click', inputDecimal);
    document.getElementById('toggle-sign').addEventListener('click', toggleSign);
    document.getElementById('percent').addEventListener('click', percentage);
});

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/=.'.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Number keys
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    }
    
    // Operation keys
    switch (key) {
        case '+':
            setOperator('+');
            break;
        case '-':
            setOperator('-');
            break;
        case '*':
            setOperator('×');
            break;
        case '/':
            setOperator('÷');
            break;
        case '=':
        case 'Enter':
            calculate();
            break;
        case '.':
            inputDecimal();
            break;
        case 'Escape':
        case 'c':
        case 'C':
            clear();
            break;
        case 'Backspace':
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
            break;
    }
});

// Initialize display
updateDisplay();
