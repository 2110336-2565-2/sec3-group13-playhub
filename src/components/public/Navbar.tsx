import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Button,
  Typography,
} from "@mui/material";
import Logo from "./Logo";
import { User } from "@/types/User";
import { useRouter } from "next/router";
import { PagePaths } from "enum/pages";

import { page } from "@/types/Page";
import { NavbarPages } from "enum/navbar";

// mocked user information
const tmpUser: User = {
  name: "Chanathip sombuthong",
  sex: "Male",
  birthdate: "26/4/2002",
  description: "ชอบเล่นแนวบลัฟครับ หรือจะไปเล่นห้องผมก็ได้นะ",
  image: "/images/aom.jpg",
  email: "aom@gmail.com",
};

const menuItems: page[] = [
  {
    name: NavbarPages.profile,
    path: PagePaths.profile,
  },
  {
    name: NavbarPages.myPost,
    path: PagePaths.post,
  },
  {
    name: NavbarPages.logout,
    path: PagePaths.login,
  },
];

export default function Navbar() {
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
            <Avatar alt="Profile picture" src={tmpUser.image} />
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
                  color={item.name === NavbarPages.logout ? "error" : "inherit"}
                  underline="none"
                  href={item.path}
                >
                  <Typography variant="body1">{item.name}</Typography>
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}
