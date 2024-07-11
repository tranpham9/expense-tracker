import { createContext, useState } from "react";
import { LoginResponse } from "../utility/api/types/Responses";

// https://stackoverflow.com/questions/68799234/typescript-pick-only-specific-method-from-overload-to-be-passed-to-parameterst
// type a = ReturnType<typeof useState<boolean>>;
export const LoginContext = createContext<{ isLoggedIn: boolean; setIsLoggedIn: (isLoggedIn: boolean) => void }>({ isLoggedIn: false, setIsLoggedIn: () => {} });
export function LoginContextProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</LoginContext.Provider>;
}

export const AccountOverlayContext = createContext<{ isAccountOverlayVisible: boolean; setIsAccountOverlayVisible: (isAccountOverlayVisible: boolean) => void }>({
    isAccountOverlayVisible: false,
    setIsAccountOverlayVisible: () => {},
});
export function AccountOverlayContextProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
    const [isAccountOverlayVisible, setIsAccountOverlayVisible] = useState(false);

    return <AccountOverlayContext.Provider value={{ isAccountOverlayVisible, setIsAccountOverlayVisible }}>{children}</AccountOverlayContext.Provider>;
}

export const AccountContext = createContext<{ account?: LoginResponse; setAccount: (account?: LoginResponse) => void }>({ setAccount: () => {} });
export function AccountContextProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
    const [account, setAccount] = useState<LoginResponse | undefined>();

    return <AccountContext.Provider value={{ account, setAccount }}>{children}</AccountContext.Provider>;
}
