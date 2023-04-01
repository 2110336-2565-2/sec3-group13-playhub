import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Button } from "@mui/material";
import ScrollToTop from "react-scroll-up";

const layout = {
  minWidth: "0px",
  width: "50px",
  height: "50px",
  borderRadius: "15px",
  border: "3px solid black",
  backgroundColor: "primary.main",
  "&:hover": {
    backgroundColor: "primary.main",
  },
};

export default function ToTop() {
  return (
    <ScrollToTop
      showUnder={0}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        cursor: "pointer",
        transitionDuration: "0.2s",
        transitionTimingFunction: "linear",
        transitionDelay: "0s",
      }}
    >
      <Button sx={layout}>
        <ArrowUpwardIcon sx={{ color: "black" }} />
      </Button>
    </ScrollToTop>
  );
}
