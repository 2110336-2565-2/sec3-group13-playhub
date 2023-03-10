import { Avatar, Chip, Typography, Stack } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";
import { User } from "@/types/User";
import { Gender } from "enum/gender";

type props = {
  value: User | null;
};

const profile_layout = {
  width: "50vw",
  minWidth: "200px",
};
const stack_design = {
  width: "400px",
  height: "50%",
  boxSizing: "border-box",
  background: "#FFFFFF",
  border: "1px solid rgba(0, 0, 0, 0.2)",
  borderRadius: " 15px",
};

const avatar = { width: 120, height: 120 };

export default function MemberDetail(props: props) {
  /*const [text, setText] = useState<string>("");
  setText(props.value.description);*/
  return (
    <>
      {props.value && (
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ /*margin: "10px"*/ padding: "30px", ...stack_design }}
        >
          <Typography variant="h1" align="center" sx={profile_layout}>
            {props.value.username}
          </Typography>
          <Typography variant="body1" align="center" sx={profile_layout}>
            {props.value.email}
          </Typography>
          <Avatar sx={avatar} alt="Profile picture" src={props.value.image as string} />
          <Stack direction="row" spacing={1}>
            <Chip
              icon={
                props.value.sex === Gender.male ? (
                  <MaleIcon />
                ) : props.value.sex === Gender.female ? (
                  <FemaleIcon />
                ) : props.value.sex === Gender.others ? (
                  <TransgenderIcon />
                ) : (
                  <div></div>
                )
              }
              label={props.value.sex}
            />
            <Chip icon={<CakeIcon />} label={props.value.birthdate} />
          </Stack>

          {props.value.description.split("\n").map((row) => (
            <Typography
              variant="body1"
              sx={{ ...profile_layout, wordBreak: "break-word", textAlign: "center" }}
              key={row}
            >
              {row}
            </Typography>
          ))}
        </Stack>
      )}
    </>
  );
}
