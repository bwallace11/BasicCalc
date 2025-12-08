
        let display = document.getElementById('display');
        let currentValue = '0';

        function updateDisplay() {
            display.textContent = currentValue;
        }

        function appendNumber(num) {
            if (currentValue === '0' || currentValue === 'Error') {
                currentValue = num;
            } else {
                currentValue += num;
            }
            updateDisplay();
        }

        function appendOperator(op) {
            if (currentValue === 'Error') {
                currentValue = '0';
            }
            const lastChar = currentValue[currentValue.length - 1];
            if ('+-*/'.includes(lastChar)) {
                currentValue = currentValue.slice(0, -1) + op;
            } else {
                currentValue += op;
            }
            updateDisplay();
        }

        function calculate() {
            try {
                currentValue = eval(currentValue).toString();
            } catch (e) {
                currentValue = 'Error';
            }
            updateDisplay();
        }

        function clearDisplay() {
            currentValue = '0';
            updateDisplay();
        }
  