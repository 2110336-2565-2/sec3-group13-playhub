import React from "react";
import { TextField, Box, Autocomplete, Chip, Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import users from "./testUserList";
import tags from "./testTagList";

type SearchType = 'username' | 'tag' | 'title';
type SearchMode = 'username' | 'tag' | 'title' | 'null';

interface SearchResult {
    type: SearchType;
    value: string;
}


type props = {

};

const submit_layout = {
    width: "58px",
    height: "58px",
    background: "#FFA31A",
    border: "3px solid #000000",
    borderRadius: "15px",
}
const icon_style = {
    color: "black",
};


export function SearchPanel(props: props) {
    const [searchType, setSearchType] = useState<SearchType>('title');
    const [searchText, setSearchText] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchMode, setSearchMode] = useState<SearchMode>('null');
    const [options, setOptions] = useState<string[]>([]);
    const handleClearText = () => {
        setSearchText("");
    };
    useEffect(() => {
        if (searchText != '') {
            if (searchText.startsWith('@')) {
                setSearchMode('username');
            } else if (searchText.startsWith('#')) {
                setSearchMode('tag');
            } else {
                setSearchMode('title');
            }
        }
        else { setSearchMode('null'); }
    }, [searchText]);
    useEffect(() => {
        if (searchMode == 'null') {
            handleClearText()
        }
    }, [searchMode]);



    const handleSubmit = () => {
        console.log('submit');
        if (searchMode !== 'null') {
            const value = (searchMode === 'username' || searchMode === 'tag') ? searchText.slice(1) : searchText;
            setSearchResults([...searchResults, { type: searchMode, value }]);
            setSearchMode('null');
            setSearchText('');
        }
    };


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
            setSearchText("");
        }
    };
    const handleDeleteTag = (index: number) => {
        const deletedValue = searchResults[index].value;
        setSearchResults((prevResults) =>
            prevResults.filter((_, i) => i !== index)
        );
        if (searchResults[index].type === "username") {
            setOptions((prevOptions) => [...prevOptions, deletedValue]);
        } else if (searchResults[index].type === "tag") {
            setOptions((prevOptions) => [...prevOptions, "#" + deletedValue]);
        }
    };

    const getOptions = () => {
        let options: string[] = [];
        if (searchMode === "username") {
            options = users.filter((user) => user.toLowerCase().includes(searchText.slice(1).toLowerCase()));
        } else if (searchMode === "tag") {

            options = tags.filter((tag) => tag.toLowerCase().includes(searchText.slice(1).toLowerCase()));
        }// i think i will try to comment 2 if above cos autocomplete can do it (no need to filter for it.)

        if (searchResults.length > 0) {
            const selectedValues = searchResults.filter((result) => result.type === searchType).map((result) => result.value);
            options = options.filter((option) => !selectedValues.includes(option));
        }
        console.log('OP= ', options)
        return options;
    };






    return (
        <>
            <div>

                <Autocomplete
                    sx={{ width: "500px" }}
                    freeSolo
                    inputValue={searchText}
                    onInputChange={(event, value) => setSearchText(value)}
                    options={getOptions()}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="search"
                            placeholder="Search: @username, #tag, title"
                            variant="outlined"

                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSubmit();
                                    setSearchText("");
                                }
                            }}
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                        /* InputProps={{
                             endAdornment: (
                                 <Button type="submit" style={submit_layout}>
                                     <SearchIcon style={icon_style} />
                                 </Button>
                             ),
                         }}*/
                        />
                    )}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, marginTop: "20px" }}>
                    {searchResults.map((result, index) => (
                        <Chip key={index} label={`${result.type === 'username' ? '@: ' : result.type === 'tag' ? '#: ' : ''}${result.value}`} deleteIcon={<CloseIcon />}
                            onDelete={() => handleDeleteTag(index)}
                        />
                    ))}
                </Box>
            </div>
            <div>
                <p>Search Type: {searchMode}</p>
                <p>Search results: {JSON.stringify(searchResults)}</p>
                <p>Search Text: {searchText}</p>

            </div>

        </>
    );
}