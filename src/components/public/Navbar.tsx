import React from "react";
import { useRouter } from "next/router";
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

import { User } from "@/types/User";
import { page } from "@/types/Page";

import { PagePaths } from "enum/pages";
import { NavbarPages } from "enum/navbar";

import { SessionContext } from "@supabase/auth-helpers-react";

const menuItems: page[] = [
  {
    name: NavbarPages.profile,
    path: PagePaths.profile,
  },
  {
    name: NavbarPages.myPost,
    path: PagePaths.post,
  },
];

type props = {
  user: User;
  session: SessionContext;
};

export default function Navbar(props: props) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  function routeToHome(): void {
    router.push(PagePaths.home);
    return;
  }

  async function handleSignOut() {
    const signOutResult = await props.session.supabaseClient.auth.signOut();
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
            <Logo width={50} height={50} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton color="inherit" disableRipple onClick={routeToHome}>
              <Typography variant="body1">{NavbarPages.home}</Typography>
            </IconButton>
          </Box>
          <IconButton onClick={handleMenu}>
            <Avatar alt="Profile picture" src={props.user.image} />
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
            {menuItems.map((item: page, idx: number) => (
              <MenuItem key={idx}>
                <Link
                  textAlign="center"
                  color="inherit"
                  underline="none"
                  href={item.path + "/" + props.user.username}
                >
                  <Typography variant="body1">{item.name}</Typography>
                </Link>
              </MenuItem>
            ))}
            <MenuItem>
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
