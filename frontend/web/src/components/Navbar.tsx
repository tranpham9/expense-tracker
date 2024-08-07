import { useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
import AccountOverlay from "./AccountOverlay";
import { getInitials } from "../utility/Manipulation";
import { isLoggedIn, userInfo } from "../Signals/Account";
import { useSignal, useSignals } from "@preact/signals-react/runtime";
import { currentTrip } from "../Signals/Trip";
import { SvgIcon } from "@mui/material";
import Logo from "../assets/logo.svg?react";
import EditInfoOverlay from "./EditInfoOverlay";

type Page = {
    name: string;
    customPath?: string;
    getEnabled: () => boolean;
};

type Option = {
    name: string;
    action: () => void;
};

// TODO: make all navbar buttons (when in the widest layout) the same width
export default function Navbar() {
    useSignals();

    const navigate = useNavigate();
    const location = useLocation();
    const isCurrentPage = (page: Page) => {
        const pageName = page.name.toLowerCase();
        const currentPage = location.pathname.slice(1);

        // home page is also represented by root path ( / )
        return (pageName === "home" && !currentPage.length) || pageName === currentPage;
    };

    const isAccountOverlayVisible = useSignal(false);
    const isEditInfoOverlayVisible = useSignal(false);

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
            getEnabled: () => true,
        },
        {
            name: "Trips",
            getEnabled: () => isLoggedIn.value,
        },
        {
            name: "Expenses",
            getEnabled: () => isLoggedIn.value && !!currentTrip.value,
        },
    ];

    const options: Option[] = [
        {
            name: "Profile",
            action: () => {
                navigate(`/profile/${userInfo.value?.userId}`);
            },
        },
        {
            name: "Settings",
            action: () => {
                isEditInfoOverlayVisible.value = true;
            },
        },
        {
            name: "Logout",
            action: () => {
                // userJWT.value = null;
                userInfo.value = null;
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
                        <SvgIcon
                            component="a"
                            href="https://github.com/tranpham9/expense-tracker/"
                            target="_blank"
                            color="primary"
                            aria-hidden="false"
                            aria-label="Open GitHub Repository"
                            sx={{
                                fontSize: 32,
                                display: { xs: "none", md: "flex" },
                                mr: 2,
                            }}
                        >
                            <Logo />
                        </SvgIcon>
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
                                        selected={isCurrentPage(page)}
                                        onClick={() => navigateToPage(page)}
                                        disabled={!page.getEnabled()}
                                    >
                                        <Typography textAlign="center">{page.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <SvgIcon
                            component="a"
                            href="https://github.com/tranpham9/expense-tracker/"
                            target="_blank"
                            color="primary"
                            aria-hidden="false"
                            aria-label="Open GitHub Repository"
                            sx={{
                                fontSize: 32,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                            }}
                        >
                            <Logo />
                        </SvgIcon>
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
                                    disabled={!page.getEnabled()}
                                    sx={{
                                        mx: 0.5,
                                        my: 2,
                                        px: 0,
                                        width: "100px",
                                        display: "block",
                                        ...(isCurrentPage(page) && { outlineColor: "secondary.main", outlineWidth: 2, outlineStyle: "solid" }),
                                    }}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>

                        {isLoggedIn.value ? (
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title={<Typography variant="body2">Open options</Typography>}>
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar alt="Account">{userInfo.value && getInitials(userInfo.value.name)}</Avatar>
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
                                onClick={() => {
                                    isAccountOverlayVisible.value = true;
                                }}
                                sx={{ mx: 0.5, my: 2, display: "block" }}
                            >
                                Login / Signup
                            </Button>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            <AccountOverlay isAccountOverlayVisible={isAccountOverlayVisible} />
            <EditInfoOverlay isEditInfoOverlayVisible={isEditInfoOverlayVisible} />
        </>
    );
}
