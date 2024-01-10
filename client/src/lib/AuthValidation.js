// AuthValidation.js

export const loginValidate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Email Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  //   Password validation
  if (!values.password) {
    errors.password = "Password Required";
  }
  return errors;
};

export const registerValidate = (values) => {
  const errors = {};

  // FullName validation
  if (!values.name) {
    errors.name = "Full Name Required";
  } else if (values.name.length < 8) {
    errors.name = "Enter Your Full Name";
  }

  // Email validation
  if (!values.email) {
    errors.email = "Email Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  // Password validation
  if (!values.password) {
    errors.password = "Password Required";
  } else if (values.password.length < 8) {
    errors.password = "Password Must be greater than 8 characters long";
  } else if (!/(?=.*[a-z])/.test(values.password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/(?=.*[A-Z])/.test(values.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/(?=.*\d)/.test(values.password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/(?=.*[@$!%*?&])/.test(values.password)) {
    errors.password =
      "Password must contain at least one special character (@$!%*?&)";
  }

  // Confirm password validation
  if (!values.cpassword) {
    errors.cpassword = "Confirm Password Required";
  } else if (values.password !== values.cpassword) {
    errors.cpassword = "Password not matched";
  }

  // All fields required validation
  if (!values.name || !values.email || !values.password || !values.cpassword) {
    errors.allFields = "All fields are required";
  }

  return errors;
};

export const updateValidate = (values) => {
  const errors = {};

  // Check if the name field is not empty before applying validation
  if (values.name.trim() !== "" && values.name.length < 8) {
    errors.name = "Enter Your Full Name";
  }

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  // Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!values.newPassword) {
    errors.newPassword = "Password is required";
  } else if (!passwordRegex.test(values.newPassword)) {
    errors.newPassword =
      "Password must contain at least one uppercase letter, one lowercase letter, one special character, one number, and be at least 8 characters long";
  }

  return errors;
};
export const resetPasswordValidate = (values) => {
  const errors = {};

  // Password validation
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (!/(?=.*[a-z])/.test(values.password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/(?=.*[A-Z])/.test(values.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/(?=.*\d)/.test(values.password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/(?=.*[@$!%*?&])/.test(values.password)) {
    errors.password =
      "Password must contain at least one special character (@$!%*?&)";
  }

  // Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm Password is required";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Password and Confirm Password must match";
  }

  return errors;
};
