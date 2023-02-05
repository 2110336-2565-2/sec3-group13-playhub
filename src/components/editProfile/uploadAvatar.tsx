import { Avatar } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import Image from "next/image";

type props = {
  src: string;
};

export default function UploadAvatar(props: props) {
  const avatar = { width: 200, height: 200 };
  const overlayIcon = {
    position: "absolute",
    color: "black",
    fontSize: "7.5vw",
    opacity: "0.5",
  };
  return (
    <Avatar alt="Anya" sx={avatar}>
      <Image
        src={props.src}
        alt="Upload avatar"
        width={200}
        height={200}
        style={{
          position: "relative",
          opacity: "0.5",
        }}
      />
      <CameraAltIcon sx={overlayIcon} />
    </Avatar>
  );
}
