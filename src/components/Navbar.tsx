import React from "react";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Image src="/images/logo.png" width={50} height={50} alt="Logo" />
          <Box sx={{ flexGrow: 1 }}></Box>
          <Button color="inherit">
            <Typography variant="body1">New Game</Typography>
          </Button>
          <IconButton onClick={handleMenu}>
            <Avatar alt="Anya" src="/images/aom.jpg" />
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
              <Link
                textAlign="center"
                color="inherit"
                underline="none"
                href="/profile"
              >
                Profile
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                textAlign="center"
                color="error"
                underline="none"
                href="/login"
              >
                Logout
              </Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}
