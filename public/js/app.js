import { Logger } from './modules/Logger.js'
import { Auth0Tester } from './modules/test/Auth0Tester.js'
import { BFFTester } from './modules/test/BFFTester.js'
import { GoogleTester } from './modules/test/GoogleTester.js'
import { FacebookTester } from './modules/test/FacebookTester.js'
import { JavascriptTester } from './modules/test/JavascriptTester.js'

// Global variables
const logger = Logger();
const auth0Tester = Auth0Tester();
const bffTester = BFFTester();
const googleTester = GoogleTester();
const facebookTester = FacebookTester();
const jsTester = JavascriptTester();
let appState = null;

window.onload = () => {
    createLogger();    
    createTesterBtn();
    resumeApp();
}

const createLogger = () => {
    var logList = document.getElementById("sel-log-list");
    var logPanel = document.getElementById("ipt-log-detail");
    logger.init(logList, logPanel);
}

const createTesterBtn = () => {
    var testArea = document.getElementById("div-test-area");
    createButton("Start Auth0 Test" , ()=>{auth0Tester.init(logger, testArea)});
    createButton("Start BFF Test"   , ()=>{bffTester.init(logger, testArea)});
    createButton("Start Google Test", ()=>{googleTester.init(logger, testArea)});
    createButton("Start Facebook Test", ()=>{facebookTester.init(logger, testArea)});
    createButton("Start JavaScript Test", ()=>{jsTester.init(logger, testArea)});
}

const createButton = (btnName, callback) => {
    var testModule = document.getElementById("div-test-module");
    var btn = document.createElement("button");

    btn.innerHTML = btnName;
    btn.id = btnName;
    btn.onclick = ()=>{
        appState = btnName;
        localStorage.setItem('appState', appState);
        clearTestArea();
        callback();
    };
    testModule.appendChild(btn);
}

const resumeApp = () => {
    // Load state from previous session
    appState = localStorage.getItem('appState');
    var previousTester = document.getElementById(appState);

    if(previousTester) {
        previousTester.click();
    }
}

const clearTestArea = () => {
    var testArea = document.getElementById("div-test-area");
    while (testArea.firstChild) {
        testArea.removeChild(testArea.lastChild);
    }
    logger.clear();
}
