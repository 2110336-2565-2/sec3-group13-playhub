import Button from "@mui/material/Button";

export default function ActionButton({onClick} : any) {
  return (
    <>
      <Button onClick={onClick} sx={{ width: "10vw", minWidth: "200px" }} variant="contained">
        Login
      </Button>
    </>
  );
}
