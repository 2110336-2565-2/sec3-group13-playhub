import React from "react";
import { TextField, Box, Autocomplete, Chip, Button } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import tags from "./testTagList";

type SearchMode = "username" | "tag" | "title";

interface SearchResult {
  type: SearchMode;
  value: string;
}

type props = {};

const submit_layout = {
  width: "58px",
  height: "58px",
  background: "#FFA31A",
  border: "3px solid #000000",
  borderRadius: "15px",
};
const icon_style = {
  color: "black",
};

export function SearchPanel(props: props) {
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode>("title");

  const handleSubmit = () => {
    console.log("submit");
    if (searchText.length == 0) return;
    const value =
      searchMode === "username" || searchMode === "tag" ? searchText.slice(1) : searchText;
    setSearchResults([...searchResults, { type: searchMode, value }]);
    setSearchText("");
  };

  const handleDeleteTag = (index: number) => {
    setSearchResults((prevResults) => prevResults.filter((_, i) => i !== index));
  };

  const getOptions = () => {
    if (searchText.length == 0 || searchMode != "tag") return [];
    const options = tags.filter((tag) =>
      tag.toLowerCase().includes(searchText.slice(1).toLowerCase())
    );
    const selectedValues = searchResults
      .filter((result) => result.type === searchMode)
      .map((result) => result.value);
    return options.filter((option) => !selectedValues.includes(option));
  };

  const handleInputValueChange = (value: string) => {
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
    <>
      <div>
        <Autocomplete
          sx={{ width: "500px" }}
          freeSolo
          inputValue={searchText}
          onInputChange={(_, value) => handleInputValueChange(value)}
          onChange={(_, value) => {
            value && setSearchText(value);
          }}
          options={getOptions()}
          renderInput={(params) => (
            <TextField
              {...params}
              name="search"
              placeholder="Search: @username, #tag, title"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Button
                    variant="contained"
                    type="submit"
                    style={submit_layout}
                    onClick={handleSubmit}
                  >
                    <SearchIcon style={icon_style} />
                  </Button>
                ),
              }}
            />
          )}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 1,
            marginTop: "20px",
          }}
        >
          {searchResults.map((result, index) => (
            <Chip
              key={index}
              label={`${result.type === "username" ? "@" : result.type === "tag" ? "#" : ""}${
                result.value
              }`}
              deleteIcon={<CloseIcon />}
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
