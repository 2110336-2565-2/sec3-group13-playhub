import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export class PasswordService {
  supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async RequestResetPassword(email: string): Promise<void> {
    const sendResetPasswordEmailResult = await this.supabaseClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: process.env.NEXT_PUBLIC_DOMAIN_NAME + "/resetPassword",
      }
    );
    if (sendResetPasswordEmailResult.error) {
      throw new Error("Something went wrong!!");
    }
  }

  async ResetPassword(newPassword: string): Promise<void> {
    const resetPasswordResult = await this.supabaseClient.auth.updateUser({
      password: newPassword,
    });
    if (resetPasswordResult.error) {
      throw new Error("Something went wrong!!");
    }
  }
}
