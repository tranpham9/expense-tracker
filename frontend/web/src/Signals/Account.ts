import { computed, signal } from "@preact/signals-react";
import { clearAccountInfo, loadAccountInfo, saveAccountInfo } from "../utility/Persist";
import { UsersLoginResponse } from "../utility/api/types/Responses";

const account = loadAccountInfo();
export const userInfo = signal<UsersLoginResponse | null>(account);
// split into separate variable to avoid unnecessary updating
// export const userJWT = signal(account && account.jwt);
export const userJWT = computed(() => userInfo.value?.jwt || null);

/*
userInfo.subscribe((newUserInfo) => {
    userJWT.value = newUserInfo?.jwt || null;
});
*/

/*
userJWT.subscribe((newJWT) => {
    console.log("jwt changed to", newJWT);

    if (newJWT && userInfo.value) {
        saveAccountInfo({ ...userInfo.value, jwt: newJWT });
    } else {
        clearAccountInfo();
        userInfo.value = null;
    }
});
*/
userInfo.subscribe((newUserInfo) => {
    if (newUserInfo) {
        saveAccountInfo(newUserInfo);
    } else {
        clearAccountInfo();
    }
});

export const isLoggedIn = computed(() => !!userInfo.value);
