import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { blue } from "@mui/material/colors";

type Developer = { name: string; role: string };

const developers: Developer[] = [
    {
        name: "Jacob Gadberyy",
        role: "Project Manager + Frontend (Mobile)",
    },
    {
        name: "Jason Helman",
        role: "Frontend (Web) + some API",
    },
    {
        name: "Ian Orodonez",
        role: "Frontend (Mobile)",
    },
    {
        name: "Tran Pham",
        role: "Frontend (Web)",
    },
    {
        name: "Pablo Rodriguez",
        role: "API",
    },
    {
        name: "John Tran",
        role: "API",
    },
    {
        name: "Landon Wright",
        role: "Database",
    },
];

export default function AboutUs() {
    return (
        <Container
            id="developers"
            sx={{
                pt: { xs: 4, sm: 12 },
                pb: { xs: 8, sm: 16 },
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: { xs: 3, sm: 6 },
            }}
        >
            <Box
                sx={{
                    width: { sm: "100%", md: "60%" },
                    textAlign: { sm: "left", md: "center" },
                }}
            >
                <Typography
                    component="h2"
                    variant="h4"
                    color="text.primary"
                >
                    About Us
                </Typography>
                {/* <Typography variant="body1" color="text.secondary">
            See what our customers love about our products. Discover how we excel in
            efficiency, durability, and satisfaction. Join us for quality, innovation,
            and reliable support.
        </Typography> */}
            </Box>
            <Grid
                container
                spacing={2}
            >
                {developers.map((testimonial, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        sx={{ display: "flex" }}
                    >
                        <Card
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                flexGrow: 1,
                                p: 1,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {testimonial.role + " Add Extra info if needed, else, delete div"}
                                </Typography>
                            </CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    pr: 2,
                                }}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar sx={{ bgcolor: blue }}>
                                            {testimonial.name.split(" ").reduce(
                                                // [wrap]
                                                (res, word) => res + word.substring(0, 1),
                                                ""
                                            )}
                                        </Avatar>
                                    }
                                    title={testimonial.name}
                                    subheader={testimonial.role}
                                />
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
