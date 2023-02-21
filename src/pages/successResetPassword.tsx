import { Box, Card, Link, Stack, Typography } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
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

            paddingBottom: "4vh",

            backgroundColor: grey[300],
          }}
        >
          <Stack
            spacing={3}
            sx={{
              paddingTop: "18vh",
              paddingBottom: "18vh",
            }}
            alignItems="center"
            justifyContent="center"
          >
            <DoneAllIcon
              style={{ width: "6vw", minWidth: "90px", height: "6vw", minHeight: "90px" }}
            />

            <Typography variant="h1">Your password is successfully reset!</Typography>

            <Box display="flex">
              <Typography variant="body1">Click{"\u00A0"}</Typography>
              <Link color="primary" underline="hover" href={PagePaths.login}>
                <Typography variant="body1">here</Typography>
              </Link>
              <Typography variant="body1">{"\u00A0"}to return to log in page</Typography>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </>
  );
}