import * as yup from "yup";

export const personalSectionSchemaValidation = yup.object({
  profile: yup
    .mixed()
    .test("required", "profile photo is required", (file) =>
      file.length ? true : false
    )
    .test("fileSize", "The file is too large", (file) => {
      if (file.length) {
        return file[0].size > 16777215 ? false : true;
      }
    })
    .nullable(),
  img: yup
    .mixed()
    .test("required", "license photo is required", (file) =>
      file.length ? true : false
    )
    .test("fileSize", "The file is too large", (file) => {
      if (file.length) {
        return file[0].size > 16777215 ? false : true;
      }
    })
    .nullable(),
  license: yup.string().required(),
  firstname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  lastname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  email: yup.string().email().required(),
  contact: yup
    .string()
    .matches("^[0-9]*$", {
      message: "number only",
      excludeEmptyString: true,
    })
    .test("len", "Must be exactly 11 digits", (val) => val.length === 11)
    .required(),
  birthday: yup.date().required(),
  gender: yup.string().required(),
});

export const accountSectionSchemaValidation = yup.object({
  username: yup.string().required(),
  password: yup.string().min(4).max(12).required(),
  confirm: yup
    .string()
    .min(4)
    .max(12)
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required(),
});

export const addressSectionSchemaValidation = yup.object({
  address: yup.string().required(),
  city: yup.string().required(),
  country: yup.string().required(),
  zipcode: yup.string().required(),
});

export const createUserSchemaValidation = yup.object({
  profile: yup
    .mixed()
    .test("required", "profile photo is required", (file) =>
      file.length ? true : false
    )
    .test("fileSize", "The file is too large", (file) => {
      if (file.length) {
        return file[0].size > 16777215 ? false : true;
      }
    })
    .nullable(),
  img: yup
    .mixed()
    .test("required", "license photo is required", (file) =>
      file.length ? true : false
    )
    .test("fileSize", "The file is too large", (file) => {
      if (file.length) {
        return file[0].size > 16777215 ? false : true;
      }
    })
    .nullable(),
  license: yup.string().required(),
  firstname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  lastname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  email: yup.string().email().required(),
  contact: yup
    .string()
    .matches("^[0-9]*$", {
      message: "number only",
      excludeEmptyString: true,
    })
    .test("len", "Must be exactly 11 digits", (val) => val.length === 11)
    .required(),
  birthday: yup.date().required(),
  gender: yup.string().required(),
});

export const updateAccountSchemaValidation = yup.object({
  id: yup.number().required(),
  uname: yup.string().required(),
  npwd: yup.string(),
  cnpwd: yup.string().oneOf([yup.ref("npwd")], "Passwords do not match"),
});

export const updateClinicianSchemaValidation = yup.object({
  id: yup.number().required(),
  profile: yup
    .mixed()
    .test("required", "profile photo is required", (file) =>
      file.length ? true : false
    )
    .test("fileSize", "The file is too large", (file) => {
      if (file.length) {
        return file[0].size > 16777215 ? false : true;
      }
    })
    .nullable(),
  img: yup
    .mixed()
    .test("required", "license photo is required", (file) =>
      file.length ? true : false
    )
    .test("fileSize", "The file is too large", (file) => {
      if (file.length) {
        return file[0].size > 16777215 ? false : true;
      }
    })
    .nullable(),
  license: yup.string().required(),
  firstname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  lastname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  email: yup.string().email().required(),
  contact: yup
    .string()
    .matches("^[0-9]*$", {
      message: "number only",
      excludeEmptyString: true,
    })
    .test("len", "Must be exactly 11 digits", (val) => val.length === 11)
    .required(),
  birthday: yup.date().required(),
  gender: yup.string().required(),
  address: yup.string().required(),
  city: yup.string().required(),
  country: yup.string().required(),
  zipcode: yup.string().required(),
});

export const createPatientSchemaValidation = yup.object({
  fname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  lname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches("^[0-9]*$", {
      message: "number only",
      excludeEmptyString: true,
    })
    .test("len", "Must be exactly 11 digits", (val) => val.length === 11)
    .required(),
  age: yup.number().min(1).max(100).required(),
  bday: yup.date().required(),
  gender: yup.string().required(),
  street: yup.string().required(),
  city: yup.string().required(),
  country: yup.string().required(),
  zip: yup.string().required(),
});

export const patientPersonalSectionSchemaValidation = yup.object({
  firstname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  lastname: yup
    .string()
    .min(2)
    .max(25)
    .matches("^[A-Za-z ]*$", {
      message: "Special characters is not allowed",
      excludeEmptyString: true,
    })
    .required(),
  email: yup.string().email().required(),
  contact: yup
    .string()
    .matches("^[0-9]*$", {
      message: "number only",
      excludeEmptyString: true,
    })
    .test("len", "Must be exactly 11 digits", (val) => val.length === 11)
    .required(),
  age: yup.number().min(1).max(100).required(),
  gender: yup.string().required(),
  birthday: yup.date().required(),
});
