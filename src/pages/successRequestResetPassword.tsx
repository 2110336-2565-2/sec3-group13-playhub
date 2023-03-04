import { Box, Card, Link, Stack, Typography } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { grey } from "@mui/material/colors";

import Background from "@/components/public/Background";

import { PagePaths } from "enum/pages";

export default function Home() {
  return (
    <>
      <Stack style={{ height: "100vh" }} alignItems="center" justifyContent="center">
        <Background />
        <Card
          sx={{
            width: "30vw",
            minWidth: "300px",
            minHeight: "200px",

            paddingBottom: "3vh",

            backgroundColor: grey[300],
          }}
        >
          <Stack
            spacing={3}
            sx={{
              paddingTop: "15vh",
              paddingBottom: "21vh",
            }}
            alignItems="center"
            justifyContent="center"
          >
            <MarkEmailReadIcon
              style={{ width: "6vw", minWidth: "90px", height: "6vw", minHeight: "90px" }}
            />
            <Typography variant="h2">Check your email!</Typography>
            <Typography variant="body1">Reset password link is successfully sent</Typography>
          </Stack>

          <Box display="flex" justifyContent="center">
            <Typography variant="body2">Didn’t receive link? Click{"\u00A0"}</Typography>
            <Link color="primary" underline="hover" href={PagePaths.requestResetPassword}>
              <Typography variant="body2">here</Typography>
            </Link>
            <Typography variant="body2">{"\u00A0"}to resend</Typography>
          </Box>
        </Card>
      </Stack>
    </>
  );
}
