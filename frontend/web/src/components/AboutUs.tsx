import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { getInitials } from "../utility/Manipulation";
import { Divider, Link } from "@mui/material";

type Developer = { name: string; role: string; about: (string | { link: string; text: string })[] };

// TODO: add github link (and potentially linkedin) for everyone; maybe also make profile avatar link to it (either github or linkedin).
const developers: Developer[] = [
    {
        name: "Jacob Gadberry",
        role: "Project Manager + Frontend (Mobile)",
        about: [
            //[wrap]
            "Helped manage team meetings and coordinate group work",
            "Led main development of the native Android app",
            "Aided with API documentation",
        ],
    },
    {
        name: "Jason Helman",
        role: "Frontend (Web) + some API",
        about: [
            //[wrap]
            "Led development of the website",
            "Helped refactor and catch bugs in API",
            "Provided resources and libraries for both frontend and backend",
            "Computer Science Major and Math Computational Track Major",
        ],
    },
    {
        name: "Ian Ordonez",
        role: "Frontend (Mobile)",
        about: [
            //[wrap]
            "Helped with Figma designs and wire framing",
            "Helped with mobile UI development",
        ],
    },
    {
        name: "Tran Pham",
        role: "Frontend (Web)",
        about: [
            //[wrap]
            "Helped with the website",
            "Helped prepare presentation materials",
        ],
    },
    {
        name: "Pablo Rodriguez",
        role: "API",
        about: [
            //[wrap]
            "Computer Engineering major",
            "Helped with the ExpressJS backend and production deployment to Heroku",
            "Helped document the API specification",
        ],
    },
    {
        name: "John Tran",
        role: "API",
        about: [
            //[wrap]
            "Undergrad Computer Science Major",
            "Worked on Unit Testing for the API",
            { link: "https://www.linkedin.com/in/jtran6796/", text: "LinkedIn" },
        ],
    },
    {
        name: "Landon Wright",
        role: "Database",
        about: [
            //[wrap]
            "Computer Engineering Major",
            "Created and mantained on Database",
        ],
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
                            <CardContent sx={{ height: 200 }}>
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
                                                {typeof entry === "string" ? (
                                                    <>{entry}</>
                                                ) : (
                                                    <Link
                                                        href={entry.link}
                                                        target="_blank"
                                                    >
                                                        {entry.text}
                                                    </Link>
                                                )}
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
