import { User } from "@/types/User";
import { AuthResponse, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export class UserService {
  supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async CreateUser(
    username: string,
    sex: string,
    birthdate: string,
    email: string,
    password: string
  ): Promise<void> {
    const isEmailExist = await this.supabaseClient.rpc("get_is_email_exist", { email });
    if (isEmailExist.data) {
      throw new Error("User already registered");
    }

    const signUpResult = await this.supabaseClient.auth.signUp({
      email: email,
      password: password,
    });

    if (signUpResult.error) {
      // one possible error is request sign up repeatedly too fast
      console.log(signUpResult.error);
      throw new Error("Something went wrong!!");
    }

    const addUserData = await this.supabaseClient.rpc("create_user", {
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

  async GetUserByUserId(id: string): Promise<User> {
    const getUserDataResult = await this.supabaseClient.rpc("get_user_by_user_id", { id });
    if (getUserDataResult.error || getUserDataResult.count == 0) {
      console.log(getUserDataResult.error ? getUserDataResult.error : "no user");
      throw new Error("Something went wrong!!");
    }
    return {
      userId: getUserDataResult.data[0].id,
      username: getUserDataResult.data[0].username,
      email: getUserDataResult.data[0].email,
      birthdate: getUserDataResult.data[0].birthdate,
      sex: getUserDataResult.data[0].sex,
      description: getUserDataResult.data[0].description,
      isAdmin: getUserDataResult.data[0].is_admin,
      image: getUserDataResult.data[0].image,
      isVerified: getUserDataResult.data[0].is_verified,
    };
  }

  async SignIn(email: string, password: string): Promise<void> {
    // sign in via supabase
    const signInResult: AuthResponse = await this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInResult.error) {
      throw new Error(signInResult.error.message);
    }
  }

  async SignOut() {
    const signOutResult = await this.supabaseClient.auth.signOut();
    if (signOutResult.error) {
      console.log(signOutResult.error);
      throw new Error("Something went wrong!!");
    }
  }

  async UpdateUserNationalIdByUserId(id: string, nationalId: string): Promise<boolean> {
    const updateResult = await this.supabaseClient.rpc("update_user_national_id_by_user_id", {
      id,
      national_id: nationalId,
    });

    if (updateResult.error) {
      console.log(updateResult.error);
      throw new Error("Something went wrong!!");
    }
    console.log(updateResult.data);
    return updateResult.data[0].is_exist_national_id;
  }
}
