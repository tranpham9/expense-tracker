import { UsersLoginResponse } from "./api/types/Responses";

export function saveAccountInfo(account: UsersLoginResponse) {
    console.log("Account info updated to", account);
    localStorage.setItem("account", JSON.stringify(account));
}

export function clearAccountInfo() {
    localStorage.removeItem("account");
}

export function loadAccountInfo() {
    const accountString = localStorage.getItem("account");
    if (!accountString) {
        return null;
    }

    return JSON.parse(accountString) as UsersLoginResponse;
}
