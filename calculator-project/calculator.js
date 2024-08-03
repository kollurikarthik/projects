let calculation = '';
let isRadianMode = true;
let history = [];

function updateCalculation(value) {
    calculation += value;
    displayCalculation();
}

function displayCalculation() {
    document.getElementById('calculation').textContent = calculation;
}

function clearCalculation() {
    if (calculation !== '') {
        addToHistory(calculation + ' = ' + (eval(prepareCalculation(calculation)) || 'Error'));
    }
    calculation = '';
    displayCalculation();
}

function calculateResult() {
    try {
        const result = eval(prepareCalculation(calculation));
        addToHistory(calculation + ' = ' + result);
        calculation = result.toString();
        displayCalculation();
    } catch (error) {
        addToHistory(calculation + ' = Error');
        calculation = 'Error';
        displayCalculation();
    }
}

function prepareCalculation(calc) {
    return calc
        .replace(/Math.pow\((.*?),(.*?)\)/g, '($1**$2)')
        .replace(/Math.asin/g, 'Math.asin')
        .replace(/Math.acos/g, 'Math.acos')
        .replace(/Math.atan/g, 'Math.atan')
        .replace(/Math.sin\(/g, isRadianMode ? 'Math.sin(' : '(x => Math.sin(x * Math.PI / 180))(')
        .replace(/Math.cos\(/g, isRadianMode ? 'Math.cos(' : '(x => Math.cos(x * Math.PI / 180))(')
        .replace(/Math.tan\(/g, isRadianMode ? 'Math.tan(' : '(x => Math.tan(x * Math.PI / 180))(');
}

function toggleDegRad() {
    isRadianMode = !isRadianMode;
    updateCalculation(isRadianMode ? 'Rad' : 'Deg');
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function addToHistory(entry) {
    history.unshift(entry);
    if (history.length > 10) {
        history.pop();
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        historyList.appendChild(li);
    });
    
    const resetButton = document.getElementById('reset-history');
    resetButton.style.display = history.length > 0 ? 'block' : 'none';
}

function resetHistory() {
    history = [];
    updateHistoryDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (/[0-9]/.test(key)) {
        updateCalculation(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        updateCalculation(key);
    } else if (key === '.' || key === '(' || key === ')') {
        updateCalculation(key);
    } else if (key === 'Enter') {
        calculateResult();
    } else if (key === 'Backspace') {
        calculation = calculation.slice(0, -1);
        displayCalculation();
    } else if (key === 'Escape') {
        clearCalculation();
    } else if (key === '^') {
        updateCalculation('Math.pow(');
    } else if (key.toLowerCase() === 's') {
        updateCalculation('Math.sin(');
    } else if (key.toLowerCase() === 'c') {
        updateCalculation('Math.cos(');
    } else if (key.toLowerCase() === 't') {
        updateCalculation('Math.tan(');
    } else if (key.toLowerCase() === 'l') {
        updateCalculation('Math.log(');
    } else if (key.toLowerCase() === 'e') {
        updateCalculation('Math.E');
    } else if (key.toLowerCase() === 'p') {
        updateCalculation('Math.PI');
    }
});

// Initialize the history display
updateHistoryDisplay();