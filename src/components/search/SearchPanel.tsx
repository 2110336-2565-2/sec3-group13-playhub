import React from "react";
import { TextField, Box, Autocomplete, Chip, Button, Typography, FormHelperText } from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
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
    position: "absolute",
    width: "58px",
    height: "58px",
    background: "#FFA31A",
    border: "3px solid #000000",
    borderRadius: "15px",
    right: '1px'
}
const icon_style = {
    color: "black",
};
const chip_style = {
    border: "1px solid #000000",
    color: 'primary',
    background: "white",

};


export function SearchPanel(props: props) {
    const [searchType, setSearchType] = useState<SearchType>('title');
    const [inputValue, setInputValue] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchMode, setSearchMode] = useState<SearchMode>('null');
    const [options, setOptions] = useState<string[]>([]);
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
    const handleClearText = () => {
        setInputValue("");
    };
    useEffect(() => {
        if (inputValue != '') {
            if (inputValue.startsWith('@')) {
                setSearchMode('username');
            } else if (inputValue.startsWith('#')) {
                setSearchMode('tag');
            } else {
                setSearchMode('title');
            }


        }
        else { setSearchMode('null'); }
        let checkvalue = (searchMode == 'tag') ? inputValue.slice(1).toLowerCase() : inputValue.toLowerCase();
        const duplicate = searchResults.some(result => (result.type === searchMode && result.value === checkvalue));
        setIsDuplicate(duplicate);
    }, [inputValue, searchMode, searchResults]);
    useEffect(() => {
        if (searchMode == 'null') {
            handleClearText()
        }
    }, [searchMode]);

    const handleSubmit = () => {
        console.log('submit');
        if (searchMode !== 'null') {
            const value = (searchMode === 'tag') ? inputValue.slice(1) : inputValue;
            console.log(isDuplicate)
            if (isDuplicate == false) {
                setSearchResults([...searchResults, { type: searchMode, value }]);
                setSearchMode('null');
                handleClearText();
            }
        }
    };

    const handleDeleteTag = (index: number) => {
        const deletedValue = searchResults[index].value;
        setSearchResults((prevResults) =>
            prevResults.filter((_, i) => i !== index)
        );
        if (searchResults[index].type === "tag") {
            setOptions((prevOptions) => [...prevOptions, "#" + deletedValue]);
        }


    };

    const getOptions = () => {
        let options: string[] = [];
        if (searchMode === "tag") {
            options = tags.filter((tag) => tag.toLowerCase().includes(inputValue.slice(1).toLowerCase()));
        }

        if (searchResults.length > 0) {
            const selectedValues = searchResults.filter((result) => result.type === searchType).map((result) => result.value);
            options = options.filter((option) => !selectedValues.includes(option));
        }
        return options;
    };






    return (
        <>
            <div>

                <Autocomplete
                    sx={{ width: "500px" }}
                    freeSolo
                    id="combo-box-demo"
                    inputValue={inputValue}
                    onInputChange={(event, value) => setInputValue(value)}
                    options={(searchMode == 'tag') ? getOptions() : []}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="search"
                            placeholder="Search: @username, #tag, title"
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                            //inputProps={{ maxLength: 20, style: { textAlign: 'center' }, }}
                            InputProps={{
                                ...params.InputProps,
                                //type: 'search',
                                style: { textAlign: 'center' },
                                endAdornment: (
                                    <Button type="submit" sx={submit_layout} onClick={handleSubmit}>
                                        <SearchIcon style={icon_style} />
                                    </Button>
                                ),
                            }}
                        />
                    )}
                />
                <Box marginTop='10px'>
                    {isDuplicate && <FormHelperText error>{"You already inserted this " + (searchMode == 'username' ? "host" : searchMode == 'tag' ? 'tag' : 'title') + " keyword."}</FormHelperText>}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, marginTop: "20px" }}>
                    {searchResults.map((result, index) => (
                        <Chip key={index}
                            label={
                                <div>
                                    <Typography sx={{ color: 'black', display: 'inline' }}>
                                        {`${result.type === 'username' ? 'HOST: ' : result.type === 'tag' ? 'TAG: ' : 'TITLE: '}`}
                                    </Typography>
                                    <Typography color="primary" sx={{ display: 'inline' }}>
                                        {`${result.value}`}
                                    </Typography>
                                </div>

                            }
                            variant="outlined"
                            deleteIcon={<CloseIcon />}
                            onDelete={() => handleDeleteTag(index)}
                            style={chip_style}
                        />

                    ))
                    }
                </Box >
            </div >
            <div>
                <p>Search Type: {searchMode}</p>
                <p>Search results: {JSON.stringify(searchResults)}</p>
                <p>Search Text: {inputValue}</p>
                <p>Option: {getOptions()}</p>

            </div>

        </>
    );
}