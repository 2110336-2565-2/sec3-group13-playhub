import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

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
          <Typography variant="h4">Are you sure?</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Do you really want to delete the post? This process cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            onClick={props.handleCloseModal}
          >
            cancel
          </Button>
          <Button variant="contained" color="error" onClick={props.deletePost}>
            delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
