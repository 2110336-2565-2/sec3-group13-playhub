import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { PagePaths } from "enum/pages";
import { NextRouter, useRouter } from "next/router";

type props = {
  openModal: boolean;
  handleCloseModal: () => void;
};

export default function DeletePostDialog(props: props) {
  const router: NextRouter = useRouter();

  function handleGoBackToMyProfile() {
    router.push(PagePaths.profile);
  }

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={props.openModal}
        onClose={props.handleCloseModal}
      >
        <DialogTitle>
          <Box display="flex">
            <Typography variant="body1">Are you sure to{"\u00A0"}</Typography>
            <Typography variant="body1" color="error">
              quit
            </Typography>
            <Typography variant="body1">{"\u00A0"}edit profile ?</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="error">
            *All changes would be discarded
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleGoBackToMyProfile}>
            Quit
          </Button>
          <Button variant="contained" color="primary" onClick={props.handleCloseModal}>
            Continue Editing
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
