import { Logger } from './modules/Logger.js'
import { Auth0Controller } from './modules/oauth/Auth0Controller.js'
import { BFFController } from './modules/oauth/BFFController.js'
import { GoogleController } from './modules/oauth/GoogleController.js'
import { FacebookController } from './modules/oauth/FacebookController.js'
import { OtherTestController } from './modules/oauth/OtherTestController.js'

// Global variables
const logger = Logger();
const auth0 = Auth0Controller();
const bff = BFFController();
const google = GoogleController();
const facebook = FacebookController();
const otherTest = OtherTestController();
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
    createButton("Start Auth0 Test" , ()=>{auth0.init(logger, testArea)});
    createButton("Start BFF Test"   , ()=>{bff.init(logger, testArea)});
    createButton("Start Google Test", ()=>{google.init(logger, testArea)});
    createButton("Start Facebook Test", ()=>{facebook.init(logger, testArea)});
    createButton("Start JavaScript Test", ()=>{otherTest.init(logger, testArea)});
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
