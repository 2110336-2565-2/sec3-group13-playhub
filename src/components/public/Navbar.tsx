import React, { useContext, useState } from "react";
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

import { PAGE_PATHS } from "enum/PAGES";
import { NAVBAR_PAGES } from "enum/NAVBAR";
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
    router.push(PAGE_PATHS.HOME);
    return;
  };

  const routeToSelectPost = (): void => {
    router.push(PAGE_PATHS.CREATE_APPOINTMENT)
    return;
  }

  const routeToSelectAppointment = (): void => {
    router.push(PAGE_PATHS.SELECT_APPOINTMENT)
    return;
  }

  async function handleSignOut() {
    SignOut(supabaseClient)
      .then(() => {
        router.push(PAGE_PATHS.LOGIN);
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
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
              <Typography variant="body1">{NAVBAR_PAGES.HOME}</Typography>
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0.02 }}>
            <IconButton color="inherit" disableRipple onClick={routeToSelectPost}>
              <Typography variant="body1">{NAVBAR_PAGES.POST}</Typography>
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0.02 }}>
            <IconButton color="inherit" disableRipple onClick={routeToSelectAppointment}>
              <Typography variant="body1">{NAVBAR_PAGES.APPOINTMENT}</Typography>
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0.02 }}>
            <IconButton color="inherit" disableRipple onClick={routeToSelectPost}>
              <Typography variant="body1">{NAVBAR_PAGES.POST}</Typography>
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0.02 }}>
            <IconButton color="inherit" disableRipple onClick={routeToSelectAppointment}>
              <Typography variant="body1">{NAVBAR_PAGES.APPOINTMENT}</Typography>
            </IconButton>
          </Box>
          <IconButton onClick={handleMenu}>
            {userStatus.user &&
              (userStatus.user.image ? (
                <Avatar
                  alt="Profile picture"
                  src={userStatus.user.image}
                  sx={{ bgcolor: grey[50] }}
                />
              ) : (
                <Avatar alt="Profile picture" />
              ))}
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
              <Link href={PAGE_PATHS.PROFILE + userStatus.user?.userId}>
                <Box alignContent={"center"}>
                  <Typography variant="body1">{NAVBAR_PAGES.PROFILE}</Typography>
                </Box>
              </Link>
            </MenuItem>

            <MenuItem key={2}>
              <Link href={PAGE_PATHS.MY_APPOINTMENTS}>
                <Typography variant="body1">{NAVBAR_PAGES.MY_APPOINTMENT}</Typography>
              </Link>
            </MenuItem>
            {
              userStatus.user?.isVerified &&
              <MenuItem key={3}>
                <Link href={PAGE_PATHS.MY_POSTS}>
                  <Typography variant="body1">{NAVBAR_PAGES.MY_POST}</Typography>
                </Link>
              </MenuItem>
            }
            {
              !userStatus.user?.isVerified && (
                <MenuItem key={4}>
                  <Link href={PAGE_PATHS.VERIFY}>
                    <Typography variant="body1" color="primary">
                      {NAVBAR_PAGES.VERIFY}
                    </Typography>
                  </Link>
                </MenuItem>
              )
            }
            <MenuItem key={5}>
              <Box onClick={handleSignOut}>
                <Typography variant="body1" color="error">
                  {NAVBAR_PAGES.LOGOUT}
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Toolbar >
      </AppBar >
    </>
  );
}
