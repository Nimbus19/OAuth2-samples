export const StringUtility = () => {

    // Generate a secure random string using the browser crypto functions
    const generateRandomString = () => {
        var array = new Uint32Array(28);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }

    // Calculate the SHA256 hash of the input text. 
    // Returns a promise that resolves to an ArrayBuffer
    const sha256 = (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    // Base64-urlencodes the input string
    const base64urlencode = (str) => {
        // Convert the ArrayBuffer to string using Uint8 array to convert to what btoa accepts.
        // btoa accepts chars only within ascii 0-255 and base64 encodes them.
        // Then convert the base64 encoded to base64url encoded
        //   (replace + with -, replace / with _, trim trailing =)
        return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    return {
        generateRandomString:generateRandomString,
        sha256:sha256,
        base64urlencode:base64urlencode
    }
}
