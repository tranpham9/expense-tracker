import { alpha, createTheme } from "@mui/material";
import { blue, common, grey, orange, red } from "@mui/material/colors";

const baseTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: blue[700],
            light: blue[600],
        },
        secondary: {
            // main: orange[500],
            main: alpha(orange[500], 0.6),
            contrastText: orange[500],
        },
        info: {
            // this is the same as primary.light; this is to work around how buttons can't use stuff other than "main" in the palette
            main: blue[600],
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
                        // borderColor: alpha(baseTheme.palette.secondary.main, 0.6),
                        borderColor: baseTheme.palette.secondary.main,
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
            MuiTabs: {
                styleOverrides: {
                    indicator: {
                        color: baseTheme.palette.primary.light,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        // This is required due to specificity issues (an error gets logged to the console otherwise; https://github.com/mui/material-ui/issues/22353 )
                        "&.Mui-selected": {
                            color: baseTheme.palette.primary.light,
                        },
                    },
                },
            },
        },
    },
    baseTheme
);
