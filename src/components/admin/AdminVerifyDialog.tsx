import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import { CHAR_LIMIT } from "enum/inputLimit";

const helperText = {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: "10px"
};

type props = {
    openModal: boolean;
    handleCloseModal: () => void;
    verifyUser: () => void;
    nationalID: string;
    isError: boolean;
    handleTextFieldChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    errMsg: string;
};

export default function AdminVerifyDialog(props: props) {
    const previewID = props.nationalID + "_".repeat(CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER - props.nationalID.length)

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
                        <CloseIcon onClick={props.handleCloseModal} style={{ cursor: "pointer" }} />
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={1} alignItems="center" sx={{ margin: "30px 0" }}>
                        <Typography align="center">เลขบัตรประจำตัวประชาชน</Typography>
                        <Typography>{previewID.slice(0, 1)}-{previewID.slice(1, 5)}-{previewID.slice(5, 10)}-{previewID.slice(10, 12)}-{previewID[12]}</Typography>
                        <Box sx={{ width: "70%", margin: "auto" }}>
                            <TextField
                                placeholder="เลขโดด 13 หลักเท่านั้น"
                                error={props.isError}
                                value={props.nationalID}
                                onChange={props.handleTextFieldChange}
                                fullWidth
                                inputProps={{
                                    sx: {
                                        textAlign: "center",
                                        "&::placeholder": {
                                            textAlign: "center",
                                        },
                                    },
                                }}
                            />
                            <Box sx={helperText}>
                                <FormHelperText>
                                    {`${props.nationalID.length}/${CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER}`}
                                </FormHelperText>
                                {props.isError && <FormHelperText error>{props.errMsg}</FormHelperText>}
                            </Box>
                        </Box>
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
