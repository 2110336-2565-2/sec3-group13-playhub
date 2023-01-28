import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeletePostButton() {
  const [openDeletePostModal, setOpenDeletePostModal] = React.useState(false);
  const handleOpenModal = () => setOpenDeletePostModal(true);
  const handleCloseModal = () => setOpenDeletePostModal(false);

  function deletePost() {
    console.log("The post is deleted");
    handleCloseModal();
    // call delete post endpoint
    // go to all post page
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={<DeleteIcon />}
        color="error"
        onClick={handleOpenModal}
      >
        Delete
      </Button>

      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={openDeletePostModal}
        onClose={handleCloseModal}
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
            onClick={handleCloseModal}
          >
            cancel
          </Button>
          <Button variant="contained" color="error" onClick={deletePost}>
            delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
