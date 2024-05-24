document.addEventListener('keydown', handleKeyDown);
const display = document.getElementById("display");

let firstNumber = null;
let secondNumber = null;
let step = 0;
let operation = null;
let result = 0;
let numArray = [];
let secondNumArray = [];

//Allows user to use keyboard to interact with calculator instead of clicking
function handleKeyDown(event) {
    const key = event.key;

    //Check if the key pressed is a digit, operator, or special key
    if (/[0-9]/.test(key) || key === '.' || key === 'Enter') {
        if (key === 'Enter') {
            calculate();
        } else {
            appendToDisplay(key);
        }
    } else if (['+', '-', '*', '/'].includes(key)) {
        getOperator(key);
    } else if (key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        const currentValue = display.value;
        display.value = currentValue.slice(0, -1);
        numArray.pop(); //Update the array if needed
        if (step === 1) {
            firstNumber = Number(numArray.join(''));
        } else if (step === 2) {
            secondNumArray.pop(); //Update the array for the second number
            secondNumber = Number(secondNumArray.join(''));
        }
    }
}
function appendToDisplay(num) {
    if (step === 0 || step === 1) {
        if (numArray.length === 0 && num === '-') {
            numArray.push(num); //Allow the first character to be '-' for negatives
            display.value = numArray.join('');  //Update display with the current number
            step = 1; 
            return;  //Exit the function to avoid processing further
        } else if (!isNaN(num) || num === '.') {
            if (num === '.' && numArray.includes('.')) {
                return;  //If decimal point already exists, do not allow another to be added
            }
            numArray.push(num);
        }
        step = 1;
        firstNumber = Number(numArray.join(''));
        display.value = numArray.join('');
    } else if (step === 2) {
        if (num === '-' && secondNumArray.length === 0 && ['+', '-', '*', '/'].includes(secondNumArray[secondNumArray.length - 1])) {
            //Allow the negative sign if it follows another operator
            secondNumArray.push(num);
            display.value = firstNumber + " " + operation + " " + secondNumArray.join('');
            return;
        } else if (!isNaN(num) || num === '.') {
            if (num === '.' && secondNumArray.includes('.')) {
                return;
            }
            secondNumArray.push(num);
        }
        secondNumber = Number(secondNumArray.join(''));
        display.value = firstNumber + " " + operation + " " + secondNumArray.join('');  //Update display with the full expression
    }
}
function clearDisplay() {
    display.value = "";
    firstNumber = null;
    secondNumber = null;
    step = 0;
    operation = null;
    result = 0;
    numArray = [];
    secondNumArray = [];
}
function getOperator(op) {
    if (firstNumber === null && numArray.length === 0) {
        //Prevent operation if no number is entered yet
        return;
    }

    if (step === 2 && secondNumber !== null) {
        calculate();
        firstNumber = result;
        secondNumber = null;
        secondNumArray = [];
    }
    step = 2;
    operation = op;
    display.value = firstNumber + " " + operation + " ";  //Update display with the operator
}
//Function to change the sign of a number
function toggleSign() {
    if (step === 1) {
        firstNumber = -firstNumber;
        display.value = firstNumber;
    } else if (step === 2) {
        secondNumber = -secondNumber;
        display.value = firstNumber + " " + operation + " " + secondNumber;
    }
}
function calculate() {
    console.log("Operation in calculate:", operation);
    if (secondNumber === null) {
        if (secondNumArray.length > 0 && secondNumArray[0] === '-') {
            secondNumber = 0;
        } else {
            return;
        }
    }

    if (operation === '+') {
        result = firstNumber + secondNumber;
    } else if (operation === '-') {
        result = firstNumber - secondNumber;
    } else if (operation === '*') {
        result = firstNumber * secondNumber;
    } else if (operation === '/') {
        if (secondNumber === 0) {
            alert("Division by zero is not allowed");
            clearDisplay();
            return;
        }
        result = firstNumber / secondNumber;
    }
    display.value = result;
    firstNumber = result;
    secondNumber = null;
    step = 1;
    numArray = [];
    secondNumArray = [];
}