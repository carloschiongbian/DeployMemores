import {
  TextField,
  Grid,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { patientPersonalSectionSchemaValidation } from "../../../validation/manageValidation";
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
  age: dayjs().diff(dayjs().format("YYYY-MM-DD"), "year"),
  birthday: dayjs().format("YYYY-MM-DD"),
  gender: "",
};

const PersonalSection = ({ handleActiveSection }) => {
  const wizard = useContext(FormContext);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(patientPersonalSectionSchemaValidation),
    defaultValues:
      Object.keys(wizard.wizardData).length === 0
        ? formDefaultValue
        : {
            ...wizard.wizardData,
            birthday: dayjs(wizard.wizardData.birthday).format("YYYY-MM-DD"),
          },
  });

  const { inputRefForFirstname, ...inputPropsForFirstname } =
    register("firstname");
  const { inputRefForLastname, ...inputPropsForLastname } =
    register("lastname");
  const { inputRefForEmail, ...inputPropsForEmail } = register("email");
  const { inputRefForContact, ...inputPropsForContact } = register("contact");
  const { inputRefForBirthday, ...inputPropsForBirthday } =
    register("birthday");
  const { inputRefForGender, ...inputPropsForGender } = register("gender");
  const { inputRefForAge, ...inputPropsForAge } = register("age");

  const saveDataToContext = (data) => {
    wizard.setWizardData(data);
    handleActiveSection("Address Information");
  };

  return (
    <div className="bg-white p-3 rounded">
      <form encType="multipart/form-data" className="mt-3">
        <Grid container spacing={1}>
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
                  onInput={(e) => {
                    setValue(
                      "age",
                      Number(
                        dayjs().diff(
                          dayjs(e.target.value).format("YYYY-MM-DD"),
                          "year"
                        )
                      )
                    );
                  }}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={"age"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForAge}
                  {...inputPropsForAge}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Age"}
                  type="number"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.age}
                  helperText={errors?.age?.message}
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
