import React, { useEffect, Dispatch, SetStateAction } from "react";
import { TextField, Box, Autocomplete, Chip, Button, Typography, Stack } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { GetAllTags } from "@/services/Tags";
import { Database } from "supabase/db_types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Post } from "@/types/Post";
import { SearchPostByConditions } from "@/services/Search";

type SearchMode = "username" | "tag" | "title";

interface SearchResult {
  type: SearchMode;
  value: string;
}

type props = {
  setPosts: Dispatch<SetStateAction<Post[] | null>>;
};

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
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode>("title");
  const supabaseClient = useSupabaseClient<Database>();

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
    if (value.length == 0) return;
    const prefixedRemoved =
      searchMode === "username" || searchMode === "tag" ? value.slice(1) : value;
    const conditions = [...searchResults, { type: searchMode, value: prefixedRemoved }];
    setSearchResults(conditions);
    setSearchText("");
    updatePosts(conditions);
  };

  const handleDeleteTag = (index: number) => {
    const conditions = searchResults.filter((_, i) => i !== index);
    setSearchResults(conditions);
    updatePosts(conditions);
  };

  const getOptions = () => {
    if (searchText.length == 0 || searchMode != "tag") return [];
    const options = tagNames.filter((tag) =>
      tag.toLowerCase().includes(searchText.slice(1).toLowerCase())
    );
    const selectedValues = searchResults
      .filter((result) => result.type === searchMode)
      .map((result) => result.value);
    return options.filter((option) => !selectedValues.includes(option)).map((e) => "#" + e);
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
            <TextField
              {...params}
              name="search"
              placeholder="Search: @username, #tag, title"
              variant="outlined"
              InputProps={{
                ref: params.InputProps.ref,
                endAdornment: (
                  <Button
                    variant="contained"
                    type="submit"
                    style={submit_layout}
                    onClick={() => handleSubmit(searchText)}
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
              label={
                <Stack direction="row" spacing="10px">
                  <Typography variant="body2">
                    {result.type === "username"
                      ? "HOST:"
                      : result.type === "tag"
                      ? "TAG:"
                      : "TITLE:"}
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
      </div>
    </>
  );
}
