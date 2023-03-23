import AdminNavbar from "@/components/admin/AdminNavbar";
import CommonButton from "@/components/public/CommonButton";
import { Typography } from "@mui/material";

import { COLOR } from "enum/COLOR"
import { PAGE_PATHS } from "enum/PAGES"

import { useContext } from "react";
import { NextRouter, useRouter } from "next/router";
import { userContext } from "supabase/user_context";

export default function Advertise() {
    const router: NextRouter = useRouter();
    const userStatus = useContext(userContext);

    function onSubmit(): void {
        //BACKEND should be implemented here!
        console.log("Add button is clicked!")
    }

    function backToAdminHome(): void {
        router.push(`${PAGE_PATHS.ADMIN_HOME}${userStatus.user?.userId}`)
        return
    }

    return (
        <>
            <AdminNavbar />
            <Typography variant="h1">Add Advertisement</Typography>
            <CommonButton label={"Cancel"} color={COLOR.NATURAL} onClick={backToAdminHome} />
            <CommonButton label={"Add"} onClick={onSubmit} />
        </>
    )
}