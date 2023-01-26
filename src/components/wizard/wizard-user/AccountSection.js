import { TextField, Grid, DialogActions, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { accountSectionSchemaValidation } from "../../../validation/manageValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import FormContext from "../FormContext";

const formDefaultValue = {
  username: "",
  password: "",
  confirm: "",
};

const AccountSection = ({ handleActiveSection }) => {
  const wizard = useContext(FormContext);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountSectionSchemaValidation),
    defaultValues:
      Object.keys(wizard.wizardData).length === 0
        ? formDefaultValue
        : wizard.wizardData,
  });
  const { inputRefForUsername, ...inputPropsForUsername } =
    register("username");
  const { inputRefForPassword, ...inputPropsForPassword } =
    register("password");
  const { inputRefForConfirm, ...inputPropsForConfirm } = register("confirm");

  const saveDataToContext = (data) => {
    wizard.setWizardData((prevState) => ({ ...prevState, ...data }));
    handleActiveSection("Address Information");
  };

  return (
    <div className="bg-white p-3 rounded">
      <form encType="multipart/form-data" className="mt-3">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Controller
              name={"username"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForUsername}
                  {...inputPropsForUsername}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Username"}
                  type="input"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.username}
                  helperText={errors?.username?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name={"password"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForPassword}
                  {...inputPropsForPassword}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Password"}
                  type="password"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name={"confirm"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForConfirm}
                  {...inputPropsForConfirm}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Confirm Password"}
                  type="password"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.confirm}
                  helperText={errors?.confirm?.message}
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
      <DialogActions>
        <Button
          onClick={() => {
            handleActiveSection("Personal Information");
          }}
        >
          Previous
        </Button>
        <Button onClick={handleSubmit(saveDataToContext)}>Next</Button>
      </DialogActions>
    </div>
  );
};

export default AccountSection;
