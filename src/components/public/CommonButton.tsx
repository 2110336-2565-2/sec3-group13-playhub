import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// type
type props = {
  label: string;
  onClick?: () => void;
};

// style
const button_label = {
  fontSize: "body1.fontSize",
  fontWeight: "bold",
  textAlign: "center",
};

const button_layout = {
  borderRadius: "10px",
  width: "11.2vw",
  minWidth: "150px",
  height: "5vh",
  minHeight: "40px",
};

export default function CommonButton(props: props) {
  return (
    <>
      <Button onClick={props.onClick} sx={button_layout} variant="contained">
        <Typography component="div">
          <Box sx={button_label}>{props.label}</Box>
        </Typography>
      </Button>
    </>
  );
}
