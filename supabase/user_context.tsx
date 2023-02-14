import { UserStatus } from "@/types/User";
import { ScriptProps } from "next/script";
import { createContext, useState, useEffect } from "react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Database } from "./db_types";
import { useRouter } from "next/router";

export const userContext = createContext<UserStatus>({
  user: null,
  isLoading: true,
});

export const UserStatusWrapper = (prop: ScriptProps) => {
  const [userStatus, setUserStatus] = useState<UserStatus>({
    user: null,
    isLoading: true,
  });
  const sessionContext = useSessionContext();
  const supabaseClient = useSupabaseClient<Database>();
  const router = useRouter();

  useEffect(() => {
    async function getUserData() {
      if (sessionContext.isLoading) return;
      if (!sessionContext.session) {
        setUserStatus({ user: null, isLoading: false });
        return;
      }
      if (userStatus.user) return;
      const userData = await supabaseClient.rpc("get_user_data_by_id", {
        target_id: sessionContext.session.user.id,
      });
      if (userData.error || userData.count == 0 || userData.data == null) {
        setUserStatus({ user: null, isLoading: false });
        return;
      }
      setUserStatus({ user: userData.data[0], isLoading: false });
    }
    getUserData();
  }, [
    sessionContext.isLoading,
    sessionContext.session,
    supabaseClient,
    router.pathname,
    userStatus.user,
  ]);

  return (
    <userContext.Provider value={userStatus}>
      {prop.children}
    </userContext.Provider>
  );
};
