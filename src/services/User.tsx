import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export async function CreateUser(
    username: string,
    sex: string,
    birthdate: string,
    email: string,
    password: string,
    supabaseClient: SupabaseClient<Database, "public", any>,
): Promise<void> {
    const isEmailExist = await supabaseClient.rpc('get_is_email_exist', {email});
    if(isEmailExist.data){
        throw new Error("User already registered")
    }

    const signUpResult = await supabaseClient.auth.signUp({
        email: email,
        password: password,
    });

    if (signUpResult.error) {
        // one possible error is request sign up repeatedly too fast
        console.log(signUpResult.error);
        throw new Error("Something went wrong!!");
    }
    
    const addUserData = await supabaseClient.rpc("create_user", {
        id: signUpResult.data.user?.id,
        username: username,
        password: password,
        email: email,
        birthdate: birthdate,
        sex: sex,
    });
    if (addUserData.error) {
        console.log(addUserData.error);
        throw new Error("Something went wrong!!");
    }
}