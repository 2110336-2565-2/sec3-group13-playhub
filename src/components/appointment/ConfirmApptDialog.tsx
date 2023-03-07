import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

type Choice = "accept" | "reject";

type props = {
  openModal: boolean;
  handleCloseModal: () => void;
  choice: Choice;
  onConfirm: () => void;
};

const choice: { [key in Choice]: { color: string; text: string } } = {
  accept: {
    color: "green",
    text: "accept",
  },
  reject: {
    color: "red",
    text: "reject",
  },
};

export default function ConfirmApptDialog(props: props) {
  const selectedChoice = choice[props.choice];
  return (
    <Dialog fullWidth={true} maxWidth="sm" open={props.openModal} onClose={props.handleCloseModal}>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h1">
            Are you sure to{" "}
            <Typography variant="h1" color={selectedChoice.color} component="span">
              {selectedChoice.text}
            </Typography>{" "}
            this appointment ?
          </Typography>
          <CloseIcon onClick={props.handleCloseModal} style={{ cursor: "pointer" }} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1} alignItems="left" sx={{ margin: "5px 0" }}>
          <Typography align="left" color="red">
            *You can't undo this change
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={props.onConfirm}>
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
}
