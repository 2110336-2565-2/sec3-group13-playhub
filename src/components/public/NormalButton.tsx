import { Button } from "@mui/material";

type props = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  color?: string;
};

export default function NormalButton(props: props) {
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
        onClick={props.onClick}
      >
        {props.label}
      </Button>
    </>
  );
}
