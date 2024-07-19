import { computed, signal } from "@preact/signals-react";
import { clearAccountInfo, loadAccountInfo, saveAccountInfo } from "../utility/Persist";
import { UsersLoginResponse } from "../utility/api/types/Responses";

const account = loadAccountInfo();
export const userInfo = signal<Omit<UsersLoginResponse, "jwt"> | null>(account); // the jwt will still be there, but it shouldn't be taken into account
// split into separate variable to avoid unnecessary updating
export const userJWT = signal(account && account.jwt);

userJWT.subscribe((newJWT) => {
    if (newJWT && userInfo.value) {
        saveAccountInfo({ ...userInfo.value, jwt: newJWT });
    } else {
        clearAccountInfo();
        userInfo.value = null;
    }
});

export const isLoggedIn = computed(() => !!userJWT.value);
