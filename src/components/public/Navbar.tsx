import { useContext, useState } from "react";

import { NextRouter, useRouter } from "next/router";
import Link from "next/link";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import Logo from "@/components/public/Logo";

import { PagePaths } from "enum/pages";
import { NavbarPages } from "enum/navbar";
import { SignOut } from "@/services/User";

export default function Navbar() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => setAnchorEl(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const routeToHome = (): void => {
    router.push(PagePaths.home);
    return;
  };

  async function handleSignOut() {
    SignOut(supabaseClient).then(() => {
      router.push(PagePaths.login);
      return;
    }).catch((err) => {
      console.log(err);
      return;
    })
  }

  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton disableRipple onClick={routeToHome}>
            <Logo width={50} height={50} bgColor={"trans"} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton color="inherit" disableRipple onClick={routeToHome}>
              <Typography variant="body1">{NavbarPages.home}</Typography>
            </IconButton>
          </Box>
          <IconButton onClick={handleMenu}>
            {userStatus.user && (
              userStatus.user.image ? (
                <Avatar
                  alt="Profile picture"
                  src={userStatus.user.image}
                  sx={{ bgcolor: grey[50] }}
                />
              ) : (
                <Avatar
                  alt="Profile picture"
                />
              )
            )}
          </IconButton>
          <Menu
            sx={{ mt: "40px" }}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem key={1}>
              <Link href={PagePaths.profile + userStatus.user?.userId}>
                <Box alignContent={"center"}>
                  <Typography variant="body1">{NavbarPages.profile}</Typography>
                </Box>
              </Link>
            </MenuItem>

            <MenuItem key={2}>
              <Link href={PagePaths.myAppointments}>
                <Typography variant="body1">{NavbarPages.myAppointments}</Typography>
              </Link>
            </MenuItem>

            {userStatus.user?.isVerified &&
              <MenuItem key={3}>
                <Link href={PagePaths.myPosts}>
                  <Typography variant="body1">{NavbarPages.myPost}</Typography>
                </Link>
              </MenuItem>
            }
            {!userStatus.user?.isVerified &&
              <MenuItem key={4}>
                <Link href={PagePaths.verify}>
                  <Typography variant="body1" color="primary">{NavbarPages.verify}</Typography>
                </Link>
              </MenuItem>
            }

            <MenuItem key={5}>
              <Box onClick={handleSignOut}>
                <Typography variant="body1" color="error">
                  {NavbarPages.logout}
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}
