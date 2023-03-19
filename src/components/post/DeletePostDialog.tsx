import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { COLOR } from "enum/COLOR";
import NormalButton from "../public/CommonButton";

type props = {
  openModal: boolean;
  handleCloseModal: () => void;
  deletePost: () => void;
};

export default function DeletePostDialog(props: props) {
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
              delete
            </Typography>
            <Typography variant="body1">{"\u00A0"}this post ?</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="error">
            *This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <NormalButton label="Delete" color={COLOR.ERROR} onClick={props.deletePost} />
          <NormalButton label="Cancel" onClick={props.handleCloseModal} />
        </DialogActions>
      </Dialog>
    </>
  );
}
