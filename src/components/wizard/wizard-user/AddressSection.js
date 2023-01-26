import {
  TextField,
  Grid,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import SelectCountries from "../../countriesSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressSectionSchemaValidation } from "../../../validation/manageValidation";
import { useContext } from "react";
import FormContext from "../FormContext";
import Api from "../../../services/api";
import dayjs from "dayjs";

const formDefaultValue = {
  address: "",
  city: "",
  country: "",
  zipcode: "",
};

const AddressSection = ({
  handleActiveSection,
  handleData,
  handleIsCreateModalOpen,
  handleResponseMessage,
  handleOpenSnackbar,
  handleAlertMessage,
  handleIsAlertOpen,
}) => {
  const wizard = useContext(FormContext);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSectionSchemaValidation),
    defaultValues:
      Object.keys(wizard.wizardData).length === 0
        ? formDefaultValue
        : wizard.wizardData,
  });
  const { inputRefForAddress, ...inputPropsForAddress } = register("address");
  const { inputRefForCity, ...inputPropsForCity } = register("city");
  const { inputRefForCountry, ...inputPropsForCountry } = register("country");
  const { inputRefForZipCode, ...inputPropsForZipCode } = register("zipcode");

  const createUser = async (data) => {
    const userData = { ...wizard.wizardData, ...data };
    wizard.setWizardData(userData);
    console.log(userData);
    let formData = new FormData();
    formData.append("img", userData.img[0]);
    formData.append("profile", userData.profile[0]);

    for (let key in userData) {
      if (key === "birthday") {
        const formatted_date = dayjs(userData[key]).format("YYYY-MM-DD");
        formData.append(key, formatted_date);
      } else {
        formData.append(key, userData[key]);
      }
    }

    try {
      const response = await Api().post("/add-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok || response.status === 200) {
        reset();
        handleData(response.data);
        handleIsCreateModalOpen(false);
        handleResponseMessage({
          status: "success",
          message: "Created Successfully",
        });
        handleOpenSnackbar({ open: true });
      }
    } catch (error) {
      console.log(error);
      handleAlertMessage(error.response.data.error);
      handleIsAlertOpen(true);
      setTimeout(() => {
        handleIsAlertOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-white p-3 rounded">
      <form className="mt-3">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Controller
              name={"address"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForAddress}
                  {...inputPropsForAddress}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Street Address"}
                  type="input"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.address}
                  helperText={errors?.address?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name={"city"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForCity}
                  {...inputPropsForCity}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"City"}
                  type="input"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.city}
                  helperText={errors?.city?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name={"country"}
              control={control}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  inputRef={inputRefForCountry}
                  {...inputPropsForCountry}
                  {...field}
                  select
                  margin="dense"
                  fullWidth
                  label="Country"
                  defaultValue=""
                  error={!!errors.country}
                  helperText={errors?.country?.message}
                  size="small"
                >
                  {SelectCountries.map((option) => (
                    <MenuItem key={option.value} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name={"zipcode"}
              control={control}
              render={({ field }) => (
                <TextField
                  inputRef={inputRefForZipCode}
                  {...inputPropsForZipCode}
                  {...field}
                  autoFocus
                  margin="dense"
                  label={"Zip Code"}
                  type="input"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  error={!!errors.zipcode}
                  helperText={errors?.zipcode?.message}
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
      <DialogActions>
        <Button
          onClick={handleSubmit((data) => {
            wizard.setWizardData({ ...wizard.wizardData, ...data });
            handleActiveSection("Account Information");
          })}
        >
          Previous
        </Button>
        <Button onClick={handleSubmit(createUser)}>Submit</Button>
      </DialogActions>
    </div>
  );
};
export default AddressSection;
