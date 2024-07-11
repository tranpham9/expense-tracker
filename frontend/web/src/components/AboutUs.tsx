import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { getInitials } from "../utility/Manipulation";
import { Divider } from "@mui/material";

type Developer = { name: string; role: string; about: string[] };

const developers: Developer[] = [
    {
        name: "Jacob Gadberyy",
        role: "Project Manager + Frontend (Mobile)",
        about: ["sample item 1", "sample item 2"],
    },
    {
        name: "Jason Helman",
        role: "Frontend (Web) + some API",
        about: ["sample item 1", "sample item 2"],
    },
    {
        name: "Ian Orodonez",
        role: "Frontend (Mobile)",
        about: ["sample item 1", "sample item 2"],
    },
    {
        name: "Tran Pham",
        role: "Frontend (Web)",
        about: ["sample item 1", "sample item 2"],
    },
    {
        name: "Pablo Rodriguez",
        role: "API",
        about: ["sample item 1", "sample item 2"],
    },
    {
        name: "John Tran",
        role: "API",
        about: ["sample item 1", "sample item 2"],
    },
    {
        name: "Landon Wright",
        role: "Database",
        about: ["sample item 1", "sample item 2"],
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
            </Box>
            <Grid
                container
                spacing={2}
            >
                {developers.map((developer, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        sx={{ display: "flex" }}
                    >
                        <Card
                            elevation={5}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                flexGrow: 1,
                                p: 1,
                            }}
                        >
                            <Box>
                                <CardHeader
                                    avatar={<Avatar>{getInitials(developer.name)}</Avatar>}
                                    title={developer.name}
                                    subheader={developer.role}
                                />
                            </Box>
                            <Divider />
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    component="div"
                                    color="text.secondary"
                                >
                                    <ul>
                                        {developer.about.map((entry, i) => (
                                            <li
                                                key={i}
                                                style={{ margin: 5 }}
                                            >
                                                {entry}
                                            </li>
                                        ))}
                                    </ul>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
