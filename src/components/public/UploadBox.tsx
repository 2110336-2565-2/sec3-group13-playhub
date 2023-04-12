import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

type props = {
  onClick?: () => void;
};

const box_layout = {
  border: "dotted 5px gray",
  width: 300,
  height: 350,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const sign_layout = {
  fontSize: "100px",
  color: "black",
};
export default function UploadBox(props: props) {
  return (
    <>
      <Button onClick={props.onClick} sx={{ padding: "0px 0px" }}>
        <Box sx={box_layout}>
          <AddIcon sx={sign_layout} />
        </Box>
      </Button>
    </>
  );
}
