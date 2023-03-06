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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";
import { Tag } from "@/types/Tag";
import { TAG_LIMIT } from "enum/INPUT_LIMIT";

type props = {
  header?: string;
  note?: string;
  value: Tag[];
  handleValueChange: (tags: Tag[]) => void;
  menuValue: Tag[];
  isErr: boolean;
  errMsg: string;
};

export default function Tags(props: props) {
  const [menuItems, setMenuItems] = useState<Tag[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const tagNames: string[] = props.value.map((tag) => {
      return tag.name;
    });
    setMenuItems(props.menuValue.filter((tag) => !tagNames.includes(tag.name)));
  }, []);

  const handleDeleteTag = (toDeleteTag: Tag) => () => {
    // Update displyed tags (delete)
    props.handleValueChange(props.value.filter((tag) => tag.name !== toDeleteTag.name));
    // Update menu item (insert)
    setMenuItems([...menuItems, toDeleteTag].sort((a, b) => (a.id > b.id ? 1 : -1)));
  };

  const handleAddTag = (toAddLabel: Tag) => () => {
    // Update displyed tags (insert)
    props.handleValueChange([...props.value, toAddLabel]);
    // Update menu item (delete)
    setMenuItems((menuItems) => menuItems.filter((menuItem) => menuItem.id !== toAddLabel.id));
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
              key={tag.id}
              label={
                <Typography variant="body2" color="primary">
                  {tag.name}
                </Typography>
              }
              sx={{ m: "6px 1px" }}
              variant="outlined"
              size="small"
              deleteIcon={<CloseIcon />}
              onDelete={handleDeleteTag(tag)}
            />
          );
        })}

        {/* Add tag button component */}
        {menuItems.length > 0 && props.value.length < TAG_LIMIT.MAX_TAG && (
          <Button
            sx={{ padding: "6px 10px" }}
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenMenu}
          >
            <Typography variant="body2" color="primary">
              ADD TAG
            </Typography>
          </Button>
        )}

        {/* Menu component */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          {menuItems.map((menuItem) => (
            <MenuItem key={menuItem.id} onClick={handleAddTag(menuItem)}>
              {menuItem.name}
            </MenuItem>
          ))}
        </Menu>
      </Container>
      {props.isErr && <FormHelperText error>{props.errMsg}</FormHelperText>}
    </>
  );
}
