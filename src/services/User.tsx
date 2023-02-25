import { SUPABASE_CONNECTING_ERROR } from "@/constants/supabase";
import { User } from "@/types/User";
import { AuthResponse, SupabaseClient } from "@supabase/supabase-js";
import { Dayjs } from "dayjs";
import { Database } from "supabase/db_types";

export async function CreateUser(
    username: string,
    sex: string,
    birthdate: Dayjs,
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
        throw new Error(SUPABASE_CONNECTING_ERROR);
    }
    
    const addUserData = await supabaseClient.rpc("create_user", {
        id: signUpResult.data.user?.id,
        username: username,
        password: password,
        email: email,
        birthdate: birthdate.format('MM/DD/YYYY'),
        sex: sex,
    });
    if (addUserData.error) {
        console.log(addUserData.error);
        throw new Error(SUPABASE_CONNECTING_ERROR);
    }
}

export async function GetUserByUserId(
    id: string,
    supabaseClient: SupabaseClient<Database, "public", any>,
): Promise <User> {
    const getUserDataResult = await supabaseClient.rpc("get_user_by_user_id",{id});
    if (getUserDataResult.error || getUserDataResult.count == 0) {
        console.log(
          getUserDataResult.error ? getUserDataResult.error : "no user"
        );
        throw new Error(SUPABASE_CONNECTING_ERROR);
    }
    return ({
        userId: getUserDataResult.data[0].id,
        username: getUserDataResult.data[0].username,
        email: getUserDataResult.data[0].email,
        birthdate: getUserDataResult.data[0].birthdate,
        sex: getUserDataResult.data[0].sex,
        description: getUserDataResult.data[0].description,
        isAdmin: getUserDataResult.data[0].is_admin,
        image: getUserDataResult.data[0].image
    });
}

export async function SignIn(
    email: string,
    password: string,
    supabaseClient: SupabaseClient<Database, "public", any>,
): Promise<void> {
    // sign in via supabase
    const signInResult: AuthResponse =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

    if (signInResult.error) {
        throw new Error(signInResult.error.message);
    }
}

export async function SignOut(
    supabaseClient: SupabaseClient<Database, "public", any>,
){
    const signOutResult = await supabaseClient.auth.signOut();
    if (signOutResult.error) {
      console.log(signOutResult.error);
      throw new Error(SUPABASE_CONNECTING_ERROR);
    }
}