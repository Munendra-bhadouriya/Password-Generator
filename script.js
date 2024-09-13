const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const lengthDisplay = document.querySelector('[data-lengthNumber]')
const inputSlider = document.querySelector('[data-lengthSlider]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numberCheck = document.querySelector('#numbers');
const symbolCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');

let password = "";
let passwordLength = 10;
let checkCount = 0;
let symbols = "~`!@#$%^&*()_+-=[]{}\|?/>.<,:;'"
handleSlider();
setIndicator("#ccc");

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const max = inputSlider.max;
    const min = inputSlider.min;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"; 
    
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateRandomUpper() {
    return String.fromCharCode(getRndInteger(65,90));
}

function generateRandomLower() {
    return String.fromCharCode(getRndInteger(97, 122));
}

function generateRandomSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNumber = true;
    if (symbolCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasSymbol || hasNumber) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if (
        (hasUpper || hasLower) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

function handleCheckBoxChange() {
    checkCount = 0;

    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

generateBtn.addEventListener('click', () => {
    if (checkCount <= 0) {
        return;
    }

    if (checkCount > passwordLength) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funArr = [];

    if (uppercaseCheck.checked) funArr.push(generateRandomUpper);
    if (lowercaseCheck.checked) funArr.push(generateRandomLower);
    if (symbolCheck.checked) funArr.push(generateRandomSymbol);
    if (numberCheck.checked) funArr.push(generateRandomNumber);

    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let rndm = getRndInteger(0, funArr.length);
        password += funArr[rndm]();
    }

    password = shuffle(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}