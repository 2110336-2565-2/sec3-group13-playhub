import React from "react";
import { Box, Typography, TextField, Stack, Button, Select, MenuItem } from "@mui/material";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import Logo from "@/components/public/Logo";
import { Gender } from "enum/gender";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputTextBox from "@/components/public/UserTextField";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  // const [isSubmit, setIsSubmit] = React.useState(false);
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [displayName, setDisplayName] = React.useState<string>("");
  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setDisplayName(event.target.value);
  };

  function handleEmailChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setEmail(event.target.value);
  }

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setConfirmPassword(event.target.value);
  }

  return (
    <Stack spacing={3} alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
      <Logo width={119} height={119} />

      <Box style={{ width: "50vw" }}>
        <InputTextBox
          header="Username"
          placeholder="Displayname"
          value={displayName}
          handleValueChange={handleDisplayNameChange}
          char_limit={100}
          isErr={false}
          errMsg=""
        />
      </Box>

      <Box style={{ width: "50vw" }}>
        <InputTextBox
          header="Email"
          placeholder="Email"
          value={email}
          handleValueChange={handleEmailChange}
          isErr={false}
          errMsg=""
        />
      </Box>

      <Box style={{ width: "50vw" }}>
        <PasswordTextFeild
          header="Password"
          placeholder="Password"
          value={password}
          handleValueChange={handlePasswordChange}
          isErr={false}
          errMsg=""
        />
      </Box>

      <Box style={{ width: "50vw" }}>
        <PasswordTextFeild
          header="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          handleValueChange={handleConfirmPasswordChange}
          isErr={false}
          errMsg=""
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
