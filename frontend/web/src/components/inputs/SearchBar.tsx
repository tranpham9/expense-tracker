import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useRef } from "react";

export default function SearchBar({
    onSearch = (query: string) => {
        query; // no-op for ESLint
    },
}) {
    const inputRef = useRef<HTMLInputElement>();
    return (
        // https://mui.com/material-ui/react-paper/#elevation
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
            />
            <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={() => onSearch(inputRef.current?.value || "")}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
