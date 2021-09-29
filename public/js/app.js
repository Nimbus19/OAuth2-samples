import { Logger } from './modules/Logger.js'
import { Auth0Tester } from './modules/Auth0Tester.js'
import { BFFTester } from './modules/BFFTester.js'

// Global variables
const logger = Logger();
const auth0Tester = Auth0Tester();
const bffTester = BFFTester();
let appState = null;

window.onload = () => {

    var logList = document.getElementById("sel-log-list");
    var logPanel = document.getElementById("ipt-log-detail");
    logger.init(logList, logPanel);

    createButton("Start Auth0 Test", startAuth0Test);
    createButton("Start BFF Test", startBFFTest);

    resumeApp();
}

const createButton = (btnName, callback,) => {
    var testModule = document.getElementById("div-test-module");
    var btn = document.createElement("button");

    btn.innerHTML = btnName;
    btn.onclick = callback;
    testModule.appendChild(btn);
}

const resumeApp = () => {
    // Load state from previous session
    appState = localStorage.getItem('appState');

    if (appState == "Auth0 test") {
        startAuth0Test();
    }
    else if (appState == "BFF test") {
        startBFFTest();
    }
}

const startAuth0Test = () => {   
    appState = "Auth0 test";
    localStorage.setItem('appState', appState);

    clearTestArea();
    var testArea = document.getElementById("div-test-area");
    auth0Tester.init(logger, testArea);
}

const startBFFTest = () => {   
    appState = "BFF test";
    localStorage.setItem('appState', appState);

    clearTestArea();
    var testArea = document.getElementById("div-test-area");
    bffTester.init(logger, testArea);
}

const clearTestArea = () => {
    var testArea = document.getElementById("div-test-area");
    while (testArea.firstChild) {
        testArea.removeChild(testArea.lastChild);
    }
    logger.clear();
}
