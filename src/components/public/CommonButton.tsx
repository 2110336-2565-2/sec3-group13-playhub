import { Button } from "@mui/material";
import { COLOR } from "enum/COLOR";
import React from "react";

type props = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  color?: string;
  disabled?: boolean;
};

export default function NormalButton(props: props) {
  function generateColor() {
    if (props.color === COLOR.NATURAL) {
      return "inherit";
    } else if (props.color === COLOR.ERROR) {
      return "error";
    }
    return "primary";
  }

  return (
    <>
      <Button
        variant="contained"
        style={{
          borderRadius: "15px",
          border: "3px black solid",
          textTransform: "none",
          fontSize: 18,
          fontWeight: 600,
          padding: "4px 10px",
          minWidth: "180px",
        }}
        color={generateColor()}
        onClick={props.onClick}
        disabled={props.disabled || false}
      >
        {props.label}
      </Button>
    </>
  );
}
