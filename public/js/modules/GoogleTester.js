import { Logger } from './Logger.js'
export const GoogleTester = () => {
    var testArea;
    var logger;
    var config;
    var authCode;
    var idToken;
    var accessToken;
    var refreshToken;

    const code_verifier = "5LIMMELSk8KvPILwSOtDlBnyk4JbUPjR20tBJCiTN4DCBoejBw58hy4n8veUZ6eA";
    const code_challenge = "jyoe6KV9qpUO13EzXXEGuDB941nrcNN-zmSGg6KfPGQ";

    const init = async (Logger, HTMLDivElement) => {
        testArea = HTMLDivElement;
        logger = Logger;
        var response = await fetch("../auth_config.json");
        config = (await response.json()).google;

        addButtonsToTestArea();
        checkAuthCode();
    }

    const addButtonsToTestArea = () => {

        var input = document.createElement("input");
        input.type = "password";
        input.id = "client_secret";
        input.placeholder = "Client secret";
        testArea.appendChild(input);

        testArea.appendChild(document.createElement("br"));

        const createButton = (btnName, callback) => {
            var btn = document.createElement("button");
            btn.innerHTML = btnName;
            btn.onclick = callback;
            testArea.appendChild(btn);
        }

        createButton("Auth grant", authGrant);
        createButton("Get token", getToken);
        createButton("Get user info.", getTokenInfo);
        createButton("Get new token", getNewToken);
        createButton("Revoke token", revokeToken);
    }    

    const checkAuthCode = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const shouldParseResult = urlParams.has("code") && urlParams.has("authuser");

        if (shouldParseResult) {
            logger.add("Get auth code.", urlParams.get("code"));
            authCode = urlParams.get("code");
        }
    }

    const authGrant = async () => {
        var authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" + 
        `client_id=${config.client_id}&` + 
        `scope=openid profile email&` + 
        `response_type=code&` + 
        `redirect_uri=http://localhost:3000&` +
        `access_type=offline&` +
        `code_challenge_method=S256&` + 
        `code_challenge=${code_challenge}`;

        window.location.href = authUrl;
    }

    const getToken = async () => {
        window.history.replaceState({}, document.title, "/");

        var myHeaders = new Headers();
        myHeaders.append("content-type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("client_id", config.client_id);
        urlencoded.append("client_secret", getSecret());
        urlencoded.append("grant_type","authorization_code");
        urlencoded.append("code", authCode);
        urlencoded.append("code_verifier", code_verifier);
        urlencoded.append("redirect_uri", "http://localhost:3000");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded
        };

        fetch("https://oauth2.googleapis.com/token", requestOptions)
        .then(response => response.json())
        .then(result => {
            logger.add("Get token.",JSON.stringify(result, null, 2));
            idToken = result.id_token;
            accessToken = result.access_token;
            refreshToken = result.refresh_token;
        })
        .catch(error => logger.add("Get token error.",error));
    }

    const getSecret = () => {
        return document.getElementById("client_secret").value;
    }

    const getTokenInfo = async () => {   
        fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`, {method: 'GET'})
        .then(response => response.text())
        .then(result => logger.add("Get ID token info.",result))
        .catch(error => logger.add("Get ID token info error.",error));

        fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`, {method: 'GET'})
        .then(response => response.text())
        .then(result => logger.add("Get access token info.",result))
        .catch(error => logger.add("Get access token info error.",error));        
    }

    const getNewToken = async () => {
        var myHeaders = new Headers();
        myHeaders.append("content-type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("client_id", config.client_id);
        urlencoded.append("client_secret", getSecret());
        urlencoded.append("grant_type","refresh_token");
        urlencoded.append("refresh_token",refreshToken);
        urlencoded.append("redirect_uri", "http://localhost:3000");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded
        };

        fetch("https://oauth2.googleapis.com/token", requestOptions)
        .then(response => response.json())
        .then(result => {
            logger.add("Get new tokens.",JSON.stringify(result, null, 2));
            idToken = result.id_token;
            accessToken = result.access_token;
        })
        .catch(error => logger.add("Get token error.",error));
    }

    const revokeToken = async () => {
        var myHeaders = new Headers();
        myHeaders.append("content-type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("client_id", config.client_id);
        urlencoded.append("token",refreshToken);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded
        };

        fetch("https://oauth2.googleapis.com/revoke", requestOptions)
        .then(response => logger.add("Revoke tokens.",response.status))
        .catch(error => logger.add("Revoke token error.",error));
    }

    return {
        init: init
    }
}