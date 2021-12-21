export const Auth0Tester = () => {
    var testArea;
    var logger;
    var auth0Client;
    var accessToken;      

    const init = async (Logger, HTMLDivElement) => {
        testArea = HTMLDivElement;
        logger = Logger;       

        addButtonsToTestArea();

        await initauth0Client();
        if (auth0Client) {
            await checkAuthentication();
        }
    }

    const addButtonsToTestArea = () => {
        var lable = document.createElement("lable");
        lable.innerHTML = "Auth0 Tester"
        testArea.appendChild(lable);
        testArea.appendChild(document.createElement("br"));

        const createButton = (btnName, callback) => {
            var btn = document.createElement("button");
            btn.innerHTML = btnName;
            btn.onclick = callback;
            testArea.appendChild(btn);
        }
        createButton("Login", login);
        createButton("Get Token", getToken);
        createButton("Call API", callAPI);
        createButton("Logout", logout);
        var br = document.createElement("br");
        testArea.appendChild(br);
    }

    const initauth0Client = async () => {
        const response = await fetch("../auth_config.json");
        const config = (await response.json()).auth0;

        if (!auth0Client) {
            try {
                auth0Client = await createAuth0Client({
                    domain: config.domain,
                    client_id: config.clientId,
                    audience: config.audience,
                    cacheLocation: "localstorage",                    
                    useRefreshTokens: false
                });
                logger.add("Auth0 client created.");
            } catch (err) {
                logger.add("Error create Auth0 client.", err);
            }
        }
    }

    const checkAuthentication = async () => {
        const isAuthenticated = await auth0Client.isAuthenticated();

        if (isAuthenticated) {
            logger.add("User is authenticated.");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        else {
            logger.add("User not authenticated.");

            const query = window.location.search;
            const shouldParseResult = query.includes("code=") && query.includes("state=");

            if (shouldParseResult) {
                logger.add("Found auth code in URI.", query);
                try {
                    const result = await auth0Client.handleRedirectCallback();
                    logger.add("Parse auth code.");
                } catch (err) {
                    logger.add("Error parsing redirect.", err);
                }
                window.history.replaceState({}, document.title, "/");
            }
        }
    }

    const login = async () => {
        try {
            logger.add("Logging in");

            const options = {
                redirect_uri: window.location.origin
            };

            await auth0Client.loginWithRedirect(options);
            //await auth0Client.loginWithPopup();
        } catch (err) {
            logger.add("Log in failed", err);
        }
    };

    const logout = () => {
        try {
            logger.add("Logging out");
            auth0Client.logout({
                returnTo: window.location.origin
            });
        } catch (err) {
            logger.add("Log out failed", err);
        }
    };

    const getToken = async () => {
        var option = {
            audience: 'http://localhost:3010',
            scope: 'read:appointments',            
            ignoreCache: false
        }

        try {
            accessToken = await auth0Client.getTokenWithPopup(option);
            logger.add("Get access token.", accessToken);
        } catch (err) {
            logger.add("Get access token failed.", err);
        }
    };

    const callAPI = async () => {
        const result = await fetch('https://localhost:4433/authenticate', {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        var status = result.status;
        var response = await result.text();
        if (status < 400) {
            logger.add("Call API with token.", response);
        }
        else {
            logger.add("Call API with token failed.", response);
        }
    }

    return {
        init: init
    }
}