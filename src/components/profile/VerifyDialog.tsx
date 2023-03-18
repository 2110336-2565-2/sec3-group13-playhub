import { useContext } from "react";
import { userContext } from "supabase/user_context";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { PAGE_PATHS } from "enum/PAGES";
import { NextRouter, useRouter } from "next/router";
import NormalButton from "../public/CommonButton";
import { COLOR } from "enum/COLOR";

type props = {
  openModal: boolean;
  handleCloseModal: () => void;
};

export default function DeletePostDialog(props: props) {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);

  function handleGoBackToMyProfile() {
    router.push(PAGE_PATHS.MY_PROFILE + userStatus.user?.userId);
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
          <NormalButton label="Quit" color={COLOR.NATURAL} onClick={handleGoBackToMyProfile} />
          <NormalButton label="Continue Editing" onClick={props.handleCloseModal} />
        </DialogActions>
      </Dialog>
    </>
  );
}
