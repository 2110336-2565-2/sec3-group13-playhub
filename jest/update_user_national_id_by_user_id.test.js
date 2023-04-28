const { describe, expect, it } = require("@jest/globals");
const {
  updateNationalID,
} = require("../supabase/functions/update_user_national_id_by_user_id/updateNationalID");

describe("test-coverage test suite", () => {
  it("no id field", async () => {
    const data = updateNationalID({ national_id: "555" });
    expect(data.message).toBe("id field is needed");
  });

  it("no national_id field", async () => {
    const data = updateNationalID({ id: "testuser" });
    expect(data.message).toBe("national_id field is needed");
  });

  it("national_id field is not a string", async () => {
    const data = updateNationalID({ id: "testuser", national_id: 123 });
    expect(data.message).toBe("national_id needs to be a string");
  });

  it("national_id length is less than 13", async () => {
    const data = updateNationalID({ id: "testuser", national_id: "123" });
    expect(data.message).toBe("national_id length needs to be 13 characters");
  });

  it("some characters are not numbers", async () => {
    const data = updateNationalID({ id: "testuser", national_id: "112b45678A45#" });
    expect(data.message).toBe("some characters are not an integer");
  });

  it("no national_id field", async () => {
    const data = updateNationalID({ id: "testuser", national_id: "1111111111131" });
    expect(data.message).toBe("last digit is not valid");
  });

  it("ok", async () => {
    const data = updateNationalID({ id: "testuser", national_id: "1509966158425" });
    expect(data.message).toBe("ok");
  });
});
