import { Box, Card, Link, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { PagePaths } from "enum/pages";

export default function Home() {
  return (
    <>
      <Stack
        alignItems="center"
        justifyContent="center"
        style={{ height: "100vh" }}
        sx={{ backgroundColor: "primary.main" }}
      >
        <Card
          sx={{
            width: "25vw",
            backgroundColor: grey[300],
          }}
        >
          <Stack
            spacing={3}
            alignItems="center"
            justifyContent="center"
            sx={{
              paddingTop: "125px",
              paddingBottom: "175px",
            }}
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
