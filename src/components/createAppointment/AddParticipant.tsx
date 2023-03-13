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
import React from "react";

type props = {
  value: User[];
  // eslint-disable-next-line no-unused-vars
  handleValueChange: (tags: User[]) => void;
  menuValue: User[];
  isErr: boolean;
  errMsg: string;
};

export default function AddParticipant(props: props) {
  const [menuItems, setMenuItems] = useState<User[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const userId: string[] = props.value.map((tag) => {
      return tag.userId;
    });
    setMenuItems(props.menuValue.filter((tag) => !userId.includes(tag.userId)));
  }, [props.value, props.menuValue]);

  const handleDeleteTag = (toDeleteTag: User) => () => {
    props.handleValueChange(props.value.filter((tag) => tag.userId !== toDeleteTag.userId));
    setMenuItems([...menuItems, toDeleteTag].sort((a, b) => (a.username > b.username ? 1 : -1)));
  };

  const handleAddTag = (toAddLabel: User) => {
    props.handleValueChange([...props.value, toAddLabel]);
    setMenuItems((menuItems) =>
      menuItems.filter((menuItem) => menuItem.userId !== toAddLabel.userId)
    );
    setHoveredMenuItem(null);
    setpopAnchorEl(null);
    handleCloseMenu();
    handlePopoverClose();
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = (): void => {
    setAnchorEl(null);
  };

  const [hoveredMenuItem, setHoveredMenuItem] = useState<User | null>(null);
  const [popanchorEl, setpopAnchorEl] = useState<null | HTMLElement>(null);

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
          open={popopen}
          transitionDuration={0}
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
