import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useRef } from "react";
import { CircularProgress } from "@mui/material";

/* TODO: should this clear on submit or not? */
export default function SearchBar({
    isBuffering = false,
    onSearch = (query: string) => {
        query; // no-op for ESLint
    },
}) {
    const inputRef = useRef<HTMLInputElement>();

    const triggerSearch = () => {
        if (!isBuffering) {
            onSearch(inputRef.current?.value || "");
        }
    };

    return (
        // https://mui.com/material-ui/react-paper/#elevation
        // <Typography>Search</Typography>
        <Paper
            component="form"
            elevation={10}
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
                inputProps={{ "aria-label": "search trips" }}
                inputRef={inputRef}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        triggerSearch();
                    }
                }}
            />

            {/* Reponse is too fast, so this looks bad */}
            {/* <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={triggerSearch}
            >
                {isBuffering ? <CircularProgress size={24} /> : <SearchIcon />}
            </IconButton> */}

            {isBuffering && <CircularProgress size={20} />}

            <IconButton
                type="button"
                disabled={isBuffering}
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={triggerSearch}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
