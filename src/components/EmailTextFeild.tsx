import TextField from "@mui/material/TextField";

export default function EmailTextFeild() {
  return (
    <>
      <TextField
        sx={{ width: "20vw", minWidth: "260px" }}
        label="Email"
        variant="outlined"
      />
    </>
  );
}
