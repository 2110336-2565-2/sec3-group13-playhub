import { Avatar, Chip, Typography, Stack } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";
import { User } from "@/types/User";
import { GENDER } from "enum/GENDER";

type props = {
  value: User | null;
};

const profile_layout = {
  minWidth: "200px",
};
const stack_design = {
  padding: "30px",
  width: "300px",
};

const avatar = { width: 120, height: 120 };

export default function MemberDetail(props: props) {
  return (
    <>
      {props.value && (
        <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ ...stack_design }}>
          <Typography variant="h1" align="center" sx={profile_layout}>
            {props.value.username}
          </Typography>
          <Typography variant="body1" align="center" sx={profile_layout}>
            {props.value.email}
          </Typography>
          {props.value.image ? (
            <Avatar sx={avatar} alt="Profile picture" src={props.value.image} />
          ) : (
            <Avatar sx={avatar} alt="Profile picture" />
          )}
          <Stack direction="row" spacing={1}>
            <Chip
              icon={
                props.value.sex === GENDER.MALE ? (
                  <MaleIcon />
                ) : props.value.sex === GENDER.FEMALE ? (
                  <FemaleIcon />
                ) : props.value.sex === GENDER.OTHERS ? (
                  <TransgenderIcon />
                ) : (
                  <div></div>
                )
              }
              label={props.value.sex}
            />
            <Chip icon={<CakeIcon />} label={props.value.birthdate} />
          </Stack>

          <Stack>
            {props.value.description.split("\n").map((row) => (
              <Typography
                variant="body1"
                sx={{
                  ...profile_layout,
                  wordBreak: "break-word",
                  textAlign: "center",
                  padding: "0 10 0 10",
                }}
                key={row}
              >
                {row}
              </Typography>
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
}
