<<<<<<< HEAD
import React from "react";
import { TextField, Box, Autocomplete, Chip, Button, Typography, FormHelperText } from "@mui/material";
import { useState, useEffect } from "react";
||||||| 7326b05
import React from "react";
import { TextField, Box, Autocomplete, Chip, Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
=======
import React, { useEffect, Dispatch, SetStateAction } from "react";
import {
  TextField,
  Box,
  Autocomplete,
  Chip,
  Button,
  Typography,
  Stack,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
>>>>>>> 57637b8bc423d6a4cf6cee7310d2db6af25de853
import CloseIcon from "@mui/icons-material/Close";
<<<<<<< HEAD
import SearchIcon from '@mui/icons-material/Search';
import tags from "./testTagList";
type SearchType = 'username' | 'tag' | 'title';
type SearchMode = 'username' | 'tag' | 'title' | 'null';
||||||| 7326b05
import SearchIcon from '@mui/icons-material/Search';
import users from "./testUserList";
import tags from "./testTagList";

type SearchType = 'username' | 'tag' | 'title';
type SearchMode = 'username' | 'tag' | 'title' | 'null';
=======
import SearchIcon from "@mui/icons-material/Search";
import { GetAllTags } from "@/services/Tags";
import { Database } from "supabase/db_types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Post } from "@/types/Post";
import { SearchPostByConditions } from "@/services/Search";

type SearchMode = "username" | "tag" | "title";
>>>>>>> 57637b8bc423d6a4cf6cee7310d2db6af25de853

interface SearchResult {
  type: SearchMode;
  value: string;
}

type props = {
  setPosts: Dispatch<SetStateAction<Post[] | null>>;
};

const submit_layout = {
<<<<<<< HEAD
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
||||||| 7326b05
    width: "58px",
    height: "58px",
    background: "#FFA31A",
    border: "3px solid #000000",
    borderRadius: "15px",
}
const icon_style = {
    color: "black",
=======
  minWidth: "58px",
  height: "58px",
  borderRadius: "15px",
>>>>>>> 57637b8bc423d6a4cf6cee7310d2db6af25de853
};
const chip_style = {
    border: "1px solid #000000",
    color: 'primary',
    background: "white",

};

const textfield_overwrite = {
  "&&": {
    padding: "0px",
  },
  "&& fieldset": {
    transition: "border 0.3s",
  },
  "&&.Mui-error fieldset": {
    border: "3px solid red",
  },
  "&&:hover .MuiButton-root": {
    border: "3px solid #ffa31a",
  },
  "&&.Mui-focused .MuiButton-root": {
    border: "3px solid #ffa31a",
  },
  "&&.Mui-error .MuiButton-root": {
    border: "3px solid red",
  },
  "&&.Mui-error .MuiSvgIcon-root": {
    color: "red",
  },
};

const helperText = {
  marginTop: "10px",
  marginLeft: "10px",
};

export function SearchPanel(props: props) {
<<<<<<< HEAD
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
||||||| 7326b05
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
=======
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode>("title");
  const [errMsg, setErrMsg] = useState<string>("");
  const supabaseClient = useSupabaseClient<Database>();
>>>>>>> 57637b8bc423d6a4cf6cee7310d2db6af25de853

<<<<<<< HEAD
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
||||||| 7326b05


    const handleSubmit = () => {
        console.log('submit');
        if (searchMode !== 'null') {
            const value = (searchMode === 'username' || searchMode === 'tag') ? searchText.slice(1) : searchText;
            setSearchResults([...searchResults, { type: searchMode, value }]);
            setSearchMode('null');
            setSearchText('');
        }
    };
=======
  useEffect(() => {
    GetAllTags(supabaseClient)
      .then((t) => {
        setTagNames(t.map((e) => e.name));
        setTagIds(t.map((e) => e.id));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [supabaseClient]);

  const updatePosts = (conditions: SearchResult[]) => {
    const targetTagIndex = conditions
      .filter((e) => e.type == "tag")
      .map((e) => e.value)
      .map((e) => tagNames.findIndex((value) => value == e));
    const targetTagIds = tagIds.filter((_, index) => targetTagIndex.includes(index));
    const targetHostNames = conditions.filter((e) => e.type == "username").map((e) => e.value);
    const targetPostNames = conditions.filter((e) => e.type == "title").map((e) => e.value);
    SearchPostByConditions(targetTagIds, targetHostNames, targetPostNames, supabaseClient)
      .then((matchedPosts) => {
        props.setPosts(matchedPosts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (value: string) => {
    if (value.length == 0) {
      setErrMsg("Give at least one character.");
      return;
    }
    const prefixedRemoved =
      searchMode === "username" || searchMode === "tag" ? value.slice(1) : value;
    if (prefixedRemoved.length == 0) {
      setErrMsg("Give at least one character.");
      return;
    }
    const selectedInSameType = searchResults
      .filter((e) => e.type == searchMode)
      .map((e) => e.value);
    if (selectedInSameType.includes(prefixedRemoved)) {
      setErrMsg(`You already insert this ${searchMode == "username" ? "host" : "title"} keyword.`);
      return;
    }
    const conditions = [...searchResults, { type: searchMode, value: prefixedRemoved }];
    setSearchResults(conditions);
    setSearchMode("title");
    setSearchText("");
    updatePosts(conditions);
  };
>>>>>>> 57637b8bc423d6a4cf6cee7310d2db6af25de853

<<<<<<< HEAD
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
||||||| 7326b05

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
                <p>Option: {getOptions()}</p>

            </div>

        </>
=======
  const handleDeleteTag = (index: number) => {
    const conditions = searchResults.filter((_, i) => i !== index);
    setSearchResults(conditions);
    updatePosts(conditions);
  };

  const getOptions = () => {
    if (searchText.length == 0 || searchMode != "tag") return [];
    const options = tagNames.filter((tag) =>
      tag.toLowerCase().includes(searchText.slice(1).toLowerCase())
>>>>>>> 57637b8bc423d6a4cf6cee7310d2db6af25de853
    );
    const selectedValues = searchResults
      .filter((result) => result.type === searchMode)
      .map((result) => result.value);
    return options.filter((option) => !selectedValues.includes(option)).map((e) => "#" + e);
  };

  const handleInputValueChange = (value: string) => {
    setErrMsg("");
    setSearchText(value);
    if (value.startsWith("@")) {
      setSearchMode("username");
    } else if (value.startsWith("#")) {
      setSearchMode("tag");
    } else {
      setSearchMode("title");
    }
  };

  return (
    <Stack alignItems="center" direction="column">
      <Autocomplete
        sx={{ width: "500px" }}
        disableClearable
        freeSolo
        inputValue={searchText}
        value={searchText}
        onInputChange={(_, value) => {
          handleInputValueChange(value);
        }}
        onChange={(_, value) => {
          if (!value) return;
          handleSubmit(value);
        }}
        options={getOptions()}
        renderInput={(params) => (
          <Stack>
            <TextField
              {...params}
              name="search"
              placeholder="Search: @username, #tag, title"
              variant="outlined"
              error={errMsg != ""}
              inputProps={{
                ...params.inputProps,
                sx: {
                  color: errMsg == "" ? "black" : "red",
                  textAlign: "center",
                  "&::placeholder": {
                    textAlign: "center",
                  },
                },
              }}
              InputProps={{
                ref: params.InputProps.ref,
                sx: textfield_overwrite,
                endAdornment: (
                  <Button
                    sx={{
                      border: "3px solid black",
                    }}
                    disabled={searchMode == "tag"}
                    variant="contained"
                    type="submit"
                    style={submit_layout}
                    onClick={() => handleSubmit(searchText)}
                  >
                    <SearchIcon />
                  </Button>
                ),
              }}
            />
            <Box sx={helperText}>
              <FormHelperText error>{errMsg != "" && errMsg}</FormHelperText>
            </Box>
          </Stack>
        )}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 1,
          marginTop: "20px",
          width: "700px",
        }}
      >
        {searchResults.map((result, index) => (
          <Chip
            key={index}
            sx={{
              border: "2.5px solid black",
              backgroundColor: "white",
            }}
            label={
              <Stack direction="row" spacing="10px">
                <Typography variant="body2">
                  {result.type === "username" ? "HOST:" : result.type === "tag" ? "TAG:" : "TITLE:"}
                </Typography>
                <Typography variant="body2" color="primary">
                  {result.value}
                </Typography>
              </Stack>
            }
            deleteIcon={<CloseIcon />}
            onDelete={() => handleDeleteTag(index)}
          />
        ))}
      </Box>
    </Stack>
  );
}
