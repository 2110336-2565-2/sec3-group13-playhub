import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';

type props = {
    children: JSX.Element;
    openModal: boolean;
    handleCloseModal: () => void;
    verifyUser: () => void;
    nationalID: string;
};

export default function AdminVerifyDialog(props: props) {
    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth="sm"
                open={props.openModal}
                onClose={props.handleCloseModal}
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h1">Verify this user</Typography>
                        <CloseIcon onClick={props.handleCloseModal}>
                            Cancel
                        </CloseIcon>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={1} alignItems="center" sx={{ margin: "30px 0" }}>
                        <Typography align="center">เลขบัตรประจำตัวประชาชน</Typography>
                        <Typography>{props.nationalID.slice(0, 1)} {props.nationalID.slice(1, 5)} {props.nationalID.slice(5, 10)} {props.nationalID.slice(10, 12)} {props.nationalID[12]}</Typography>
                        <Typography></Typography>
                        {props.children}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={props.verifyUser}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
