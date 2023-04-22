import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export class NotificationService {
  supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async NotifyEndAppointment(email: string, apptName: string, apptHost: string): Promise<void> {
    console.log("this is noti");
    console.log(apptHost + " " + apptName);

    const sender = "noreply@playhub.com";
    const recipient = email;
    const subject = "Your boardgame appointment has been ended";
    const html_body =
      "<html><body>An appointment " +
      apptName.slice(1, -1) +
      " which " +
      apptHost.slice(1, -1) +
      " is the host has been ended. You can rate this appointment in our website.</body></html>";

    console.log("send_email message");
    console.log({ sender, recipient, subject, html_body });
    const sendEmailResult = await this.supabaseClient.rpc("send_email", {
      sender,
      recipient,
      subject,
      html_body,
    });
  }
}
