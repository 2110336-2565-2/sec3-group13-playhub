import AdminNavbar from "@/components/admin/AdminNavbar";
import CommonButton from "@/components/public/CommonButton";
import Loading from "@/components/public/Loading";
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
            <CommonButton label={"Cancel"} color={COLOR.NATURAL} onClick={backToAdminHome} />
            <CommonButton label={"Add"} onClick={onSubmit} />
        </>
    )
}