export function setCookie() {
    document.cookie = "liked=true; max-age=3600";
}

export function checkCookies() {
    let cookies = document.cookie;
    console.log(cookies);
    return (cookies.includes("liked=true"));
}