const expression: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type validation = {
  msg: string;
  err: boolean;
};

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
