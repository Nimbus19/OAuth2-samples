export const JavascriptTester = () => {
    var testArea;
    var logger;

    const init = async (Logger, HTMLDivElement) => {
        testArea = HTMLDivElement;
        logger = Logger;

        addButtonsToTestArea();
    }

    const addButtonsToTestArea = () => {
        var lable = document.createElement("lable");
        lable.innerHTML = "JavaScript Tester"
        testArea.appendChild(lable);
        testArea.appendChild(document.createElement("br"));

        const createButton = (btnName, callback) => {
            var btn = document.createElement("button");
            btn.innerHTML = btnName;
            btn.onclick = callback;
            testArea.appendChild(btn);
        }

        createButton("Closure", testClosure);
        createButton("Web Crypto API", testWebCrypto);
        createButton("Web Worker", testWebWorker);
    }

    const testClosure = () => {
        function oauth() {
            // private member
            var accessToken = "";
            var refresToken = "";

            function runAuthFlow() {
                accessToken = "AT1";
                refresToken = "RT1";
            }

            // public member
            return {
                init: function () {
                    runAuthFlow();
                },
                getAT: function () {
                    return accessToken;
                }
            };
        };

        const client = oauth();
        client.init();
        console.log(client.getAT());// "AT1"
        console.log(client.accessToken);// undefined
        console.log(client.refresToken);// undefined
    }

    const testWebCrypto = () => {
        window.crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: "P-256", // the curve name
            },
            true, // <== Here if you want it to be exportable !!
            ["sign", "verify"] // usage
        )
            .then(function (key) {
                //returns a keypair object
                console.log(key);
                console.log(key.publicKey);
                console.log(key.privateKey);
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    const testWebWorker = () => {
        if (window.Worker) {
            const myWorker = new Worker("js/modules/test/MyWorker.js");
            console.log('Send message to worker');
            myWorker.postMessage(["Hello ", "Worker!"]);
            myWorker.onmessage = function (e) {
                console.log('Message received from worker');
                console.log(e.data);
            }
        }
        else {
            console.log('Your browser doesn\'t support web workers.');
        }
    }

    return {
        init: init
    }
}