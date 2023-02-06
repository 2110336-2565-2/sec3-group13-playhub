import { UserStatus } from "@/types/User";
import { ScriptProps } from "next/script";
import { createContext, useState, useEffect } from "react";
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from "./db_types";

export const userContext = createContext<UserStatus>({
    user: null,
    isLoading: true
})

export const UserStatusWrapper = (prop: ScriptProps) => {
    const [userStatus, setUserStatus] = useState<UserStatus>({user:null, isLoading:true}) ;
    const sessionContext = useSessionContext();
    const supabaseClient = useSupabaseClient<Database>();

    useEffect(() => {
        async function getUserData(){
            if(sessionContext.isLoading) return;
            if(sessionContext.session == null) return ;
            const userData = await supabaseClient.from('User')
            .select("username,name,sex,birthdate,description,image,email")
            .eq('user_id', sessionContext.session.user.id);
            if(userData.error != null || userData.count == 0 || userData.data == null){
                setUserStatus({user: null, isLoading: false});
                return;
            }
            setUserStatus({user: userData.data[0], isLoading: false});
        } 
        getUserData()
    },[sessionContext])
    return (<userContext.Provider value={userStatus}>{prop.children}</userContext.Provider>)
}