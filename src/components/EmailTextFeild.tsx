import TextField from "@mui/material/TextField";

export default function EmailTextFeild({ handleChange, value, error }: any) {
  return (
    <>
      <TextField
        error={error}
        value={value}
        onChange={(e) => handleChange(e)}
        sx={{ width: "20vw", minWidth: "260px" }}
        label="Email"
        variant="outlined"
      />
    </>
  );
}
