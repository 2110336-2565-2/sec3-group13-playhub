import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

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
                    <Typography>Verify this user</Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography>เลขบัตรประจำตัวประชาชน</Typography>
                    {props.children}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={props.handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={props.verifyUser}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
