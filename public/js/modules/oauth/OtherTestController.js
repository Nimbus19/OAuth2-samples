export const OtherTestController = () => {
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
        createButton("Open redirector", testRedirector);
        createButton("WebAuthn Create ", testWebAuthnCreateKey);
        createButton("WebAuthn Get ", testWebAuthnGetKey);
        
    }

    const testClosure = () => {

        function Closure() {
            // private member
            var secret = "My name is Jack";

            function encrypt(text) {
                return btoa(text);
            }

            // public member
            return {
                get: function () {
                    return encrypt(secret);
                }
            };
        };

        var closure = Closure();
        console.log(closure.get());  // "TXkgbmFtZSBpcyBKYWNr"
        console.log(closure.secret); // undefine

        btoa = (x) => {return x;};
        console.log(closure.get()); // "My name is Jack"

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
            const myWorker = new Worker("js/modules/oauth/MyWorker.js");
            myWorker.postMessage("Hello Worker!");
            myWorker.onmessage = function (e) {
                console.log(e.data);
            }
        }
        else {
            console.log('Your browser doesn\'t support web workers.');
        }
    }

    const testRedirector = () => {
        var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
        url += "/302?redirect=https://www.google.com/";
        url += window.location.hash;
        alert("Redirect to \n" + url);
        window.location.href = url;
    }

    const testWebAuthnCreateKey = () => {

        // sample arguments for registration
        var createCredentialDefaultArgs = {
            publicKey: {
                // Relying Party (a.k.a. - Service):
                rp: {
                    name: "Acme"
                },

                // User:
                user: {
                    id: new Uint8Array(16),
                    name: "john.p.smith@example.com",
                    displayName: "John P. Smith"
                },

                pubKeyCredParams: [{
                    type: "public-key",
                    alg: -7
                }],

                attestation: "direct",

                timeout: 60000,

                challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
                    0x8C, 0x0A, 0x26, 0xFF, 0x22, 0x91, 0xC1, 0xE9, 0xB9, 0x4E, 0x2E, 0x17, 0x1A, 0x98, 0x6A, 0x73,
                    0x71, 0x9D, 0x43, 0x48, 0xD5, 0xA7, 0x6A, 0x15, 0x7E, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0F, 0xEF
                ]).buffer
            }
        };        

        // register / create a new credential
        navigator.credentials.create(createCredentialDefaultArgs)
            .then((cred) => {
                console.log("NEW CREDENTIAL", cred);
                var credentialID = Array.from(new Uint8Array(cred.rawId));
                localStorage.setItem('credentialID', JSON.stringify(credentialID));
            })
            .catch((err) => {
                console.log("ERROR", err);
            });
    }

    const testWebAuthnGetKey = () => {

        // sample arguments for login
        var getCredentialDefaultArgs = {
            publicKey: {
                timeout: 60000,
                // allowCredentials: [newCredential] // see below
                challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
                    0x79, 0x50, 0x68, 0x71, 0xDA, 0xEE, 0xEE, 0xB9, 0x94, 0xC3, 0xC2, 0x15, 0x67, 0x65, 0x26, 0x22,
                    0xE3, 0xF3, 0xAB, 0x3B, 0x78, 0x2E, 0xD5, 0x6F, 0x81, 0x26, 0xE2, 0xA6, 0x01, 0x7D, 0x74, 0x50
                ]).buffer
            },
        };

        // normally the credential IDs available for an account would come from a server
        // but we can just copy them from above...
        var credentialID = new Uint8Array(JSON.parse(localStorage.getItem('credentialID')));
        var idList = [{
            id: credentialID,
            transports: ["usb", "nfc", "ble", "internal"],
            type: "public-key"
        }];
        getCredentialDefaultArgs.publicKey.allowCredentials = idList;
        getCredentialDefaultArgs.publicKey.userVerification = "discouraged";

        navigator.credentials.get(getCredentialDefaultArgs)
            .then((assertion) => {
                console.log("ASSERTION", assertion);                
            })
            .catch((err) => {
                console.log("ERROR", err);
            });
    }

    return {
        init: init
    }
}