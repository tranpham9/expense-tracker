import { alpha, createTheme } from "@mui/material";
import { blue, common, grey, orange, red } from "@mui/material/colors";

const baseTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: blue[700],
        },
        secondary: {
            main: orange[500],
        },
        background: {
            default: grey[900],
        },
        text: {
            primary: common["white"],
            secondary: grey[400],
        },
        error: {
            // This is the default error color for MUI (I added it to the palette so that it can be easily accessed/used in normal text as well)
            // main: "#f44336"
            main: red[500],
        },
    },
});

export const theme = createTheme(
    {
        components: {
            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor: alpha(baseTheme.palette.secondary.main, 0.6),
                    },
                },
            },
            MuiAvatar: {
                styleOverrides: {
                    colorDefault: {
                        backgroundColor: baseTheme.palette.primary.main,
                        color: baseTheme.palette.text.primary,
                    },
                },
            },
        },
    },
    baseTheme
);
