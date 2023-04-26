export function updateNationalID(body: any) {
  const national_id: any = body.national_id;

  if (!body.id) {
    return {
      message: "id field is needed",
      success: false,
    };
  }

  if (!national_id) {
    return {
      message: "national_id field is needed",
      success: false,
    };
  }

  if (typeof national_id != "string") {
    return {
      message: "national_id needs to be a string",
      success: false,
    };
  }

  if (national_id.length != 13) {
    return {
      message: "national_id length needs to be 13 characters",
      success: false,
    };
  }

  if (!RegExp(/\d{13}/).test(national_id)) {
    return {
      message: "some characters are not an integer",
      success: false,
    };
  }

  const national_string: string = national_id;
  const firstStep: number = national_string
    .slice(0, 12)
    .split("")
    .reduce((total, str, currentIndex) => total + (13 - currentIndex) * parseInt(str), 0);
  const secondStep: number = firstStep % 11;
  const thirdStep: number = (11 - secondStep) % 10;

  if (thirdStep !== parseInt(national_string[12])) {
    return {
      message: "last digit is not valid",
      success: false,
    };
  }

  return {
    message: "ok",
    success: true,
  };
}
