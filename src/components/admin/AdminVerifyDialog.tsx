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
