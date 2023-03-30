import { GetAdvertisementUrl } from "@/services/Advertisement";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect, useState } from "react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";

export default function AdvertiseCard() {
    const supabaseClient = useSupabaseClient<Database>();
    const userStatus = useContext(userContext);

    const [advertise, setAdvertise] = useState<string>();
    function getAdvertisement() {
        if (!userStatus.user) return;
        GetAdvertisementUrl(supabaseClient)
            .then((p) => {
                setAdvertise(p)
            }).catch((err) => {
                console.log(err)
                return
            })
    }
    useEffect(() => {
        getAdvertisement()
    }, [])
    return (
        <img width={"100%"} src={advertise} />
    )
}