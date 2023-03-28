import AdminNavbar from "@/components/admin/AdminNavbar";
import CommonButton from "@/components/public/CommonButton";
import Loading from "@/components/public/Loading";
import CommonTextField from "@/components/public/CommonTextField";

import { Box, FormControlLabel, FormHelperText, IconButton, Input, Radio, RadioGroup, Stack, TextField, Typography, useTheme } from "@mui/material";
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
import CommonDialog from "@/components/public/CommonDialog";
import AdvertiseConfirmDialog from "@/components/admin/AdvertiseConfirmDialog";

export default function Advertise() {
    const router: NextRouter = useRouter();
    const userStatus = useContext(userContext);
    const appTheme = useTheme()
    const supabaseClient = useSupabaseClient<Database>();
    const [isPressSubmit, setIsPressSubmit] = useState<boolean>(false);

    const [owner, setOwner] = useState<string>("");
    const errorOwnerTextField: validation = validateTextField(owner, 1)

    const [duration, setDuration] = useState<number | "Other" | null>(null)
    const [isDurationCustomed, setIsDurationCustomed] = useState<boolean>(false)
    const [errDuration, setErrDuration] = useState<validation>({
        msg: "",
        err: false
    })

    const [fileImage, setFileImage] = useState<File | null>(null);
    const [displayImage, setDisplayImage] = useState<string>();
    const [errFileImage, setErrorFileImage] = useState<validation>({
        msg: "",
        err: false
    })

    const [showSummaryDialog, setShowSummaryDialog] = useState<boolean>(false)
    const [showDiscardDialog, setShowDiscardDialog] = useState<boolean>(false)

    function onSubmit(): void {
        if (owner.length === 0 || !duration || duration === "Other" || !fileImage) return;
        CreateAdvertisement(owner, duration, fileImage, supabaseClient)
            .then(() => {
                router.push(PAGE_PATHS.ADMIN_HOME + userStatus.user?.userId);
                return;
            })
            .catch((err) => {
                console.log(err);
                return;
            });
    }

    function openSummaryDialog(): void {
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
        if (duration === null) {
            setErrDuration({
                msg: "Please select advertisement’s duration.",
                err: true
            })
            return;
        }
        if (duration === "Other" || duration === 0) {
            setErrDuration({
                msg: "Please fill in the number of day for advertisement’s duration",
                err: true
            })
            return
        }
        setShowSummaryDialog(true)
    }
    function handleOwnerTextFieldChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setIsPressSubmit(false)
        setOwner(event.target.value)
    }
    function handleDurationChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setErrDuration({ msg: "", err: false })
        if ((event.target as HTMLInputElement).value === "Other") {
            setDuration("Other")
            return
        }
        setIsDurationCustomed(false)
        const newDuration = Number((event.target as HTMLInputElement).value)
        setDuration(newDuration);
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
                    onChange={handleDurationChange}
                >
                    {[1, 7, 15, 30, 45, 60, 90, 180, 365].map((amountOfDays) => {
                        return <FormControlLabel value={amountOfDays} control={<Radio />} label={amountOfDays.toString() + " day" + (amountOfDays === 1 ? "" : "s")} sx={{ width: "18%", margin: 0 }} />
                    })}

                    <FormControlLabel
                        sx={{ width: "18%", margin: 0 }}
                        value={duration}
                        control={
                            <Radio
                                checked={isDurationCustomed}
                                onClick={() => setIsDurationCustomed(true)}
                                value="Other"
                                color="primary"
                            />
                        }
                        label={
                            isDurationCustomed ?
                                <Box display={"flex"}>
                                    Other{"\u00A0"}
                                    <Input
                                        value={duration === "Other" ? "" : duration}
                                        sx={{ width: "50px" }}
                                        onChange={(e) => {
                                            setErrDuration({ msg: "", err: false })
                                            const val = e.target.value
                                            const regex = RegExp("^[0-9]{0,3}$")
                                            if (!regex.test(val)) return;
                                            setDuration(Number(val))
                                        }}
                                    />
                                    {"\u00A0"}days
                                </Box>
                                : 'Other'
                        } />

                </RadioGroup>
                <FormHelperText error>{isPressSubmit && errDuration.err && errDuration.msg}{"\u00A0"}</FormHelperText>
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
                <Stack justifyContent={"center"} direction={"row"} flexWrap={"wrap"} spacing={"15px"} margin={"30px 0"}>
                    <CommonButton label={"Cancel"} color={COLOR.NATURAL} onClick={() => { setShowDiscardDialog(!showDiscardDialog) }} />
                    <CommonButton label={"Add"} onClick={openSummaryDialog} />
                </Stack>
            </Stack>
            <AdvertiseConfirmDialog
                openModal={showSummaryDialog}
                handleCloseModal={() => { setShowSummaryDialog(false); }}
                header={"Add this advertisement ?"}
                buttonLabel={"Add"}
                buttonColor={COLOR.PRIMARY}
                buttonAction={onSubmit}
                owner={owner}
                duration={duration}
                fileImageURL={displayImage}
            />
            <CommonDialog
                openModal={showDiscardDialog}
                handleCloseModal={() => { setShowDiscardDialog(false) }}
                header={["Are you sure to", "cancel", "this advertisement ?"]}
                content={"*This advertisement would be discarded."}
                buttonLabel={"Yes"}
                buttonColor={COLOR.PRIMARY}
                buttonAction={backToAdminHome}
            />
        </>
    )
}