import { useEffect, useState } from "react";
import {
  Box,
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
import { grey } from "@mui/material/colors";
import { Tag } from "@/types/Tag";
import { User } from "@/types/User";
import MemberDetail from "./MemberDetail";
type props = {
  header?: string;
  note?: string;
  value: User[];
  handleValueChange: (tags: User[]) => void;
  menuValue: User[];
  isErr: boolean;
  errMsg: string;
};

export default function AddParticipant(props: props) {
  const [menuItems, setMenuItems] = useState<User[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [popanchorEl, setpopAnchorEl] = useState<null | HTMLElement>(null);
  let popopen = false;

  const [hoveredMenuItem, setHoveredMenuItem] = useState<User | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>, menuItem: User) => {
    setpopAnchorEl(event.currentTarget);
    setHoveredMenuItem(menuItem);
    popopen = true;
    console.log("fuck");
    console.log(popopen);
  };

  const handlePopoverClose = () => {
    setpopAnchorEl(null);
    setHoveredMenuItem(null);
    popopen = false;
    console.log(popopen);
  };

  useEffect(() => {
    const userNames: string[] = props.value.map((tag) => {
      return tag.username;
    });
    setMenuItems(props.menuValue.filter((tag) => !userNames.includes(tag.username)));
  }, []);

  const handleDeleteTag = (toDeleteTag: User) => () => {
    // Update displyed tags (delete)
    props.handleValueChange(props.value.filter((tag) => tag.username !== toDeleteTag.username));
    // Update menu item (insert)
    setMenuItems([...menuItems, toDeleteTag].sort((a, b) => (a.username > b.username ? 1 : -1)));
  };

  const handleAddTag = (toAddLabel: User) => () => {
    // Update displyed tags (insert)
    console.log(toAddLabel);
    props.handleValueChange([...props.value, toAddLabel]);
    // Update menu item (delete)
    setMenuItems((menuItems) =>
      menuItems.filter((menuItem) => menuItem.userId !== toAddLabel.userId)
    );
    // Close menu
    handleCloseMenu();
  };

  // Menu handle function
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box display="flex">
        <Typography variant="body1">
          {props.header}
          {"\u00A0"}
        </Typography>
        <Typography variant="body1" sx={{ color: grey[500] }}>
          {props.note}
        </Typography>
      </Box>
      <Container disableGutters>
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
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          {menuItems.map((menuItem) => (
            <MenuItem
              key={menuItem.userId}
              onClick={handleAddTag(menuItem)}
              onMouseLeave={handlePopoverClose}
              //onMouseEnter={(event) => handlePopoverOpen(event, menuItem)}
            >
              <button onMouseEnter={(event) => handlePopoverOpen(event, menuItem)}>
                {menuItem.username}
              </button>
              {/*menuItem.username*/}
            </MenuItem>
          ))}
        </Menu>
        <Popover
          open={popopen}
          anchorEl={popanchorEl}
          onClose={handlePopoverClose}
          anchorPosition={{ top: 100, left: 200 }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <MemberDetail value={hoveredMenuItem} />
          ควย
        </Popover>
      </Container>
      {props.isErr && <FormHelperText error>{props.errMsg}</FormHelperText>}
    </>
  );
}
