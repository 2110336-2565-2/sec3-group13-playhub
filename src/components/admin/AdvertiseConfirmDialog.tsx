import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import NormalButton from "../public/CommonButton";
import CloseIcon from "@mui/icons-material/Close";

type props = {
    openModal: boolean;
    handleCloseModal: () => void;
    header: string;
    buttonLabel: string;
    buttonColor: string;
    buttonAction: () => void;
    owner: string;
    duration: Number | "Other" | null;
    fileImageURL: string | undefined;
};

export default function AdvertiseConfirmDialog(props: props) {
    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={props.openModal}
                onClose={props.handleCloseModal}
            >
                <DialogTitle>
                    <Stack direction="row">
                        <Box display="flex" sx={{ flexGrow: 1, alignItems: "center" }}>
                            <Typography variant="body1">{props.header}</Typography>
                        </Box>
                        <IconButton onClick={props.handleCloseModal} sx={{ padding: 0 }}>
                            <CloseIcon fontSize="large" color="secondary" />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers sx={{ textAlign: "center" }}>
                    <Box display="flex" sx={{ justifyContent: "center" }}>
                        <Typography>Owner:{"\u00A0"}</Typography>
                        <Typography color="primary">{props.owner}</Typography>
                    </Box>
                    <Box display="flex" sx={{ justifyContent: "center" }}>
                        <Typography>Duration:{"\u00A0"}</Typography>
                        <Typography color="primary">{props.duration?.toString()} day{props.duration === 1 ? "" : "s"}</Typography>
                    </Box>
                    <Typography>File:</Typography>
                    <img width={"80%"} src={props.fileImageURL} alt={"preview_advert"} />
                </DialogContent>
                <DialogActions>
                    <NormalButton label={props.buttonLabel} onClick={props.buttonAction} color={props.buttonColor} />
                </DialogActions>
            </Dialog>
        </>
    );
}
