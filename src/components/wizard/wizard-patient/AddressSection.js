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
import DeleteIcon from "@mui/icons-material/Delete";

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

  const createPatient = async (data) => {
    const patientData = { ...wizard.wizardData, ...data };
    wizard.setWizardData(patientData);
    data.bday = dayjs(data.bday).format("YYYY-MM-DD");

    try {
      const response = await Api().post("/create-patient", data);

      if (response.status === 200) {
        const updatedRecord = response.data.patients.map((data) => {
          return {
            id: data.id,
            firstName: data.fname,
            lastName: data.lname,
            age: data.age,
            is_screened: response.data.assessment.find(
              (assessment) => assessment.patient_id === data.id
            )
              ? "Yes"
              : "No",
            action: DeleteIcon,
          };
        });
        handleData(updatedRecord);
        reset();
        handleIsCreateModalOpen(false);
        handleResponseMessage({
          status: "success",
          message: "Updated Successfully",
        });
        handleOpenSnackbar({ open: true });
      }
    } catch (error) {
      handleAlertMessage(error.response.data.error);
      handleIsAlertOpen(true);
      setTimeout(() => {
        handleIsAlertOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-white p-3 roundeds">
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
            handleActiveSection("Personal Information");
          })}
        >
          Previous
        </Button>
        <Button onClick={handleSubmit(createPatient)}>Submit</Button>
      </DialogActions>
    </div>
  );
};
export default AddressSection;
