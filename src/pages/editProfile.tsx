import { useState, useContext, useEffect } from "react";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import {
  Typography,
  Button,
  SelectChangeEvent,
  Avatar,
  Stack,
  Box,
  IconButton,
  Card,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";

import { editProfileHeader } from "public/locales/editProfileHeader";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import NormalTextField from "@/components/public/NormalTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import DescriptionTextField from "@/components/public/DescriptionTextField";
import VerifyDialog from "@/components/profile/VerifyDialog";
import { validateImage, validateTextField } from "@/utilities/validation";

import { User } from "@/types/User";
import { validation } from "@/types/Validation";
import { Gender } from "enum/gender";
import { CHAR_LIMIT } from "enum/inputLimit";
import { PagePaths } from "enum/pages";
import { Icons } from "enum/icons";

import { UpdateProfile } from "@/services/Profile";

type EditProfileInput = {
  image: string | null;
  displayName: string;
  description: string;
  gender: string;
};

const EditProfileStyle = {
  Avatar: {
    width: 200,
    height: 200,
    border: "4px black solid",
  },
  DeletePictureButton: {
    position: "absolute",
    color: "black",
    opacity: "0.5",
  },
  Card: {
    width: "50vw",
    minWidth: "300px",

    marginTop: "3vh",
    marginBottom: "3vh",

    paddingBottom: "2vh",
  },
  TextField: {
    width: "40vw",
  },
  HalfTextField: {
    width: "18vw",
  },
};

export default function Home() {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const [displayName, setDisplayName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const [isVerifyModalShow, setIsVerifyModalShow] = useState<boolean>(false);
  const [isPressSubmit, setIsPressSubmit] = useState<boolean>(false);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [isImageUpload, setIsImageUpload] = useState<boolean>(false);
  const [showImageUploadError, setShowImageUploadError] = useState({
    msg: "",
    err: false,
  });

  const displayNameErr: validation = validateTextField(
    displayName,
    CHAR_LIMIT.MIN_DISPLAY_NAME,
    CHAR_LIMIT.MAX_DISPLAY_NAME
  );
  const descriptionErr: validation = validateTextField(
    description,
    CHAR_LIMIT.MIN_DESCRIPTION,
    CHAR_LIMIT.MAX_DESCRIPTION
  );

  const getProfile = async (User: User) => {
    setDisplayName(User.username);
    setDescription(User.description);
    setGender(User.sex);
    setImage(User.image);
    setOriginalImage(User.image);
  };

  const editProfileBtnOnClick = async () => {
    if (!userStatus.user) return;
    setIsPressSubmit(true);
    const readyToSubmit: boolean = !(
      displayNameErr.err ||
      descriptionErr.err ||
      showImageUploadError.err
    );
    if (readyToSubmit) {
      UpdateProfile(displayName, gender, description, fileImage, userStatus.user, supabaseClient)
        .then(() => {
          router.push(PagePaths.profile + "/" + userStatus.user?.userId);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Something went wrong");
    }
  };

  const handleImageChange = (event: any): void => {
    const tempFile = event.target.files[0];
    setImage(URL.createObjectURL(tempFile));
    const imgErrMsg = validateImage(tempFile.type, tempFile.size);
    setShowImageUploadError(imgErrMsg);
    setIsImageUpload(true);
    if (!imgErrMsg.err) {
      setFileImage(event.target.files[0]);
    }
    event.target.value = null;
  };
  const handleCancelImageChip = (): void => {
    setIsImageUpload(false);
    setShowImageUploadError({ msg: "", err: false });
    setImage(originalImage);
    setFileImage(null);
  };

  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setDisplayName(event.target.value);
    setIsPressSubmit(false);
  };
  const handleDescChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setDescription(event.target.value);
    setIsPressSubmit(false);
  };
  const handleSelectChange = (event: SelectChangeEvent): void => {
    setGender(event.target.value as string);
  };

  function handleOpenModal(): void {
    setIsVerifyModalShow(true);
  }

  function handleCloseModal(): void {
    setIsVerifyModalShow(false);
  }

  useEffect(() => {
    if (userStatus.isLoading || !userStatus.user) return;
    getProfile(userStatus.user);
  }, [userStatus]);

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  return (
    <>
      <Navbar />
      <Stack alignItems="center">
        <Card sx={EditProfileStyle.Card}>
          <Box display="flex">
            <Box sx={{ flexGrow: 1 }}></Box>
            <IconButton onClick={handleOpenModal}>
              <CloseIcon fontSize="large" color="secondary" />
            </IconButton>
          </Box>
          <Stack
            spacing={2}
            sx={{ marginTop: "-40px" }}
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              onClick={handleCancelImageChip}
              color="secondary"
              style={{
                padding: 0,
                backgroundColor: "black",
                position: "relative",
                top: "70px",
                left: "80px",
                zIndex: "1",
              }}
            >
              <CloseIcon color={showImageUploadError.err ? "error" : "primary"} fontSize="medium" />
            </IconButton>

            <Avatar alt="Anya" sx={EditProfileStyle.Avatar}>
              {image && (
                <Image
                  src={image}
                  alt="Upload avatar"
                  width={200}
                  height={200}
                  style={!isImageUpload ? { opacity: "0.5" } : { objectFit: "cover" }}
                />
              )}
              <IconButton
                sx={EditProfileStyle.DeletePictureButton}
                aria-label="upload picture"
                component="label"
              >
                <input onChange={handleImageChange} hidden accept="image/*" type="file" />
                <CameraAltIcon sx={{ fontSize: "100px" }} />
              </IconButton>
            </Avatar>
            {showImageUploadError.err && (
              <Typography align="center" variant="body1" color="error">
                {showImageUploadError.msg}
              </Typography>
            )}

            <Box style={EditProfileStyle.TextField}>
              <NormalTextField
                header={editProfileHeader.username}
                icon={Icons.edit}
                placeholder="Display Name"
                value={displayName}
                handleValueChange={handleDisplayNameChange}
                char_limit={CHAR_LIMIT.MAX_DISPLAY_NAME}
                isErr={isPressSubmit && displayNameErr.err}
                errMsg={displayNameErr.msg}
              />

              <DescriptionTextField
                header={editProfileHeader.description}
                placeholder="Tell Us More About Yourself!"
                value={description}
                handleValueChange={handleDescChange}
                char_limit={CHAR_LIMIT.MAX_DESCRIPTION}
                isErr={isPressSubmit && descriptionErr.err}
                errMsg={descriptionErr.msg}
              />

              <Box style={EditProfileStyle.HalfTextField}>
                <CommonDropdown
                  header={editProfileHeader.gender}
                  value={gender}
                  handleValueChange={handleSelectChange}
                  items={Object.values(Gender)}
                />
              </Box>
            </Box>

            <Button variant="contained" onClick={editProfileBtnOnClick}>
              Save
            </Button>
            <Typography variant="body2" color="warning.main">
              ท่านต้องกด Save เพื่อบันทึกข้อมูลใหม่
            </Typography>
          </Stack>
        </Card>
      </Stack>
      <VerifyDialog openModal={isVerifyModalShow} handleCloseModal={handleCloseModal} />
    </>
  );
}
