import React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import DeletePostDialog from "./DeletePostDialog";

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
      <DeletePostDialog 
        openModal = {openDeletePostModal}
        handleCloseModal = {handleCloseModal}
        deletePost = {deletePost}
      />
      
    </>
  );
}
