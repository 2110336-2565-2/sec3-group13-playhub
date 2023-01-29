import Button from "@mui/material/Button";
import { MouseEventHandler } from "react";

type props = {
  onClick : () => void;
}

export default function ActionButton(props : props) {
  return (
    <>
      <Button onClick={props.onClick} sx={{ width: "10vw", minWidth: "200px" }} variant="contained">
        Login
      </Button>
    </>
  );
}
