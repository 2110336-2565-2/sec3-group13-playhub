import { UserStatus } from "@/types/User";
import { ScriptProps } from "next/script";
import { createContext, useState, useEffect } from "react";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
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
      const userData = await supabaseClient.rpc("get_user_by_user_id", {
        id: sessionContext.session.user.id,
      });
      if (userData.error || userData.count == 0 || userData.data == null) {
        setUserStatus({ user: null, isLoading: false });
        return;
      }
      setUserStatus({
        user: {
          userId: userData.data[0].id,
          username: userData.data[0].username,
          email: userData.data[0].email,
          birthdate: userData.data[0].birthdate,
          sex: userData.data[0].sex,
          description: userData.data[0].description,
          image: userData.data[0].image,
          isAdmin: userData.data[0].is_admin,
        },
        isLoading: false,
      });
    }
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionContext.isLoading, supabaseClient, router.pathname]);
  return <userContext.Provider value={userStatus}>{prop.children}</userContext.Provider>;
};
