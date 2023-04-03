import React, { useContext, useState } from "react";
import { NextRouter, useRouter } from "next/router";

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

const NavBarMunuItemStyle = {
  justifyContent: "center",
  minWidth: "175px",
};

export default function Navbar() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [openProfileMenu, setOpenProfileMenu] = useState<null | HTMLElement>(null);
  const handleCloseProfileMenu = () => setOpenProfileMenu(null);
  const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenProfileMenu(event.currentTarget);
  };

  const [openAppointmentMenu, setOpenAppointmentMenu] = useState<null | HTMLElement>(null);
  const handleCloseAppointmentMenu = () => setOpenAppointmentMenu(null);
  const handleOpenAppointmentMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenAppointmentMenu(event.currentTarget);
  };

  const routeToHome = (): void => {
    router.push(PAGE_PATHS.HOME);
    return;
  };

  const routeToMyPosts = (): void => {
    router.push(PAGE_PATHS.MY_POSTS);
    return;
  };

  const routeToMyAppointments = (): void => {
    router.push(PAGE_PATHS.MY_APPOINTMENTS);
    return;
  };

  const routeToSelectAppointment = (): void => {
    router.push(PAGE_PATHS.SELECT_APPOINTMENT);
    return;
  };

  const routeToSelectRate = (): void => {
    router.push(PAGE_PATHS.SELECT_RATE);
    return;
  };

  const routeToMyProfile = (): void => {
    router.push(PAGE_PATHS.PROFILE + userStatus.user?.userId);
    return;
  };

  const routeToVerify = (): void => {
    router.push(PAGE_PATHS.VERIFY);
    return;
  };

  const handleSignOut = (): void => {
    SignOut(supabaseClient)
      .then(() => {
        router.push(PAGE_PATHS.LOGIN);
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar>
          {/* PlayHub Icon */}
          <IconButton disableRipple onClick={routeToHome}>
            <Logo width={50} height={50} bgColor={"trans"} />
          </IconButton>

          {/* Home button */}
          <Box sx={{ flexGrow: 1 }}>
            <IconButton color="inherit" disableRipple onClick={routeToHome}>
              <Typography variant="body1">{NAVBAR_PAGES.HOME}</Typography>
            </IconButton>
          </Box>

          {/* Post button */}
          {userStatus.user?.isVerified && (
            <Box sx={{ flexGrow: 0.02 }}>
              <IconButton color="inherit" disableRipple onClick={routeToMyPosts}>
                <Typography variant="body1">{NAVBAR_PAGES.POST}</Typography>
              </IconButton>
            </Box>
          )}

          {/* Appointment button */}
          <Box sx={{ flexGrow: 0.02 }}>
            <IconButton color="inherit" disableRipple onClick={handleOpenAppointmentMenu}>
              <Typography variant="body1">{NAVBAR_PAGES.APPOINTMENT}</Typography>
            </IconButton>
          </Box>

          {/* Rate button */}
          <Box sx={{ flexGrow: 0.02 }}>
            <IconButton color="inherit" disableRipple onClick={routeToSelectRate}>
              <Typography variant="body1">{NAVBAR_PAGES.RATE}</Typography>
            </IconButton>
          </Box>

          {/* Profile avatar */}
          <IconButton onClick={handleOpenProfileMenu}>
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
        </Toolbar>
      </AppBar>

      {/* appointment menu */}
      <Menu
        sx={{ mt: "40px" }}
        anchorEl={openAppointmentMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(openAppointmentMenu)}
        onClose={handleCloseAppointmentMenu}
      >
        <MenuItem key={1} onClick={routeToMyAppointments} style={NavBarMunuItemStyle}>
          <Typography variant="body1">{NAVBAR_PAGES.MY_APPOINTMENT}</Typography>
        </MenuItem>

        <MenuItem key={2} onClick={routeToSelectAppointment} style={NavBarMunuItemStyle}>
          <Typography variant="body1">{NAVBAR_PAGES.CONFIRM_REJECT}</Typography>
        </MenuItem>
      </Menu>

      {/* profile menu */}
      <Menu
        sx={{ mt: "40px" }}
        anchorEl={openProfileMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(openProfileMenu)}
        onClose={handleCloseProfileMenu}
      >
        <MenuItem key={1} onClick={routeToMyProfile} style={NavBarMunuItemStyle}>
          <Typography variant="body1">{NAVBAR_PAGES.PROFILE}</Typography>
        </MenuItem>

        {!userStatus.user?.isVerified && (
          <MenuItem key={2} onClick={routeToVerify} style={NavBarMunuItemStyle}>
            <Typography variant="body1" color="primary">
              {NAVBAR_PAGES.VERIFY}
            </Typography>
          </MenuItem>
        )}

        <MenuItem key={3} onClick={handleSignOut} style={NavBarMunuItemStyle}>
          <Typography variant="body1" color="error">
            {NAVBAR_PAGES.LOGOUT}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
