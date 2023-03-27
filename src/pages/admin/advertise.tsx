import AdminNavbar from "@/components/admin/AdminNavbar";
import CommonButton from "@/components/public/CommonButton";
import Loading from "@/components/public/Loading";
import CommonTextField from "@/components/public/CommonTextField";

import { Box, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, Radio, RadioGroup, Stack, Typography, useTheme } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { COLOR } from "enum/COLOR"
import { PAGE_PATHS } from "enum/PAGES"

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { useContext, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { userContext } from "supabase/user_context";
import { validation } from "@/types/Validation";
import { validateImage, validateTextField } from "@/utilities/validation";
import { CreateAdvertisement } from "@/services/Advertisement";

export default function Advertise() {
    const router: NextRouter = useRouter();
    const userStatus = useContext(userContext);
    const appTheme = useTheme()
    const supabaseClient = useSupabaseClient<Database>();
    const [isPressSubmit, setIsPressSubmit] = useState<boolean>(false);

    const [owner, setOwner] = useState<string>("");
    const errorOwnerTextField: validation = validateTextField(owner, 1)

    const [fileImage, setFileImage] = useState<File | null>(null);
    const [displayImage, setDisplayImage] = useState<string>();
    const [errFileImage, setErrorFileImage] = useState<validation>({
        msg: "",
        err: false
    })

    function onSubmit(): void {
        setIsPressSubmit(true)
        if (errorOwnerTextField.err || errFileImage.err) {
            return;
        }
        if (!fileImage) {
            setErrorFileImage({
                msg: "Please upload advertisement’s image.",
                err: true
            })
            return;
        }
        // BACKEND should be implemented here!
        // Use tempAdvertiseOwner,tempDuration, fileImage send to backend
        const tempAdvertiseOwner: string = "Chula new course"
        const tempDuration: number = 123
        console.table([tempAdvertiseOwner, tempDuration])
        // Upload via UI
        console.log(fileImage)
        CreateAdvertisement(tempAdvertiseOwner, tempDuration, fileImage, supabaseClient)
            .then(() => {
                router.push(PAGE_PATHS.ADMIN_HOME + userStatus.user?.userId);
                return;
            })
            .catch((err) => {
                console.log(err);
                return;
            });
    }

    function handleOwnerTextFieldChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setIsPressSubmit(false)
        setOwner(event.target.value)
    }
    function handleImageChange(event: any): void {
        setIsPressSubmit(false)
        const tempFile = event.target.files[0];
        const imgErrMsg = validateImage(tempFile.type, tempFile.size);
        setErrorFileImage(imgErrMsg);
        setDisplayImage(URL.createObjectURL(tempFile))
        setFileImage(tempFile)
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
                    isErr={isPressSubmit && errorOwnerTextField.err}
                    errMsg={errorOwnerTextField.msg}
                />
                <Typography variant="body1">Duration</Typography>
                <RadioGroup
                    row
                    defaultValue="female"
                >
                    {[1, 7, 15, 30, 45, 60, 90, 180, 365].map((amountOfDays) => {
                        return <FormControlLabel value={amountOfDays} control={<Radio />} label={amountOfDays.toString() + " days"} />
                    })}
                    <FormControlLabel value={"Other"} control={<Radio />} label={"Other"} />
                </RadioGroup>
                <Typography variant="body1">File</Typography>
                <Stack spacing={1}>
                    <Box
                        sx={{
                            boxShadow: "8px 8px 1px grey",
                            borderRadius: "15px",
                            border: `3px ${errFileImage.err ? appTheme.palette.error.main : appTheme.palette.secondary.main}  solid`,
                            height: "250px",
                            textAlign: "center",
                        }}
                    >
                        {displayImage ?
                            <img height={"95%"} alt="poster file" src={displayImage} />
                            :
                            <IconButton aria-label="upload picture" component="label">
                                <input onChange={handleImageChange} hidden accept="image/*" type="file" />
                                <CameraAltIcon color={errFileImage.err ? "error" : undefined} sx={{ fontSize: "50px", opacity: errFileImage.err ? 0.5 : 1 }} />
                            </IconButton>
                        }
                    </Box>
                    <FormHelperText error>{isPressSubmit && errFileImage.err && errFileImage.msg}{"\u00A0"}</FormHelperText>
                </Stack>
                <Stack justifyContent={"center"} direction={"row"} flexWrap={"wrap"} spacing={"15px"} marginTop={"40px"}>
                    <CommonButton label={"Cancel"} color={COLOR.NATURAL} onClick={backToAdminHome} />
                    <CommonButton label={"Add"} onClick={onSubmit} />
                </Stack>
            </Stack>
        </>
    )
}