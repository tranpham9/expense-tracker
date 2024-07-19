// import { createContext, useState } from "react";
// import { LoginResponse } from "../utility/api/types/Responses";
// import { loadAccountInfo } from "../utility/Persist";

// // TODO: this should probably instead be tied to the account context once jwt verification and refreshing is properly set up on the API side
// // https://stackoverflow.com/questions/68799234/typescript-pick-only-specific-method-from-overload-to-be-passed-to-parameterst
// // type a = ReturnType<typeof useState<boolean>>;
// // export const LoginContext = createContext<{ isLoggedIn: boolean; setIsLoggedIn: (isLoggedIn: boolean) => void }>({ isLoggedIn: false, setIsLoggedIn: () => {} });
// // export function LoginContextProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
// //     const [isLoggedIn, setIsLoggedIn] = useState(!!loadAccountInfo());

// //     return <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</LoginContext.Provider>;
// // }

// export const AccountOverlayContext = createContext<{ isAccountOverlayVisible: boolean; setIsAccountOverlayVisible: (isAccountOverlayVisible: boolean) => void }>({
//     isAccountOverlayVisible: false,
//     setIsAccountOverlayVisible: () => {},
// });
// export function AccountOverlayContextProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
//     const [isAccountOverlayVisible, setIsAccountOverlayVisible] = useState(false);

//     return <AccountOverlayContext.Provider value={{ isAccountOverlayVisible, setIsAccountOverlayVisible }}>{children}</AccountOverlayContext.Provider>;
// }

// export const AccountContext = createContext<{ account?: LoginResponse; setAccount: (account?: LoginResponse) => void }>({ setAccount: () => {} });
// export function AccountContextProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
//     const [account, setAccount] = useState(loadAccountInfo() || undefined);

//     // TODO: I don't think it's a good idea to have this inside the context provider?
//     /*
//     useEffect(() => {
//         if (account) {
//             saveAccountInfo(account);
//         }
//     }, [account]);
//     */

//     return <AccountContext.Provider value={{ account, setAccount }}>{children}</AccountContext.Provider>;
// }
