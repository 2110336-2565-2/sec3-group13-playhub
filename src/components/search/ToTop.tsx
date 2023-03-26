import React from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Button } from "@mui/material";

const box_layout = {
    position: "fixed",
    width: "60px",
    height: "60px",
    borderRadius: "15px",
    border: "3px solid black",
    left: "2200px",
    bottom: "100px",
    backgroundColor: "primary.main",
    '&:hover': {
        backgroundColor: 'primary.main',
    }
}


export default function ToTop() {
    const handleClick = () => {
        window.scrollTo(0, 0);
    };

    return (
        <>

            <Button type="submit" sx={box_layout} onClick={handleClick}>
                <ArrowUpwardIcon sx={{ width: "80%", height: "80%", color: "black" }} />
            </Button>

        </>
    );
}