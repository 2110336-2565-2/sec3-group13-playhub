import React from "react";

export const error = () => {
  return "#ff0000";
};

export const createPostLayout = () => {
  return {
    width: "35vw",
    margin: "2vh 0 0 0",
  };
};

export const helperTextBox = () => {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
  };
};

export const helperTextError = () => {
  return {
    textAlign: "start",
    gridColumn: 1,
    color: error,
    display: "none",
  };
};

export const helperText = () => {
  return {
    textAlign: "end",
    gridColumn: 2,
  };
};

export const fontDesign = () => {
  return {
    fontstyle: "normal",
    fontweight: "700",
    fontsize: "20px",
    lineheight: "24px",
    letterspacing: "0.15px",
    color: "#000000",
  };
};
