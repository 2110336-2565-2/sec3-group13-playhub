import {
    Box,
    IconButton,
    Stack,
    TextField,
    Autocomplete
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState } from 'react';
import { Tag } from "@/types/Tag";

type props = {
    possibleTags: Tag[]
};

export const SearchPanel = (props: props) => {
    const [searchString, setSearchString] = useState<string>("");

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(e.currentTarget.value)
    }

    return (
        <>
            <Box></Box>
        </>
    )
}