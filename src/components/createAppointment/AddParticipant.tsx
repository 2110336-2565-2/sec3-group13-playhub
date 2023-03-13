import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Container,
  FormHelperText,
  Menu,
  MenuItem,
  Typography,
  Popover,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { User } from "@/types/User";
import MemberDetail from "./MemberDetail";
//impot React from "react"
import React from "react";

type props = {
  //header?: string;
  //note?: string;
  value: User[];
  // eslint-disable-next-line no-unused-vars
  handleValueChange: (tags: User[]) => void;
  //I will leave it error because when i commented code below is error.Please help me fix
  //for you to handle when value(menuItems) changed (I copy from createPost/Tags.tsx)
  menuValue: User[];
  isErr: boolean;
  errMsg: string;
};

/*const PopoverStyle = {
  borderRadius: "50px",
  pointerEvents: "none",
};*/

export default function AddParticipant(props: props) {
  //---- Menu item
  const [menuItems, setMenuItems] = useState<User[]>([]); // Keep value of who is selected
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); //anchorEl for Add participant button
  const open = Boolean(anchorEl);

  useEffect(() => {
    const userId: string[] = props.value.map((tag) => {
      return tag.userId;
    });
    setMenuItems(props.menuValue.filter((tag) => !userId.includes(tag.userId)));
  }, [props.value, props.menuValue]);

  const handleDeleteTag = (toDeleteTag: User) => () => {
    // Update displyed tags (delete)
    props.handleValueChange(props.value.filter((tag) => tag.userId !== toDeleteTag.userId));
    // Update menu item (insert)
    setMenuItems([...menuItems, toDeleteTag].sort((a, b) => (a.username > b.username ? 1 : -1)));
  };

  const handleAddTag = (toAddLabel: User) => {
    //console.log("Click UID ", toAddLabel);
    // Update displyed tags (insert)F
    props.handleValueChange([...props.value, toAddLabel]);
    // Update menu item (delete)
    setMenuItems((menuItems) =>
      menuItems.filter((menuItem) => menuItem.userId !== toAddLabel.userId)
    );
    //Close DropDown(MenuItem) also for prevent obsecure
    setHoveredMenuItem(null);
    setpopAnchorEl(null);
    // Close menu
    handleCloseMenu();
    handlePopoverClose();
  };

  // Menu handle function
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = (): void => {
    setAnchorEl(null);
  };
  //--For Dropdown(MenuItem)
  const [hoveredMenuItem, setHoveredMenuItem] = useState<User | null>(null);
  const [popanchorEl, setpopAnchorEl] = useState<null | HTMLElement>(null); //popanchorEl for MenuItem(each dropdown component)

  // Popover handle functions
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, menuItem: User) => {
    setHoveredMenuItem(menuItem);
    setpopAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setHoveredMenuItem(null);
    setpopAnchorEl(null);
  };
  const popopen = Boolean(popanchorEl);

  return (
    <>
      <Container disableGutters style={{ position: "relative", minHeight: "50vh" }}>
        {/* Selected tags */}
        {props.value.map((tag) => {
          return (
            <Chip
              key={tag.userId}
              label={
                <Typography variant="body2" color="primary">
                  {tag.username}
                </Typography>
              }
              sx={{ m: "6px 1px" }}
              variant="outlined"
              size="medium"
              deleteIcon={<CloseIcon />}
              onDelete={handleDeleteTag(tag)}
            />
          );
        })}

        {/* Add tag button component */}
        {menuItems.length > 0 && (
          <Button
            variant="outlined"
            sx={{ padding: "6px 10px" }}
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenMenu}
          >
            <Typography variant="body2" color="primary">
              ADD Participants
            </Typography>
          </Button>
        )}

        {/* Menu component */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          keepMounted
          TransitionProps={{ timeout: 0 }}
        >
          {menuItems.map((menuItem) => (
            <MenuItem
              aria-owns={popopen ? "mouse-over-popover" : undefined}
              aria-haspopup="true"
              key={menuItem.userId}
              onClick={() => handleAddTag(menuItem)}
              onMouseEnter={(e) => handlePopoverOpen(e, menuItem)}
              onMouseLeave={handlePopoverClose}
            >
              {menuItem.username}
            </MenuItem>
          ))}
        </Menu>
        {/* Popover component */}
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
          }}
          //style={PopoverStyle}
          open={popopen}
          anchorEl={popanchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          disableRestoreFocus
          PaperProps={{
            style: {
              borderRadius: "15px",
              paddingLeft: "30px",
              paddingRight: "30px",
              border: "1px solid rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {<MemberDetail value={hoveredMenuItem} />}
        </Popover>
        {props.isErr && <FormHelperText error>{props.errMsg}</FormHelperText>}
      </Container>
    </>
  );
}
