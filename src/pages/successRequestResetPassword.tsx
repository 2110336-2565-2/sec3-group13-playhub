import { Box, Card, Link, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
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
            paddingBottom: "20px",
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
            <MarkEmailReadIcon
              style={{ width: "6vw", minWidth: "90px", height: "6vw", minHeight: "90px" }}
            />
            <Typography variant="h1">Check your email!</Typography>
            <Typography variant="body1">Reset password link is successfully sent</Typography>
          </Stack>
          <Box display="flex" justifyContent="center">
            <Typography variant="body1">Didn’t receive link? Click{"\u00A0"}</Typography>
            <Link color="primary" underline="hover" href={PagePaths.login}>
              <Typography variant="body1">here</Typography>
            </Link>
            <Typography variant="body1">{"\u00A0"}to resend</Typography>
          </Box>
        </Card>
      </Stack>
    </>
  );
}
