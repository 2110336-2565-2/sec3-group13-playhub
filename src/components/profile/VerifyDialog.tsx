import { useContext } from "react";
import { userContext } from "supabase/user_context";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { PAGE_PATHS } from "enum/PAGES";
import { NextRouter, useRouter } from "next/router";
import NormalButton from "../public/CommonButton";
import CloseIcon from "@mui/icons-material/Close";

type props = {
  openModal: boolean;
  handleCloseModal: () => void;
};

export default function DeletePostDialog(props: props) {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);

  function handleGoBackToMyProfile() {
    router.push(PAGE_PATHS.PROFILE + userStatus.user?.userId);
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
          <Stack direction="row">
            <Box display="flex" sx={{ flexGrow: 1, alignItems: "center" }}>
              <Typography variant="body1">Are you sure to{"\u00A0"}</Typography>
              <Typography variant="body1" color="error">
                quit
              </Typography>
              <Typography variant="body1">{"\u00A0"}edit profile ?</Typography>
            </Box>
            <IconButton onClick={props.handleCloseModal} sx={{ padding: 0 }}>
              <CloseIcon fontSize="large" color="secondary" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="error">
            *All changes would be discarded
          </Typography>
        </DialogContent>
        <DialogActions>
          <NormalButton label="Quit" onClick={handleGoBackToMyProfile} />
          {/* <NormalButton label="Continue Editing" onClick={props.handleCloseModal} /> */}
        </DialogActions>
      </Dialog>
    </>
  );
}
