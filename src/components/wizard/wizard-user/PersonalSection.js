import {
  TextField,
  Grid,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { personalSectionSchemaValidation } from "../../../validation/manageValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import FormContext from "../FormContext";

const options = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const formDefaultValue = {
  profile: "",
  img: "",
  license: "",
  firstname: "",
  lastname: "",
  email: "",
  contact: "",
  birthday: dayjs().format("YYYY-MM-DD"),
  gender: "",
};

const PersonalSection = ({
  handleActiveSection,
  imagePreview,
  handleImagePreview,
}) => {
  const wizard = useContext(FormContext);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(personalSectionSchemaValidation),
    defaultValues:
      Object.keys(wizard.wizardData).length === 0
        ? formDefaultValue
        : {
            ...wizard.wizardData,
            birthday: dayjs(wizard.wizardData.birthday).format("YYYY-MM-DD"),
          },
  });

  const { inputRefForLicenseNum, ...inputPropsForLicenseNum } =
    register("license");
  const { inputRefForFirstname, ...inputPropsForFirstname } =
    register("firstname");
  const { inputRefForLastname, ...inputPropsForLastname } =
    register("lastname");
  const { inputRefForEmail, ...inputPropsForEmail } = register("email");
  const { inputRefForContact, ...inputPropsForContact } = register("contact");
  const { inputRefForBirthday, ...inputPropsForBirthday } =
    register("birthday");
  const { inputRefForGender, ...inputPropsForGender } = register("gender");

  const saveDataToContext = (data) => {
    wizard.setWizardData(data);
    handleActiveSection("Account Information");
  };

  return (
    <div className="bg-white p-3 rounded">
      <form encType="multipart/form-data" className="mt-3">
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <label htmlFor="profile" className="form-label">
              Profile Photo
            </label>
            <div className="position-relative">
              <>
                <img
                  style={{ objectFit: "scale-down" }}
                  src={
                    Object.keys(imagePreview).length === 0
                      ? ""
                      : "data:image/png;base64," + imagePreview.profile
                  }
                  alt=""
                  className="professional-license"
                />
                <div
                  className={`d-flex align-items-center justify-content-center upload-image-inner-container`}
                >
                  <div
                    className="upload-button"
                    title="Upload a new professional license..."
                  >
                    <input
                      id="profile"
                      className="inputfile"
                      {...register("profile")}
                      accept="image/*"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          let reader = new FileReader();
                          reader.onload = (e) => {
                            handleImagePreview({
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
            {errors.profile && (
                <span
                    className="text-danger"
                    style={{ fontSize: "12px", marginBottom: "0px", marginLeft: "12px" }}
                    >
                    {errors.profile.message}
                    </span>
               )}
          </Grid>
          <Grid item xs={6}>
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
                  className={`d-flex align-items-center justify-content-center upload-image-inner-container`}
                >
                  <div
                    className="upload-button"
                    title="Upload a new professional license..."
                  >
                    <input
                      id="img"
                      className="inputfile"
                      {...register("img")}
                      accept="image/*"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          let reader = new FileReader();
                          reader.onload = (e) => {
                            handleImagePreview({
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
             {errors.img && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "12px", marginBottom: "0px", marginLeft: "12px" }}
                      >
                        {errors.img.message}
                      </span>
                    )}
          </Grid>
          <Grid item xs={12}>
            <Controller
              name={"license"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForLicenseNum}
                  {...inputPropsForLicenseNum}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"License Number/ID Number"}
                  type="input"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.license}
                  helperText={errors?.license?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={"firstname"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForFirstname}
                  {...inputPropsForFirstname}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"First name"}
                  type="input"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.firstname}
                  helperText={errors?.firstname?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={"lastname"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForLastname}
                  {...inputPropsForLastname}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Last name"}
                  type="input"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.lastname}
                  helperText={errors?.lastname?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={"email"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForEmail}
                  {...inputPropsForEmail}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Email"}
                  type="email"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={"contact"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForContact}
                  {...inputPropsForContact}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Contact"}
                  type="input"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.contact}
                  helperText={errors?.contact?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={"birthday"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForBirthday}
                  {...inputPropsForBirthday}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Birthday"}
                  type="date"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.birthday}
                  helperText={errors?.birthday?.message}
                  InputProps={{
                    inputProps: {
                      max: dayjs().toISOString().substring(0, 10),
                    },
                  }}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={"gender"}
              control={control}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  inputRef={inputRefForGender}
                  {...inputPropsForGender}
                  {...field}
                  select
                  fullWidth
                  margin="dense"
                  label="Gender"
                  defaultValue=""
                  error={!!errors.gender}
                  helperText={errors?.gender?.message}
                  size="small"
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>
      </form>
      <DialogActions>
        <Button onClick={handleSubmit(saveDataToContext)}>Next</Button>
      </DialogActions>
    </div>
  );
};

export default PersonalSection;
