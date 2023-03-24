import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import NormalButton from "../public/CommonButton";
import CloseIcon from "@mui/icons-material/Close";

type props = {
  openModal: boolean;
  handleCloseModal: () => void;
  header: string[];
  hightlightColorCode?: string;
  content: string;
  buttonLabel: string;
  buttonColor: string;
  buttonAction: () => void;
};

export default function CommonDialog(props: props) {
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
              <Typography variant="body1">{props.header[0]}{"\u00A0"}</Typography>
              <Typography variant="body1" color={props.hightlightColorCode || "error"}>
                {props.header[1]}
              </Typography>
              <Typography variant="body1">{"\u00A0"}{props.header[2]}</Typography>
            </Box>
            <IconButton onClick={props.handleCloseModal} sx={{ padding: 0 }}>
              <CloseIcon fontSize="large" color="secondary" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="error">
            {props.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <NormalButton label={props.buttonLabel} onClick={props.buttonAction} color={props.buttonColor} />
        </DialogActions>
      </Dialog>
    </>
  );
}
