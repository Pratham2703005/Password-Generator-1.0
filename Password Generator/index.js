const inputSlider= document.querySelector("[data-lenSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const refBtn = document.querySelector("[data-ref]");
const refCon = document.querySelector("[data-refContent");
let password = "";
let passwordLen = 10;
let checkCount = 0;
//data-indicator is grey

//copy checkbox
setIndicator("#ccc")
//handleSlider - set password length
handleSlider();
function handleSlider(){
    inputSlider.value = passwordLen;
    lengthDisplay.innerText = passwordLen;

    const min  = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLen - min)*100/(max - min))+"% 100%";

}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}
//get random numbers
function getRndInt(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber(){
    return getRndInt(0,9);
}
function getLowerCase(){
    return String.fromCharCode(getRndInt(97,123))
}

function getUpperCase(){
    return String.fromCharCode(getRndInt(65,91))
}
const symbols = '?@[]^_`{|}~!#$%&()*+,-./:;<=>';
function getSymbol(){
    const tmp = getRndInt(0,symbols.length);
    return symbols.charAt(tmp);
}
function calStrength(){
    let upper = false;
    let lower = false;
    let num  = false;
    let sym = false;
    if(uppercaseCheck.checked) upper = true;
    if(lowercaseCheck.checked) lower = true;
    if(numbersCheck.checked) num  = true;
    if(symbolsCheck.checked) sym  = true;

    if(upper && lower && (num || sym) && passwordLen >= 8){
        setIndicator("#0f0");
    }else if((upper || lower) && (num || sym) && passwordLen >=6){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    //to be continued
    copyMsg.classList.add("active");
    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function refContent() {
    password = "";
    passwordLen = 10;
    passwordDisplay.value = password;
    handleSlider();
    setIndicator("#ccc");

    allCheckBox.forEach((checkbox) => {
        checkbox.checked = false;
    });
    checkCount = 0;

    refCon.innerText = "refresh";
    refCon.classList.add("active");
    setTimeout(() => {
        refCon.classList.remove("active");
    }, 2000);
}

refBtn.addEventListener('click',refContent);
// refBtn.addEventListener('click',window.location.reload());
inputSlider.addEventListener('input',(e)=>{
    passwordLen = e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLen < checkCount){
        passwordLen = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

generateBtn.addEventListener('click',() =>{
    if(checkCount <= 0 ){
        return;
    }
    if(passwordLen < checkCount){
        passwordLen = checkCount;
        handleSlider();
    }

    password="";
    
    let funArr=[];
    if(uppercaseCheck.checked){
        funArr.push(getUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(getLowerCase);
    }
    if(symbolsCheck.checked){
        funArr.push(getSymbol);
    }
    if(numbersCheck.checked){
        funArr.push(getRandomNumber);
    }
    for(let i=0;i<funArr.length;i++){
        password += funArr[i]();
    }

    for(let i=0;i<passwordLen - funArr.length;i++){
        let rndIndex = getRndInt(0,funArr.length);
        password += funArr[rndIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calStrength();
})

function shufflePassword(array){
    //fisher yates method
    for(let i  =array.length-1;i>0;i--){
        const j = Math.floor(Math.random() *( i+1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    let str = "";
    array.forEach((el) => {str += el});
    return str;
}