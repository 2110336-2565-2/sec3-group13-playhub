import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import CakeIcon from "@mui/icons-material/Cake";

import { User } from "@/types/User";
import Navbar from "@/components/public/Navbar";

import { useSessionContext } from '@supabase/auth-helpers-react'
import React from "react";
import { useRouter } from 'next/router'

const owner: boolean = true;
const avatar = { width: 200, height: 200 };

const email_txt = {
  fontSize: "body1.fontSize",
  fontWeight: "regular",
  textAlign: "center",
  m: 1,
};

const desc_txt = {
  fontSize: "body1.fontSize",
  fontWeight: "bold",
  textAlign: "center",
  m: 1,
};

export default function Home() {
  const router = useRouter()
  const sessionContext = useSessionContext()
  const [userData, setUserData] = React.useState<User | null>(null);

  React.useEffect(() => {
    async function getUserData() {
      if (!router.query.username || !sessionContext.session || userData) return;
      const fetchResult = await sessionContext.supabaseClient.from("User").select("name,sex,birthdate,description,image,email").eq("username", router.query.username)
      if (fetchResult.error) {
        // having query error
        console.log(fetchResult.error)
        return
      }
      if (fetchResult.count == 0) {
        // no data entry with matching username
        console.log("cant find the user")
        return
      }
      setUserData(fetchResult.data[0])
    }
    getUserData()
  }, [router, sessionContext, userData])

  if (sessionContext.isLoading) return <p>getting session...</p> //temporary display
  if (sessionContext.session == null) return <p>log in first</p> // temporary display
  if (userData == null) return <p>getting the user data</p> // temporary display
  return (
    <>
      <Navbar />
      <Stack spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: "90vh" }}>
        <Typography variant="h1">{userData.name}</Typography>
        {owner && <Typography variant="body1">{userData.email}</Typography>}
        <Avatar sx={avatar} alt="Profile picture" src={userData.image} />
        <Stack direction="row" spacing={1}>
          <Chip icon={<MaleIcon />} label={userData.sex} />
          <Chip icon={<CakeIcon />} label={userData.birthdate} />
        </Stack>
        <Typography variant="body1">{userData.description}</Typography>
        {owner && (
          <IconButton>
            <EditIcon />
          </IconButton>
        )}
      </Stack>
    </>
  );
}
