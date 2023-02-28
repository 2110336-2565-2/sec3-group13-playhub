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
import { useEffect, useState } from "react";
import { UpdateUserNationalIdByUserId } from "@/services/User";
import { validation } from "@/types/Validation";
import { validateNationalIDCardNumber } from "@/utilities/validation";
import { NextRouter, useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

type props = {
    openModal: boolean;
    handleCloseModal: () => void;
};

export default function AdminVerifyDialog(props: props) {
    const router: NextRouter = useRouter();
    const supabaseClient = useSupabaseClient<Database>();

    const [nationalIDCard, setnationalIDCard] = useState<string>("");
    const [errMsg, setErrMsg] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);

    const previewID = nationalIDCard + "_".repeat(CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER - nationalIDCard.length)

    useEffect(() => {
        clearError()
        setnationalIDCard("")
    }, [props.openModal])

    function verifyUser(): void {
        console.log("confirm button is clicked!!", nationalIDCard);

        const validate: validation = validateNationalIDCardNumber(nationalIDCard);
        if (validate.err) {
            setIsError(true);
            setErrMsg(validate.msg);
            return;
        }

        UpdateUserNationalIdByUserId(router.query.user_id as string, nationalIDCard, supabaseClient)
            .then((is_national_id_exist) => {
                if (is_national_id_exist) {
                    setIsError(true);
                    setErrMsg("เลขบัตรประจำตัวประชาชนนี้ถูกใช้งานไปแล้ว");
                    return;
                }
                router.reload()
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleNationalIDCardChange(
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void {
        if (event.target.value.length > CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER) return
        setnationalIDCard(event.target.value);
        clearError()
    }
    function clearError(): void {
        setErrMsg("")
        setIsError(false)
    }
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
                                error={isError}
                                value={nationalIDCard}
                                onChange={handleNationalIDCardChange}
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
                            <Box sx={{ marginTop: "10px" }}>
                                {isError && <FormHelperText error>{errMsg}</FormHelperText>}
                            </Box>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={verifyUser}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
