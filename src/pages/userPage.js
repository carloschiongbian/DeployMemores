import "../public/css/pages/UserPage/index.css";
import { useState, useEffect } from "react";
import countriesSelect from "../components/countriesSelect";
import dayjs from "dayjs";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import Api from "../services/api";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Divider,
  Typography,
  Snackbar,
  Alert,
  Dialog,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateClinicianSchemaValidation } from "../validation/manageValidation";

const UserPage = () => {
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState({ profile: "", img: "" });
  const [isEditable, setIsEditable] = useState(false);
  const [responseMessage, setResponseMessage] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "left",
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { open } = openSnackbar;
  const [user, setUser] = useState({
    id: "",
    profile: "",
    img: "",
    license: "",
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    birthday: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    zipcode: "",
  });
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateClinicianSchemaValidation),
    defaultValues: user,
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };
  const getUser = async () => {
    const response = await Api().get("/get-user-view", {
      params: { id: id },
    });
    setUser(response.data);
    setImagePreview({
      profile: response.data.profile,
      img: response.data.img,
    });
    reset({
      ...response.data,
      birthday: dayjs(response.data.birthday).format("YYYY-MM-DD"),
    });
  };
  const onSubmitUpdateUser = async (data) => {
    if (data.img[0] instanceof File && data.profile[0] instanceof File) {
      console.log("Upload both!");
      let formData = new FormData();
      formData.append("profile", data.profile[0]);
      formData.append("img", data.img[0]);
      for (let key in data) {
        if (key === "birthday") {
          const formatted_date = dayjs(data[key]).format("YYYY-MM-DD");
          formData.append(key, formatted_date);
        } else {
          formData.append(key, data[key]);
        }
      }
      try {
        const response = await Api().put("/update-both-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response);

        if (response.ok || response.status === 200) {
          getUser();
          setResponseMessage({
            status: "success",
            message: "Updated Successfully",
          });
          setOpenSnackbar({ open: true });
          setIsEditable(!isEditable);
        }
      } catch (error) {
        setAlertMessage(error.response.data.error);
        setIsAlertOpen(true);
        setTimeout(() => {
          setIsAlertOpen(false);
        }, 2000);
        setIsEditable(!isEditable);
      }
    } else if (data.img[0] instanceof File) {
      let formData = new FormData();
      formData.append("img", data.img[0]);
      for (let key in data) {
        if (key === "birthday") {
          const formatted_date = dayjs(data[key]).format("YYYY-MM-DD");
          formData.append(key, formatted_date);
        } else {
          formData.append(key, data[key]);
        }
      }
      try {
        const response = await Api().put("/update-user-and-license", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.ok || response.status === 200) {
          getUser();
          setResponseMessage({
            status: "success",
            message: "Updated Successfully",
          });
          setOpenSnackbar({ open: true });
          setIsEditable(!isEditable);
        }
      } catch (error) {
        setAlertMessage(error.response.data.error);
        setIsAlertOpen(true);
        setTimeout(() => {
          setIsAlertOpen(false);
        }, 2000);
        setIsEditable(!isEditable);
      }
    } else if (data.profile[0] instanceof File) {
      console.log("upload new profile file here");
      let formData = new FormData();
      formData.append("profile", data.profile[0]);
      for (let key in data) {
        if (key === "birthday") {
          const formatted_date = dayjs(data[key]).format("YYYY-MM-DD");
          formData.append(key, formatted_date);
        } else {
          formData.append(key, data[key]);
        }
      }

      try {
        const response = await Api().put("/update-user-and-photo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response);

        if (response.ok || response.status === 200) {
          getUser();
          setResponseMessage({
            status: "success",
            message: "Updated Successfully",
          });
          setOpenSnackbar({ open: true });
          setIsEditable(!isEditable);
        }
      } catch (error) {
        setAlertMessage(error.response.data.error);
        setIsAlertOpen(true);
        setTimeout(() => {
          setIsAlertOpen(false);
        }, 2000);
        setIsEditable(!isEditable);
      }
    } else {
      console.log("update bt no new image");
      try {
        const response = await Api().put("/update-user-only", data);
        console.log(response);

        if (response.ok || response.status === 200) {
          getUser();
          setResponseMessage({
            status: "success",
            message: "Updated Successfully",
          });
          setOpenSnackbar({ open: true });
          setIsEditable(!isEditable);
        }
      } catch (error) {
        setAlertMessage(error.response.data.error);
        setIsAlertOpen(true);
        setTimeout(() => {
          setIsAlertOpen(false);
        }, 2000);
        setIsEditable(!isEditable);
      }
    }
  };
  const handleDiscardChanges = () => {
    reset();
    setIsEditable(false);
    setImagePreview({ img: getValues("img"), profile: getValues("profile") });
  };
  const toEllipsis = (text, maxLength) => {
    if (text.length > maxLength) {
      let newText = text.slice(0, maxLength - 3);
      return newText + "...";
    }
    return text;
  };
  function isBase64(str) {
    var base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(str);
  }

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Layout>
      <div className="container"></div>
      {/* Sub Nav: Breadcrumbs + Buttons */}
      <nav
        aria-label="breadcrumb"
        className="py-4 border-bottom d-flex justify-content-between flex-grow-1 flex-wrap"
      >
        {/* Breadcrumb */}
        <div className="d-flex align-items-end">
          <nav aria-label="breadcrumb" className="breadcrumb-should-show">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={"/user-record"} className="text-decoration-none">
                  User Records
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {toEllipsis(`${user.firstname} ${user.lastname}` || "N/A", 20)}
              </li>
            </ol>
          </nav>
        </div>
        {/* Print and Edit Button */}
        <div className="d-flex">
          <button className="btn btn-outline-primary me-2">
            <span>
              <i className="bi bi-printer-fill"></i>
            </span>
          </button>
          {!isEditable && (
            <button
              className="btn btn-primary ms-2"
              onClick={() => setIsEditable(true)}
            >
              <span className="me-2">
                <i className="bi bi-pencil-square"></i>
              </span>
              Edit User
            </button>
          )}
          {isEditable && (
            <div>
              <button
                className="btn btn-danger ms-2"
                onClick={handleDiscardChanges}
              >
                <span>
                  <i className="bi bi-x-lg"></i> Discard
                </span>
              </button>
              <button
                className="btn btn-success ms-2"
                onClick={handleSubmit(onSubmitUpdateUser)}
              >
                <span>
                  {/* {
                        (isSubmittingPatientDetails && <span className={`spinner-border spinner-border-sm me-2`} role="status" aria-hidden="true"></span>) || <i className="bi bi-check-lg me-1"></i>
                      } */}
                  Save Changes
                </span>
              </button>
            </div>
          )}
        </div>
      </nav>
      <section className="py-4 mb-4">
        <div className="row">
          {/* Left Section */}
          <div className="col">
            {/* Image + Personal Details */}
            <div className="row bg-white rounded-4 py-2">
              <div className="col-12 col-md-4 mt-4 mt-lg-0 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center border p-1 border-primary rounded-circle bg-primary p-0">
                  <div className="position-relative">
                    <>
                      <Avatar
                        alt="user-profile"
                        src={
                          isBase64(imagePreview.profile)
                            ? "data:image/png;base64," + imagePreview.profile
                            : `http://localhost:5000/${imagePreview.profile}`
                        }
                        sx={{ width: 175, height: 175 }}
                        className="border border-dark"
                      />
                      <div
                        className={`d-flex align-items-center justify-content-center ${
                          isEditable
                            ? "upload-image-inner-container rounded-circle"
                            : ""
                        }`}
                      >
                        <div
                          className="upload-button"
                          title="Upload a new professional license..."
                        >
                          <input
                            disabled={!isEditable}
                            id="profile"
                            className="inputfile"
                            {...register("profile")}
                            accept="image/*"
                            type="file"
                            onChange={(e) => {
                              if (e.target.files) {
                                let reader = new FileReader();
                                reader.onload = (e) => {
                                  setImagePreview({
                                    ...imagePreview,
                                    profile: e.target.result.replace(
                                      /^data:image\/[a-z]+;base64,/,
                                      ""
                                    ),
                                  });
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                          />
                          {errors.profile && (
                            <span
                              className="text-danger"
                              style={{ fontSize: "12px", marginBottom: "0px" }}
                            >
                              {errors.profile.message}
                            </span>
                          )}
                          <label>
                            <i
                              className="bi bi-camera-fill text-primary"
                              height="30"
                              width="30"
                            ></i>
                          </label>
                        </div>
                      </div>
                    </>
                  </div>
                </div>
                <Typography
                  sx={{ mt: 1 }}
                  color="text.secondary"
                  display="block"
                  variant="caption"
                >
                  username
                </Typography>
                <p className="mb-0 fw-bold fs-4 text-center">{user.username}</p>
              </div>
              <div className="col-12 col-md-8 px-0">
                <form className="row mx-2 my-4">
                  <Divider component="p" className="mt-2" />
                  <p>
                    <Typography
                      sx={{ mt: 0.5 }}
                      color="text.secondary"
                      display="block"
                      variant="caption"
                    >
                      Personal Details
                    </Typography>
                  </p>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      {...register("firstname")}
                      type="text"
                      className="form-control"
                      readOnly={!isEditable}
                      required
                    />
                    {errors.firstname && (
                      <span className="text-danger">
                        {errors.firstname.message}
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      {...register("lastname")}
                      type="text"
                      className="form-control"
                      required
                      readOnly={!isEditable}
                    />
                    {errors.lastname && (
                      <span className="text-danger">
                        {errors.lastname.message}
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      type="text"
                      className={`form-control`}
                      id="email"
                      name="email"
                      readOnly={!isEditable}
                      required
                    />
                    {errors.email && (
                      <span className="text-danger">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="contact" className="form-label">
                      Contact Number
                    </label>
                    <input
                      {...register("contact")}
                      type="text"
                      className={`form-control`}
                      id="contact"
                      name="phone"
                      readOnly={!isEditable}
                      required
                    />
                    {errors.contact && (
                      <span className="text-danger">
                        {errors.contact.message}
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <select
                      {...register("gender")}
                      id="gender"
                      className={`form-select `}
                      name="gender"
                      disabled={!isEditable}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender && (
                      <span className="text-danger">
                        {errors.gender.message}
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="birthday" className="form-label">
                      Birthday
                    </label>
                    <input
                      {...register("birthday")}
                      type="date"
                      className={`form-control`}
                      id="birthday"
                      name="bday"
                      readOnly={!isEditable}
                      required
                    />
                    {errors.birthday && (
                      <span className="text-danger">
                        {errors.birthday.message}
                      </span>
                    )}
                  </div>
                  <Divider component="p" className="mt-2" />
                  <Typography
                    sx={{ mt: 0.5 }}
                    color="text.secondary"
                    display="block"
                    variant="caption"
                  >
                    Address
                  </Typography>
                  <div className="col-md-6 mb-1 my-4">
                    <label htmlFor="street" className="form-label">
                      Street
                    </label>
                    <input
                      {...register("address")}
                      type="text"
                      className={`form-control`}
                      id="street"
                      name="street"
                      readOnly={!isEditable}
                      required
                    />
                    {errors.address && (
                      <span className="text-danger">
                        {errors.address.message}
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 mb-1 my-4">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      {...register("city")}
                      type="text"
                      className={`form-control `}
                      id="city"
                      name="city"
                      readOnly={!isEditable}
                      required
                    />
                    {errors.city && (
                      <span className="text-danger">{errors.city.message}</span>
                    )}
                  </div>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <select
                      {...register("country")}
                      id="country"
                      className={`form-select`}
                      name="country"
                      disabled={!isEditable}
                      required
                    >
                      {countriesSelect.map((country) => (
                        <option key={country.value} value={country.label}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <span className="text-danger">
                        {errors.country.message}
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="zip" className="form-label">
                      Zip
                    </label>
                    <input
                      {...register("zipcode")}
                      type="text"
                      className={`form-control`}
                      id="zip"
                      name="zip"
                      readOnly={!isEditable}
                      required
                    />
                    {errors.zipcode && (
                      <span className="text-danger">
                        {errors.zipcode.message}
                      </span>
                    )}
                  </div>
                  <Divider component="p" className="mt-2" />
                  <Typography
                    sx={{ mt: 0.5 }}
                    color="text.secondary"
                    display="block"
                    variant="caption"
                  >
                    License Details
                  </Typography>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="img" className="form-label">
                      License Photo
                    </label>
                    <div className="position-relative">
                      <>
                        <img
                          style={{ objectFit: "scale-down" }}
                          src={
                            Object.keys(imagePreview).length === 0
                              ? ""
                              : "data:image/png;base64," + imagePreview.img
                          }
                          alt=""
                          className="professional-license"
                        />

                        <div
                          className={`d-flex align-items-center justify-content-center ${
                            isEditable ? "upload-image-inner-container" : ""
                          }`}
                        >
                          <div
                            className="upload-button"
                            title="Upload a new professional license..."
                          >
                            <input
                              disabled={!isEditable}
                              id="img"
                              className="inputfile"
                              {...register("img")}
                              accept="image/*"
                              type="file"
                              onChange={(e) => {
                                if (e.target.files) {
                                  let reader = new FileReader();
                                  reader.onload = (e) => {
                                    setImagePreview({
                                      ...imagePreview,
                                      img: e.target.result.replace(
                                        /^data:image\/[a-z]+;base64,/,
                                        ""
                                      ),
                                    });
                                  };
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }}
                            />
                            {errors.img && (
                              <span
                                className="text-danger"
                                style={{
                                  fontSize: "12px",
                                  marginBottom: "0px",
                                }}
                              >
                                {errors.img.message}
                              </span>
                            )}
                            <label>
                              <i
                                className="bi bi-camera-fill text-primary"
                                height="30"
                                width="30"
                              ></i>
                            </label>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                  <div className="col-md-6 mb-1">
                    <label htmlFor="city" className="form-label">
                      License Number
                    </label>
                    <input
                      {...register("license")}
                      type="text"
                      className={`form-control `}
                      id="city"
                      name="city"
                      readOnly={!isEditable}
                      required
                    />
                    {errors.license && (
                      <span className="text-danger">
                        {errors.license.message}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={responseMessage.status}
          sx={{ width: "100%" }}
        >
          {responseMessage.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "center",
            alignItems: "flex-start",
          },
        }}
        PaperProps={{
          sx: {
            verticalAlign: "top",
          },
        }}
      >
        <Alert severity="error"> {alertMessage}</Alert>
      </Dialog>
    </Layout>
  );
};

export default UserPage;
