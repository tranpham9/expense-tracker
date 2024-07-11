import { useContext, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import AccountOverlay from "./AccountOverlay";
import { AccountContext, AccountOverlayContext, LoginContext } from "../Contexts/Account";
import { getInitials } from "../utility/Manipulation";
import { clearAccountInfo } from "../utility/Persist";

type Page = {
    name: string;
    customPath?: string;
    requiresLoggedIn?: boolean;
};

type Option = {
    name: string;
    action: () => void;
};

// TODO: make all navbar buttons (when in the widest layout) the same width
export default function Navbar() {
    const navigate = useNavigate();

    const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
    const { setIsAccountOverlayVisible } = useContext(AccountOverlayContext);
    const { account } = useContext(AccountContext);

    /*
    const [shouldShowAccountOverlay, setShouldShowAccountOverlay] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            setShouldShowAccountOverlay(false);
        }
        // navigate("/trips");
    }, [isLoggedIn]); // do not want to depend on navigate (otherwise this reruns whenever page changes)
    */

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOptionClick = (option: Option) => {
        handleCloseUserMenu();
        option.action();
    };

    const navigateToPage = (page: Page) => {
        console.log("navigating to", page.name);
        handleCloseNavMenu();
        navigate(`/${page.customPath ?? page.name.toLowerCase()}`);
    };

    const pages: Page[] = [
        {
            name: "Home",
        },
        {
            name: "Trips",
            requiresLoggedIn: true,
        },
    ];

    const options: Option[] = [
        {
            name: "Profile",
            action: () => {
                // TODO: impl
            },
        },
        {
            name: "Settings",
            action: () => {
                // TODO: impl
            },
        },
        {
            name: "Logout",
            action: () => {
                clearAccountInfo();
                setIsLoggedIn(false);
                // navigate("/home"); // this is done automatically with a useEffect
            },
        },
    ];

    return (
        <>
            <AppBar
                position="sticky"
                elevation={10}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon
                            sx={{
                                display: { xs: "none", md: "flex" },
                                mr: 1,
                            }}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="https://github.com/tranpham9/expense-tracker/"
                            target="_blank"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            LOGO
                        </Typography>

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem
                                        key={page.name}
                                        onClick={() => navigateToPage(page)}
                                        disabled={page.requiresLoggedIn && !isLoggedIn}
                                    >
                                        <Typography textAlign="center">{page.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <AdbIcon
                            sx={{
                                display: { xs: "flex", md: "none" },
                                mr: 1,
                            }}
                        />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="https://github.com/tranpham9/expense-tracker/"
                            target="_blank"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            LOGO
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            {pages.map((page) => (
                                <Button
                                    key={page.name}
                                    variant="contained"
                                    onClick={() => navigateToPage(page)}
                                    disabled={page.requiresLoggedIn && !isLoggedIn}
                                    sx={{ mx: 0.5, my: 2, display: "block" }}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>

                        {isLoggedIn ? (
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open options">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar alt="Account">{account && getInitials(account.name)}</Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {options.map((option) => (
                                        <MenuItem
                                            key={option.name}
                                            onClick={() => handleOptionClick(option)}
                                        >
                                            <Typography textAlign="center">{option.name}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => setIsAccountOverlayVisible(true)}
                                sx={{ mx: 0.5, my: 2, display: "block" }}
                            >
                                Login/Signup
                            </Button>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            <AccountOverlay />
        </>
    );
}
