import AdminNavbar from "@/components/admin/AdminNavbar";
import CommonButton from "@/components/public/CommonButton";
import Loading from "@/components/public/Loading";
import CommonTextField from "@/components/public/CommonTextField";

import { Box, FormHelperText, IconButton, Stack, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { COLOR } from "enum/COLOR"
import { PAGE_PATHS } from "enum/PAGES"

import { useContext, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { userContext } from "supabase/user_context";
import { validation } from "@/types/Validation";
import { validateImage, validateTextField } from "@/utilities/validation";

export default function Advertise() {
    const router: NextRouter = useRouter();
    const userStatus = useContext(userContext);

    const [owner, setOwner] = useState<string>("");
    const [errorOwnerTextField, setErrorOwnerTextField] = useState<validation>({
        msg: "",
        err: false
    })

    const [fileImage, setFileImage] = useState<File | null>(null);
    const [errFileImage, setErrorFileImage] = useState<validation>({
        msg: "",
        err: false
    })

    function onSubmit(): void {
        const resultTextFieldErr: validation = validateTextField(owner, 1)
        if (resultTextFieldErr.err) {
            setErrorOwnerTextField(
                {
                    msg: resultTextFieldErr.msg,
                    err: true
                }
            )
            return;
        }
        if (!fileImage) {
            setErrorFileImage(
                {
                    msg: "Please upload advertisement’s image.",
                    err: true
                }
            )
            return
        }
        const resultImgErr: validation = validateImage(fileImage.type, 500)
        if (resultImgErr.err) {
            setErrorFileImage(
                {
                    msg: resultImgErr.msg,
                    err: true
                }
            )
            return
        }


        // BACKEND should be implemented here!
        // Use tempAdvertiseOwner,tempDuration, fileImage send to backend
        const tempAdvertiseOwner: string = "Chula new course"
        const tempDuration: number = 123
        console.table([tempAdvertiseOwner, tempDuration])
        // Upload via UI
        console.log(fileImage)
    }

    function handleOwnerTextFieldChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setErrorOwnerTextField({
            msg: "",
            err: false
        })
        setOwner(event.target.value)
    }
    function handleImageChange(event: any): void {
        const tempFile = event.target.files[0];
        setFileImage(tempFile)
        setErrorFileImage({
            msg: "",
            err: false
        })
        event.target.value = null;
    };

    function backToAdminHome(): void {
        router.push(`${PAGE_PATHS.ADMIN_HOME}${userStatus.user?.userId}`)
        return
    }

    if (userStatus.isLoading) return <Loading />;
    if (!userStatus.user) {
        router.push(PAGE_PATHS.LOGIN);
        return;
    }
    if (!userStatus.user.isAdmin) {
        router.push(PAGE_PATHS.HOME);
        return;
    }

    return (
        <>
            <AdminNavbar />
            <Stack margin={"30px auto auto auto"} width={"60vw"}>
                <Typography variant="h1">Add Advertisement</Typography>
                <Typography variant="body1">Owner</Typography>
                <CommonTextField
                    icon={""}
                    placeholder={"Advertisement’s Owner"}
                    value={owner}
                    handleValueChange={handleOwnerTextFieldChange}
                    isErr={errorOwnerTextField.err}
                    errMsg={errorOwnerTextField.msg}
                />
                <Typography variant="body1">Duration</Typography>
                <Typography variant="body1">File</Typography>
                <Stack spacing={1}>
                    <Box
                        sx={{
                            boxShadow: "8px 8px 1px grey",
                            borderRadius: "15px",
                            border: "3px #000000 solid",
                            height: "250px",
                            textAlign: "center",
                        }}
                    >
                        <IconButton aria-label="upload picture" component="label">
                            <input onChange={handleImageChange} hidden accept="image/*" type="file" />
                            <CameraAltIcon color={errFileImage.err ? "error" : undefined} sx={{ fontSize: "50px", opacity: errFileImage.err ? 0.5 : 1 }} />
                        </IconButton>
                    </Box>
                    <FormHelperText error>{errFileImage.err && errFileImage.msg}{"\u00A0"}</FormHelperText>
                </Stack>
                <Stack justifyContent={"center"} direction={"row"} flexWrap={"wrap"} spacing={"15px"} marginTop={"40px"}>
                    <CommonButton label={"Cancel"} color={COLOR.NATURAL} onClick={backToAdminHome} />
                    <CommonButton label={"Add"} onClick={onSubmit} />
                </Stack>
            </Stack>
        </>
    )
}