export function saveJWT(jwt: string) {
    localStorage.setItem("jwt", jwt);
}

export function getJWT() {
    return localStorage.getItem("jwt");
}
