import React from "react";
import { Box, Typography, TextField, Stack, Button, Select, MenuItem } from "@mui/material";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import Logo from "@/components/public/Logo";
import { Gender } from "enum/gender";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [value, setValue] = React.useState<Dayjs | null>(null);

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setPassword(event.target.value);
    setIsSubmit(false);
  }

  return (
    <Stack spacing={3} alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
      <Logo width={119} height={119} />

      <Typography>Username</Typography>
      <Box>
        <TextField fullWidth label="Username" />
      </Box>

      <Typography>Email</Typography>
      <Box>
        <TextField fullWidth label="Email" />
      </Box>

      <Typography>Password</Typography>
      <Box>
        <PasswordTextFeild handleChange={handlePasswordChange} value={password} error={isSubmit} />
      </Box>

      <Typography>Confirm Password</Typography>
      <Box>
        <PasswordTextFeild
          label="Confirm Password"
          handleChange={handlePasswordChange}
          value={password}
          error={isSubmit}
        />
      </Box>

      <Typography>Gender</Typography>
      <Select sx={{ width: "100px" }}>
        {(Object.keys(Gender) as (keyof typeof Gender)[]).map((key) => (
          <MenuItem>{Gender[key]}</MenuItem>
        ))}
      </Select>

      <Typography>Birth Date</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Birth Date"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <Button variant="contained">Create Account</Button>
    </Stack>
  );
}
