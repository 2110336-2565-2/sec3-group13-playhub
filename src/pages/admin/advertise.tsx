import AdminNavbar from "@/components/admin/AdminNavbar";
import CommonButton from "@/components/public/CommonButton";
import Loading from "@/components/public/Loading";
import CommonTextField from "@/components/public/CommonTextField";

import { Box, Card, CardMedia, FormControlLabel, FormHelperText, IconButton, Input, Radio, RadioGroup, Stack, TextField, Typography, useTheme } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";

import { COLOR } from "enum/COLOR"
import { PAGE_PATHS } from "enum/PAGES"

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { ChangeEvent, useContext, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { userContext } from "supabase/user_context";
import { validation } from "@/types/Validation";
import { validateImage, validateTextField } from "@/utilities/validation";
import { CreateAdvertisement } from "@/services/Advertisement";
import CommonDialog from "@/components/public/CommonDialog";
import AdvertiseConfirmDialog from "@/components/admin/AdvertiseConfirmDialog";
import { STARTER_DURATION } from "enum/ADVERTISE";

export default function Advertise() {
    const router: NextRouter = useRouter();
    const userStatus = useContext(userContext);
    const appTheme = useTheme()
    const supabaseClient = useSupabaseClient<Database>();

    const [owner, setOwner] = useState<string>("");
    const [errOwner, setErrOwner] = useState<validation>({ msg: "", err: false });

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
        let isError: boolean = false
        const errorOwnerTextField: validation = validateTextField(owner, 1)
        setErrOwner(errorOwnerTextField)
        isError ||= errorOwnerTextField.err
        if (duration === null) {
            setErrDuration({
                msg: "Please select advertisement’s duration.",
                err: true
            })
            isError = true
        }
        if (duration === "Other" || duration === 0) {
            setErrDuration({
                msg: "Please fill in the number of day for advertisement’s duration",
                err: true
            })
            isError = true
        }
        if (!fileImage) {
            setErrorFileImage({
                msg: "Please upload advertisement’s image.",
                err: true
            })
            isError = true
        }
        if (isError) {
            return;
        }
        setShowSummaryDialog(true)
    }
    function handleOwnerTextFieldChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setErrOwner({ msg: "", err: false })
        setOwner(event.target.value)
    }
    function handleDurationChange(event: ChangeEvent<HTMLInputElement>): void {
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
        const tempFile = event.target.files[0];
        const imgErrMsg = validateImage(tempFile.type, tempFile.size);
        setErrorFileImage(imgErrMsg);
        setDisplayImage(URL.createObjectURL(tempFile))
        setFileImage(tempFile)
        event.target.value = null;
    };
    function handleCancelImageChip(): void {
        setErrorFileImage({ msg: "", err: false });
        setDisplayImage(undefined)
        setFileImage(null);
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
            <Stack margin={"30px auto auto auto"} width="60vw" minWidth="720px">
                <Typography variant="h1">Add Advertisement</Typography>
                <Typography variant="body1">Owner</Typography>
                <TextField
                    placeholder="Advertisement’s Owner"
                    value={owner}
                    onChange={handleOwnerTextFieldChange}
                    error={errOwner.err}
                />
                <FormHelperText sx={{ margin: "10px" }} error>{errOwner.err && errOwner.msg}{"\u00A0"}</FormHelperText>
                <Typography variant="body1">Duration</Typography>
                <RadioGroup
                    row
                    defaultValue="female"
                    onChange={handleDurationChange}
                >
                    {STARTER_DURATION.map((amountOfDays) => {
                        return <FormControlLabel key={amountOfDays} value={amountOfDays} control={<Radio />} label={amountOfDays.toString() + " day" + (amountOfDays === 1 ? "" : "s")} sx={{ width: "18%", margin: 0 }} />
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
                                <Box display="flex" alignItems="center">
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
                                        error={duration === "Other"}
                                    />
                                    {"\u00A0"}days
                                </Box>
                                : 'Other'
                        } />

                </RadioGroup>
                <FormHelperText error>{errDuration.err && errDuration.msg}{"\u00A0"}</FormHelperText>
                <Stack direction={"row"} justifyContent="space-between">
                    <Typography variant="body1">File</Typography>
                    <IconButton
                        onClick={handleCancelImageChip}
                        color="secondary"
                        style={{ padding: "5px", position: "relative", top: "23px", left: "12px", backgroundColor: "black", opacity: fileImage === null ? 0 : 1 }}
                        disabled={fileImage === null}
                    >
                        <CloseIcon color="primary" fontSize="medium" />
                    </IconButton>
                </Stack>
                <Stack spacing={1}>
                    <Card
                        sx={{
                            boxShadow: "8px 8px 1px grey",
                            borderRadius: "15px",
                            border: `3px ${errFileImage.err ? appTheme.palette.error.main : appTheme.palette.secondary.main}  solid`,
                            height: "20vw",
                            minHeight: "240px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        }}
                    >
                        {displayImage ?
                            <CardMedia
                                sx={{ height: "100%", width: "100%" }}
                                image={displayImage}
                                title="poster file"
                            />
                            // <img height="100%" width="100%" alt="poster file" src={displayImage} />
                            :
                            <IconButton sx={{ width: "150px", height: "150px" }} aria-label="upload picture" component="label">
                                <input onChange={handleImageChange} hidden accept="image/*" type="file" />
                                <CameraAltIcon color={errFileImage.err ? "error" : undefined} sx={{ fontSize: "100px", opacity: errFileImage.err ? 0.5 : 1 }} />
                            </IconButton>
                        }
                    </Card>
                    <FormHelperText error>{errFileImage.err && errFileImage.msg}{"\u00A0"}</FormHelperText>
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