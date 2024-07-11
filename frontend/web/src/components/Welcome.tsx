// import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ImageCarousel from "./ImageCarousel";

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
                    sx={{ color: "primary.main" }}
                >
                    Accountability
                </Box>
            </Typography>
            <br />
            <Typography
                align="center"
                sx={{ color: "text.secondary" }}
            >
                Track and calculate shared trip expenses with your friends.
            </Typography>
            {/* FIXME: what is this supposed to be?  This image doesn't exist. */}
            {/* <Box
                id="image"
                sx={(theme) => ({
                    mt: { xs: 8, sm: 10 },
                    alignSelf: "center",
                    height: { xs: 200, sm: 700 },
                    width: "100%",
                    backgroundImage:
                        theme.palette.mode === "light" ? 'url("/static/images/templates/templates-images/hero-light.png")' : 'url("/static/images/templates/templates-images/hero-dark.png")',
                    backgroundSize: "cover",
                    borderRadius: "10px",
                    outline: "1px solid",
                    outlineColor: theme.palette.mode === "light" ? alpha("#BFCCD9", 0.5) : alpha("#9CCCFC", 0.1),
                    boxShadow: theme.palette.mode === "light" ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}` : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
                })}
            /> */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 10
                }}
            >
                <ImageCarousel />
            </Box>
        </Container>
    );
}
