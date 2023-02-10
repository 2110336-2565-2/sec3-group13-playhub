import { validation } from "@/types/Validation";

import { IMG_FILE_SIZE_LIMIT } from "enum/inputLimit";

const expression: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(email: string): validation {
  if (email.length === 0) {
    return { msg: "ช่องนี้ไม่สามารถเว้นว่างได้", err: true };
  }
  if (!expression.test(email)) {
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
    return { msg: "ช่องนี้ไม่สามารถเว้นว่างได้", err: true };
  }
  if (input.length > maxChar) {
    return { msg: `ช่องนี้มีตัวอักษรได้ไม่เกิน ${maxChar} ตัว`, err: true };
  }
  return { msg: "", err: false };
}

export function validatePasswordTextField(
  input: string,
  minChar: number = 0,
  maxChar: number = 2000
): validation {
  if (input.length < minChar) {
    return { msg: "ช่องนี้ต้องมีตัวอักษรอย่างน้อย 6 ตัว", err: true };
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
  if (fileSize > IMG_FILE_SIZE_LIMIT) {
    return { msg: `ขนาดไฟล์จะต้องไม่เกิน ${IMG_FILE_SIZE_LIMIT / 1_000_000} MB`, err: true };
  }
  return { msg: "", err: false };
}
