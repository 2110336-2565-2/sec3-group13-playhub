import AdminNavbar from "@/components/admin/AdminNavbar";
import CommonButton from "@/components/public/CommonButton";
import Loading from "@/components/public/Loading";
import { IconButton, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { COLOR } from "enum/COLOR"
import { PAGE_PATHS } from "enum/PAGES"

import { useContext, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { userContext } from "supabase/user_context";

export default function Advertise() {
    const router: NextRouter = useRouter();
    const userStatus = useContext(userContext);
    const [fileImage, setFileImage] = useState<File | null>(null);

    function onSubmit(): void {
        //BACKEND should be implemented here!
        // Use tempAdvertiseOwner,tempDuration, fileImage send to backend
        const tempAdvertiseOwner: string = "Chula new course"
        const tempDuration: number = 123
        console.table([tempAdvertiseOwner, tempDuration])
        console.log(fileImage)
    }

    const handleImageChange = (event: any): void => {
        const tempFile = event.target.files[0];
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
            <Typography variant="h1">Add Advertisement</Typography>
            <IconButton
                aria-label="upload picture"
                component="label"
            >
                <input onChange={handleImageChange} hidden accept="image/*" type="file" />
                <CameraAltIcon sx={{ fontSize: "50px" }} />
            </IconButton>
            <CommonButton label={"Cancel"} color={COLOR.NATURAL} onClick={backToAdminHome} />
            <CommonButton label={"Add"} onClick={onSubmit} />
        </>
    )
}