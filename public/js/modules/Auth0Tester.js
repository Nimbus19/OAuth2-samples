export const Auth0Tester = () => {
    var _auth0;// The _auth0 client
    var _accessToken;
    var _testArea;// HTMLDivElement
    var _logger;// modules/_logger    

    const init = async (logger, div) => {
        _testArea = div;
        _logger = logger;       

        createButton("Login", login);
        createButton("Get Token", getToken);
        createButton("Call API", callAPI);
        createButton("Logout", logout);
        var br = document.createElement("br");
        _testArea.appendChild(br);

        await initauth0Client();
        if (_auth0) {
            await checkAuthentication();
        }
    }

    const createButton = (btnName, callback) => {
        var btn = document.createElement("button");
        btn.innerHTML = btnName;
        btn.onclick = callback;
        _testArea.appendChild(btn);
    }

    const initauth0Client = async () => {
        const response = await fetch("../auth_config.json");
        const config = await response.json();

        if (!_auth0) {
            try {
                _auth0 = await createAuth0Client({
                    domain: config.domain,
                    client_id: config.clientId,
                    audience: config.audience,
                    cacheLocation: "localstorage",
                    useRefreshTokens: true
                });
                _logger.add("Auth0 client created.");
            } catch (err) {
                _logger.add("Error create Auth0 client.", err);
            }
        }
    }

    const checkAuthentication = async () => {
        const isAuthenticated = await _auth0.isAuthenticated();

        if (isAuthenticated) {
            _logger.add("User is authenticated.");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        else {
            _logger.add("User not authenticated.");

            const query = window.location.search;
            const shouldParseResult = query.includes("code=") && query.includes("state=");

            if (shouldParseResult) {
                _logger.add("Found auth code in URI.", query);
                try {
                    const result = await _auth0.handleRedirectCallback();
                    _logger.add("Parse auth code.");
                } catch (err) {
                    _logger.add("Error parsing redirect.", err);
                }
                window.history.replaceState({}, document.title, "/");
            }
        }
    }

    const login = async () => {
        try {
            _logger.add("Logging in");

            const options = {
                redirect_uri: window.location.origin
            };

            await _auth0.loginWithRedirect(options);
            //await _auth0.loginWithPopup();
        } catch (err) {
            _logger.add("Log in failed", err);
        }
    };

    const logout = () => {
        try {
            _logger.add("Logging out");
            _auth0.logout({
                returnTo: window.location.origin
            });
        } catch (err) {
            _logger.add("Log out failed", err);
        }
    };

    const getToken = async () => {
        var option = {
            audience: 'http://localhost:3010',
            ignoreCache: false
        }

        try {
            _accessToken = await _auth0.getTokenSilently(option);
            _logger.add("Get access token.", _accessToken);
        } catch (err) {
            _logger.add("Get access token failed.", err);
        }
    };

    const callAPI = async () => {
        const result = await fetch('https://localhost:4433/authenticate', {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                Authorization: `Bearer ${_accessToken}`
            }
        });

        var status = result.status;
        var response = await result.text();
        if (status < 400) {
            _logger.add("Call API with token.", response);
        }
        else {
            _logger.add("Call API with token failed.", response);
        }
    }

    return {
        init: init
    }
}