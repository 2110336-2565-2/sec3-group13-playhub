const expression: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(email: string): string | boolean {
  if (email.length === 0) {
    return "ช่องนี้ไม่สามารถเว้นว่างได้";
  }
  if (!expression.test(email)) {
    return "รูปแบบอีเมลไม่ถูกต้อง";
  }
  return "";
}

export function validateTextField(
  input: string,
  minChar: number = 0,
  maxChar: number = 2000
): string {
  if (input.length < minChar) {
    return "ช่องนี้ไม่สามารถเว้นว่างได้";
  }
  if (input.length > maxChar) {
    return `ช่องนี้มีตัวอักษรได้ไม่เกิน ${maxChar} ตัว`;
  }
  return "";
}
