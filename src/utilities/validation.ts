import { validation } from "@/types/Validation";
import dayjs, { Dayjs } from "dayjs";
import { CHAR_LIMIT, IMAGE_LIMIT } from "enum/INPUT_LIMIT";

const regexEmail: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(email: string): validation {
  if (email.trim().length === 0) {
    return { msg: "This field cannot be blank.", err: true };
  }
  if (!regexEmail.test(email)) {
    return { msg: "Email format is invalid.", err: true };
  }
  return { msg: "", err: false };
}

export function validatePassword(password: string): validation {
  // check contain space (starting, between, ending)
  if (password.includes(" ")) {
    return { msg: "Password cannot contain space.", err: true };
  }
  // check empty & check min char
  if (password.length < CHAR_LIMIT.MIN_PASSWORD) {
    return {
      msg: `Password must contain at least ${CHAR_LIMIT.MIN_PASSWORD} characters.`,
      err: true,
    };
  }

  return { msg: "", err: false };
}

export function validateTextField(
  input: string,
  minChar: number = 0,
  maxChar: number = 2000
): validation {
  if (input.length < minChar) {
    if (minChar == 1) {
      return { msg: "This field cannot be blank.", err: true };
    } else {
      return {
        msg: `This field must contain at least ${minChar} characters.`,
        err: true,
      };
    }
  }
  if (input.length > maxChar) {
    return { msg: `This field cannot exceed ${maxChar} characters.`, err: true };
  }
  return { msg: "", err: false };
}

export function validateImage(fileType: string, fileSize: number): validation {
  if (["image/png", "image/jpg", "image/jpeg"].indexOf(fileType) === -1) {
    return {
      msg: "File format not supported (.jpeg or .jpg or .png only)",
      err: true,
    };
  }
  if (fileSize > IMAGE_LIMIT.MAX_IMAGE_SIZE) {
    return {
      msg: `File size must not exceed ${IMAGE_LIMIT.MAX_IMAGE_SIZE / 1_000_000} MB`,
      err: true,
    };
  }
  return { msg: "", err: false };
}

export function validateDate(date: Dayjs | null): validation {
  if (date === null) return { msg: "This field cannot be blank.", err: true };
  return { msg: "", err: false };
}

export function validateDateWithInterval(
  startDate: Dayjs | null,
  endDate: Dayjs | null
): validation {
  if (startDate) {
    if (endDate) {
      if (startDate >= endDate) {
        const displayStartDate: string = dayjs(startDate).format("DD/MM/YYYY hh:mm a");
        return {
          msg: `Please select date and time after ${displayStartDate}`,
          err: true,
        };
      }
    } else {
      return {
        msg: "This field cannot be blank.",
        err: true,
      };
    }
  }
  return { msg: "", err: false };
}

export function validateNationalIDCardNumber(nationalIDCardNumber: string): validation {
  if (nationalIDCardNumber.length == 0) {
    return { msg: "This field cannot be blank.", err: true };
  }

  if (
    nationalIDCardNumber.length != CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER ||
    !RegExp(/\d{13}/).test(nationalIDCardNumber) ||
    !checkLastDigit(nationalIDCardNumber)
  ) {
    return { msg: "National ID card number format is invalid.", err: true };
  }
  return { msg: "", err: false };

  // --- Lemma Function ---
  function checkLastDigit(nationalIDCardNumber: string): boolean {
    //firstStep: find place value
    const firstStep: number = nationalIDCardNumber
      .slice(0, 12)
      .split("")
      .reduce((total, str, currentIndex) => total + (13 - currentIndex) * parseInt(str), 0);

    const secondStep: number = firstStep % 11;
    const thirdStep: number = (11 - secondStep) % 10;
    if (thirdStep !== parseInt(nationalIDCardNumber[12])) {
      return false;
    }
    return true;
  }
}

export function validateConfirmPassword(password: string, confirmPassword: string): validation {
  const passwordErr: validation = validatePassword(password);

  if (passwordErr.err) {
    return passwordErr;
  }
  if (password !== confirmPassword) {
    return {
      msg: "Password and Confirm Password must be match.",
      err: true,
    };
  }
  return { msg: "", err: false };
}

export function validateConfirmNewPassword(
  newPassword: string,
  confirmNewPassword: string
): validation {
  const newPasswordErr: validation = validatePassword(newPassword);

  if (newPasswordErr.err) {
    return newPasswordErr;
  }
  if (newPassword !== confirmNewPassword) {
    return {
      msg: "New Password and Confirm New Password must be match.",
      err: true,
    };
  }
  return { msg: "", err: false };
}
