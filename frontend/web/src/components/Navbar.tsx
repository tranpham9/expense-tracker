import { useState, type MouseEvent } from "react";
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

type Page = {
    name: string;
    customPath?: string;
    requiresLoggedIn?: boolean;
};

type Option = {
    name: string;
    action: () => void;
};

export default function Navbar({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean; setIsLoggedIn: (newValue: boolean) => void }) {
    const navigate = useNavigate();

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
        console.log("navigating to", page);
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
                setIsLoggedIn(false);
            },
        },
    ];

    return (
        <AppBar position="static">
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
                                onClick={() => navigateToPage(page)}
                                disabled={page.requiresLoggedIn && !isLoggedIn}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* Only render if logged in */}
                    {isLoggedIn && (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open options">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt="Remy Sharp"
                                        src="/static/images/avatar/2.jpg"
                                    />
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
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
