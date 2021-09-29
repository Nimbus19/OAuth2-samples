export const BFFTester = () => {
    var _testArea;// HTMLDivElement
    var _logger;// modules/_logger
    var apiData;
    var isBFFLogin;

    const init = async (logger, div) => {
        _testArea = div;
        _logger = logger;

        createButton("Login BFF", bffLogin);
        createButton("Process redirct", redirect);
        createButton("Get token", bffGetToken);
        createButton("Get user info.", bffUserInfo);
        createButton("Refresh token", bffRefresh);
        createButton("Logout", bffLogout);
        var br = document.createElement("br");
        _testArea.appendChild(br);
        createButton("Test closure", testClosure);
        createButton("Test WebCrypto", testWebCrypto);
        br = document.createElement("br");
        _testArea.appendChild(br);
    }

    const createButton = (btnName, callback) => {
        var btn = document.createElement("button");
        btn.innerHTML = btnName;
        btn.onclick = callback;
        _testArea.appendChild(btn);
    }

    const bffLogin = async () => {
        const result = await fetch('http://localhost:3020/bff/login/start', {
            method: 'POST',
            credentials: "include"
        });
        apiData.status = result.status;
        apiData.response = await result.json();
        isBFFLogin = true;
    }

    const redirect = async () => {
        if (apiData.status === 200) {
            window.location.replace(apiData.response.authorizationRequestUrl);
        }
    }

    const bffGetToken = async () => {
        const result = await fetch('http://localhost:3020/bff/login/end', {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pageUrl: window.location.href
            })
        });
        apiData.status = result.status;
        apiData.response = await result.json();
    }

    const bffUserInfo = async () => {
        const result = await fetch('http://localhost:3020/bff/userInfo', {
            method: 'GET',
            credentials: "include",
        });
        apiData.status = result.status;
        apiData.response = await result.json();
    }

    const bffRefresh = async () => {
        const result = await fetch('http://localhost:3020/bff/refresh', {
            method: 'POST',
            credentials: "include",
            headers: {
                "x-bff-csrf": apiData.response.csrf
            }
        });
        apiData.status = result.status;
        apiData.response = await result.json();
    }

    const bffLogout = async () => {
        const result = await fetch('http://localhost:3020/bff/logout', {
            method: 'POST',
            credentials: "include",
            headers: {
                "x-bff-csrf": apiData.response.csrf
            }
        });
        apiData.status = result.status;
        apiData.response = await result.json();
        window.history.replaceState({}, document.title, "/");
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
        client.getAT();// "AT1"
        client.accessToken;// undefined
        client.refresToken;// undefined
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

    return {
        init: init
    }
}