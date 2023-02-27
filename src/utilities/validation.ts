import { validation } from "@/types/Validation";
import dayjs, { Dayjs } from "dayjs";
import { CHAR_LIMIT, IMAGE_LIMIT } from "enum/inputLimit";

const regexEmail: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(email: string): validation {
  if (email.length === 0) {
    return { msg: "ช่องนี้ไม่สามารถเว้นว่างได้", err: true };
  }
  if (!regexEmail.test(email)) {
    return { msg: "รูปแบบอีเมลไม่ถูกต้อง", err: true };
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
      return { msg: "ช่องนี้ไม่สามารถเว้นว่างได้", err: true };
    } else {
      return {
        msg: `ช่องนี้ต้องมีตัวอักษรอย่างน้อย ${minChar} ตัว`,
        err: true,
      };
    }
  }
  if (input.length > maxChar) {
    return { msg: `ช่องนี้มีตัวอักษรได้ไม่เกิน ${maxChar} ตัว`, err: true };
  }
  return { msg: "", err: false };
}

export function validateImage(fileType: string, fileSize: number): validation {
  if (["image/png", "image/jpg", "image/jpeg"].indexOf(fileType) === -1) {
    return {
      msg: "นามสกุลไฟล์ที่อัปโหลดไม่ถูกต้อง (.jpeg หรือ .jpg หรือ .png เท่านั้น)",
      err: true,
    };
  }
  if (fileSize > IMAGE_LIMIT.MAX_IMAGE_SIZE) {
    return {
      msg: `ขนาดไฟล์จะต้องไม่เกิน ${IMAGE_LIMIT.MAX_IMAGE_SIZE / 1_000_000} MB`,
      err: true,
    };
  }
  return { msg: "", err: false };
}

export function validateDate(date: Dayjs | null): validation {
  if (date === null) return { msg: "ช่องนี้ไม่สามารถเว้นว่างได้", err: true };
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
          msg: `กรุณาเลือกวันที่และเวลา หลังจาก ${displayStartDate}`,
          err: true,
        };
      }
    } else {
      return {
        msg: "ช่องนี้ไม่สามารถเว้นว่างได้",
        err: true,
      };
    }
  }
  return { msg: "", err: false };
}

export function validateNationalIDCardNumber(nationalIDCardNumber: string): validation {
  if (nationalIDCardNumber.length == 0) {
    return { msg: "ช่องนี้ไม่สามารถเว้นว่างได้", err: true };
  }

  if (
    nationalIDCardNumber.length != CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER ||
    !RegExp(/\d{13}/).test(nationalIDCardNumber)
  ) {
    return { msg: "รูปแบบเลขบัตรประจำตัวประชาชนไม่ถูกต้อง", err: true };
  }

  if (!checkLastDigit(nationalIDCardNumber)) {
    return { msg: "รูปแบบเลขบัตรประจำตัวประชาชนไม่ถูกต้อง", err: true };
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
