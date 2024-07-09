import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Welcome() {
    return (
        <Box
            id="hero"
            sx={{
                width: "100%",
                // backgroundImage: theme.palette.mode === "light" ? "linear-gradient(180deg, #CEE5FD, #FFF)" : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
                backgroundSize: "100% 20%",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: { xs: 14, sm: 20 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                <Stack
                    spacing={2}
                    useFlexGap
                    sx={{ width: { xs: "100%", sm: "70%" } }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignSelf: "center",
                            textAlign: "center",
                            fontSize: "clamp(3.5rem, 10vw, 4rem)",
                        }}
                    >
                        Welcome to&nbsp;
                        <Typography
                            component="span"
                            variant="h1"
                            sx={{
                                fontSize: "clamp(3rem, 10vw, 4rem)",
                                color: "primary.main",
                            }}
                        >
                            Accountability
                        </Typography>
                    </Typography>
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
                    >
                        Track shared expenses with your friends.
                    </Typography>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignSelf="center"
                        spacing={1}
                        useFlexGap
                        sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
                    ></Stack>
                </Stack>
                <Box
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
                />
            </Container>
        </Box>
    );
}
