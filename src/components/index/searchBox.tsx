import React from "react";
import {
    TextField, Box, Button, IconButton, Autocomplete, InputAdornment,
    Popover,
    Typography,
    Menu,
    MenuItem,
    Popper,
    Paper,
    List,
    ListItem,
    Chip
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import NormalTextField from "../post/TitleTextField";
import NormalButton from "../public/CommonButton";

type SearchType = 'username' | 'tag' | 'title';

interface SearchResult {
    type: SearchType;
    value: string;
}


type props = {

};

/* 
const box_layout = {
    width: "450px",
    height: "60px",
    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
    //border: "6px solid black",
    borderRadius: "15px",
    paddingLeft: "10px",
    paddingRight: "0px",
    '::placeholder': {
        textAlign: 'center',
    },

}
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
*/

export default function SearchPanel(props: props) {
    const users = ["ลุงตู่", "ลุงป้อม", "อุ๊งอิ๊ง", "ทิม"];
    const tags = ['เพื่อไทย', 'ก้าวไกล', 'พลังประชารัฐ', 'รทสช', 'กล้า'];
    const [searchType, setSearchType] = useState<SearchType>('title');
    const [searchText, setSearchText] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const prevSearchText = useRef("");
    console.log(searchResults)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value != '') {
            if (value.startsWith('@')) {
                setSearchType('username');
                setSearchText(value.slice(1));
            } else if (value.startsWith('#')) {
                setSearchType('tag');
                setSearchText(value.slice(1));
            } else {
                setSearchType('title');
                setSearchText(value);
            }
        }
    };

    const handleSubmit = () => {
        console.log("submit")
        setSearchResults([
            ...searchResults,
            { type: searchType, value: searchText },
        ]);
        setSearchText("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
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
        if (searchType === "username") {
            options = users.filter((user) => user.startsWith(searchText));
        } else if (searchType === "tag") {
            options = tags.filter((tag) => tag.startsWith(searchText));
        }
        if (searchResults.length > 0) {
            const selectedValues = searchResults.filter((result) => result.type === searchType).map((result) => result.value);
            options = options.filter((option) => !selectedValues.includes(option));
        }
        return options;
    };
    /*problem
    1.อยากให้คลิกที่ dropdown แล้วเลือกได้เลย(tag and username searching)
    2.สำหรับ title search
    กด enter 1 ครั้ง text ยังไม่หาย (แต่ข้อมูลมีแล้วนะ)
    */





    return (
        <div>
            {/*
            I will use this layout later
                    <form onSubmit={handleSubmit}>
                    <TextField
                        name="search"
                        placeholder="Search: @username, #tag, title"
                        variant="outlined"
                        InputProps={{
                            style: box_layout,
                            endAdornment: (
                                <Button type="submit" style={submit_layout}>
                                    <SearchIcon style={icon_style} />
                                </Button>
                            ),
                        }}
                    />
                </form>
                */}
            <Autocomplete
                sx={{ width: "500px" }}
                freeSolo
                inputValue={searchText}
                onInputChange={(event, value) => setSearchText(value)}
                options={getOptions()}
                renderInput={(params) => (
                    <TextField
                        name="search"
                        {...params}
                        placeholder="Search: @username, #tag, title"
                        variant="outlined"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                )}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, marginTop: "20px" }}>
                {searchResults.map((result, index) => (
                    <Chip key={index} label={`${result.type === 'username' ? '@' : result.type === 'tag' ? '#' : ''}${result.value}`} deleteIcon={<CloseIcon />}
                        onDelete={() => handleDeleteTag(index)}
                    />
                ))}
            </Box>
        </div>
    );
}