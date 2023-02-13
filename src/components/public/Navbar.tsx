import React, { useContext } from "react";
import { NextRouter, useRouter } from "next/router";
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

import Logo from "./Logo";

import { page } from "@/types/Page";

import { PagePaths } from "enum/pages";
import { NavbarPages } from "enum/navbar";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";
import { grey } from "@mui/material/colors";

export default function Navbar() {
  const router: NextRouter = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const supabaseClient = useSupabaseClient<Database>();

  const userStatus = useContext(userContext);
  const handleClose = () => setAnchorEl(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const routeToHome = (): void => {
    router.push(PagePaths.home);
    return;
  };

  async function handleSignOut() {
    const signOutResult = await supabaseClient.auth.signOut();
    if (signOutResult.error) {
      console.log(signOutResult.error);
      return;
    }
    router.push(PagePaths.login);
    return;
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
            <MenuItem key={1}>
              <Link
                textAlign="center"
                color="inherit"
                underline="none"
                href={PagePaths.profile + userStatus.user?.username}
              >
                <Typography variant="body1">{NavbarPages.profile}</Typography>
              </Link>
            </MenuItem>
            <MenuItem key={2}>
              <Link textAlign="center" color="inherit" underline="none" href={PagePaths.myPosts}>
                <Typography variant="body1">{NavbarPages.myPost}</Typography>
              </Link>
            </MenuItem>
            <MenuItem key={3}>
              <Link textAlign="center" color="error" underline="none" onClick={handleSignOut}>
                <Typography variant="body1">{NavbarPages.logout}</Typography>
              </Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}
