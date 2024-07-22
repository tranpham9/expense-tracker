import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useRef } from "react";
import { CircularProgress, Tooltip } from "@mui/material";

/* TODO: should this clear on submit or not? */
export default function SearchBar({
    placeholder,
    isBuffering = false,
    onChange = (event) => {
        event; // no-op for ESLint
    },
    onSearch = (query: string) => {
        query; // no-op for ESLint
    },
}: {
    placeholder: string;
    isBuffering?: boolean;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    onSearch?: (query: string) => void;
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
                placeholder={placeholder}
                inputProps={{ "aria-label": placeholder.toLowerCase() }}
                inputRef={inputRef}
                onChange={onChange}
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

            <Tooltip
                title="Search Trips"
                arrow
            >
                <IconButton
                    type="button"
                    disabled={isBuffering}
                    sx={{ p: "10px" }}
                    onClick={triggerSearch}
                >
                    <SearchIcon />
                </IconButton>
            </Tooltip>
        </Paper>
    );
}
