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

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import NormalTextField from "@/components/public/NormalTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import DescriptionTextField from "@/components/public/DescriptionTextField";
import VerifyDialog from "@/components/profile/VerifyDialog";
import { validateImage, validateTextField } from "@/utilities/validation";

import { User } from "@/types/User";
import { validation } from "@/types/Validation";
import { GENDER } from "enum/GENDER";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";
import { PAGE_PATHS } from "enum/PAGES";
import { ICONS } from "enum/ICONS";

import { UpdateProfile } from "@/services/Profile";

type EditProfileInput = {
  image: string | null;
  displayName: string;
  description: string;
  gender: string;
};

type EditProfileSubmit = {
  image: boolean;
  displayName: boolean;
  description: boolean;
  gender: boolean;
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

  const [input, setInput] = useState<EditProfileInput>({
    image: null,
    displayName: "",
    description: "",
    gender: "",
  });
  const [state, setState] = useState<EditProfileSubmit>({
    image: false,
    displayName: false,
    description: false,
    gender: false,
  });
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
    input.displayName,
    CHAR_LIMIT.MIN_DISPLAY_NAME,
    CHAR_LIMIT.MAX_DISPLAY_NAME
  );
  const descriptionErr: validation = validateTextField(
    input.description,
    CHAR_LIMIT.MIN_DESCRIPTION,
    CHAR_LIMIT.MAX_DESCRIPTION
  );

  const getProfile = async (User: User) => {
    setInput({
      displayName: User.username,
      description: User.description,
      gender: User.sex,
      image: User.image,
    });
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
      UpdateProfile(
        input.displayName,
        input.gender,
        input.description,
        fileImage,
        userStatus.user,
        supabaseClient
      )
        .then(() => {
          router.push(PAGE_PATHS.MY_PROFILE + "/" + userStatus.user?.userId);
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
    setInput({ ...input, image: URL.createObjectURL(tempFile) });
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
    setInput({ ...input, image: originalImage });
    setFileImage(null);
  };

  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setInput({ ...input, displayName: event.target.value });
    setIsPressSubmit(false);
  };
  const handleDescChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setInput({ ...input, description: event.target.value });
    setIsPressSubmit(false);
  };
  const handleSelectChange = (event: SelectChangeEvent): void => {
    setInput({ ...input, gender: event.target.value as string });
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
    router.push(PAGE_PATHS.LOGIN);
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
              {input.image && (
                <Image
                  src={input.image}
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
                header="Username"
                icon={ICONS.EDIT}
                placeholder="Display Name"
                value={input.displayName}
                handleValueChange={handleDisplayNameChange}
                char_limit={CHAR_LIMIT.MAX_DISPLAY_NAME}
                isErr={isPressSubmit && displayNameErr.err}
                errMsg={displayNameErr.msg}
              />

              <DescriptionTextField
                header="Description"
                placeholder="Tell Us More About Yourself!"
                value={input.description}
                handleValueChange={handleDescChange}
                char_limit={CHAR_LIMIT.MAX_DESCRIPTION}
                isErr={isPressSubmit && descriptionErr.err}
                errMsg={descriptionErr.msg}
              />

              <Box style={EditProfileStyle.HalfTextField}>
                <CommonDropdown
                  header="Gender"
                  value={input.gender}
                  handleValueChange={handleSelectChange}
                  items={Object.values(GENDER)}
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
