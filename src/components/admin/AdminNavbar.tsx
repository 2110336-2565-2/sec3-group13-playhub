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
  Link,
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

export default function AdminNavbar() {
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
          <IconButton onClick={handleMenu}>
            {userStatus.user && userStatus.user.image ? (
              <Avatar
                alt="Profile picture"
                src={userStatus.user.image}
                sx={{ bgcolor: grey[50] }}
              />
            ) : null}
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
            <MenuItem>
              <Link textAlign="center" color="error" underline="none" onClick={handleSignOut}>
                <Typography variant="body1">{NAVBAR_PAGES.LOGOUT}</Typography>
              </Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}
