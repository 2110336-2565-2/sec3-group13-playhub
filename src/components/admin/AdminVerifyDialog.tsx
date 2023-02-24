import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import CommonTextField from "../public/CommonTextField";

type props = {
    openModal: boolean;
    handleCloseModal: () => void;
    verifyUser: () => void;
    nationalIDCard: string;
    handleNationalIDCardChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
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
                    <CommonTextField
                        placeholder="asd"
                        value={props.nationalIDCard}
                        handleValueChange={props.handleNationalIDCardChange}
                        isErr={false}
                        errMsg=""
                    />
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
