import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
    return (
        <Paper
            component="form"
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 800,
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Trips"
                inputProps={{ "aria-label": "search google maps" }}
            />
            <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
