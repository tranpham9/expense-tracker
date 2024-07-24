import { alpha, SvgIcon } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Logo from "../assets/logo.svg?react";

export default function Welcome() {
    return (
        <Container
            sx={{
                pt: { xs: 14, sm: 20 },
                pb: { xs: 8, sm: 12 },
            }}
        >
            <Typography
                variant="h2"
                align="center"
                fontSize={{ xs: 45, sm: 60 }}
            >
                Welcome to{" "}
                <Box
                    component="span"
                    color="primary.main"
                >
                    <Typography
                        component="span"
                        fontSize="inherit"
                        noWrap // keeps the logo together with the text
                    >
                        <SvgIcon fontSize="inherit">
                            <Logo />
                        </SvgIcon>
                        ccountability
                    </Typography>
                </Box>
            </Typography>
            <br />
            <Typography
                align="center"
                color={"text.secondary"}
            >
                Track and calculate shared trip expenses with your friends.
            </Typography>
            {/* FIXME: what is this supposed to be?  This image doesn't exist. */}
            <Box
                id="image"
                mt={{ xs: 8, sm: 10 }}
                sx={(theme) => ({
                    alignSelf: "center",
                    height: { xs: 200, sm: 500 },
                    width: "100%",
                    // backgroundImage:
                    //     theme.palette.mode === "light" ? 'url("/static/images/templates/templates-images/hero-light.png")' : 'url("/static/images/templates/templates-images/hero-dark.png")',
                    // backgroundSize: "cover",
                    borderRadius: "10px",
                    outline: "1px solid",
                    outlineColor: alpha(theme.palette.primary.main, 0.5),
                    boxShadow: `0 0 12px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                })}
            />
        </Container>
    );
}
