export const validationRules = {
  string: (value: string) => ({
    valid: typeof value === "string",
    message: "Value must be a string.",
  }),
  number: (value: string) => ({
    valid: !isNaN(Number(value)),
    message: "Value must be a number.",
  }),
  email: (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      valid: regex.test(email),
      message: "Please enter a valid email address.",
    };
  },
  minLength: (value: string, length: number) => ({
    valid: value.length >= length,
    message: `Value must be at least ${length} characters long.`,
  }),
  maxLength: (value: string, length: number) => ({
    valid: value.length <= length,
    message: `Value must be at most ${length} characters long.`,
  }),
  required: (value: string) => ({
    valid: value.trim() !== "",
    message: "This field is required.",
  }),
  phone: (phone: string) => {
    const regex = /^[0-9]{10,15}$/;
    return {
      valid: regex.test(phone),
      message: "Please enter a valid phone number.",
    };
  },
  photo: (photo: string) => ({
    valid: photo !== "",
    message: "Photo is required.",
  }),
  birthday: (birthday: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    return {
      valid: regex.test(birthday),
      message: "Please enter a valid date of birth (YYYY-MM-DD).",
    };
  },
  passwordComplexity: (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors: string[] = [];
    if (password.length < minLength)
      errors.push("Password must be at least 8 characters long.");
    if (!hasUpperCase)
      errors.push("Password must contain at least one uppercase letter.");
    if (!hasLowerCase)
      errors.push("Password must contain at least one lowercase letter.");
    if (!hasNumber) errors.push("Password must contain at least one number.");
    if (!hasSpecialChar)
      errors.push("Password must contain at least one special character.");

    return {
      valid: errors.length === 0,
      message: errors,
    };
  },
  passwordMatch: (password: string, confirmPassword: string) => ({
    valid: password === confirmPassword,
    message: "Passwords do not match.",
  }),
};
