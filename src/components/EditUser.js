import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const EditUser = ({ register, control, errors }) => {
  const { inputRefForId, ...inputPropsForId } = register("id");
  const { inputRefForUserName, ...inputPropsForUserName } = register("uname");
  const { inputRefForPassword, ...inputPropsForPassword } = register("npwd");
  const { inputRefForConfirm, ...inputPropsForConFirm } = register("cnpwd");

  return (
    <div className="bg-white p-3 rounded">
      <form className="mt-3">
        <Controller
          name={"id"}
          control={control}
          render={({ field }) => (
            <TextField
              hidden
              inputRef={inputRefForId}
              {...inputPropsForId}
              {...field}
              autoFocus
              margin="dense"
              label={"Id"}
              type="number"
              fullWidth
              variant="outlined"
              autoComplete="off"
              error={!!errors.id}
              helperText={errors?.id?.message}
              size="small"
            />
          )}
        />
        <Controller
          name={"uname"}
          control={control}
          render={({ field }) => (
            <TextField
              inputRef={inputRefForUserName}
              {...inputPropsForUserName}
              {...field}
              autoFocus
              margin="dense"
              label={"Username"}
              type="input"
              fullWidth
              variant="outlined"
              autoComplete="off"
              error={!!errors.uname}
              helperText={errors?.uname?.message}
              size="small"
            />
          )}
        />
        <Controller
          name={"npwd"}
          control={control}
          render={({ field }) => (
            <TextField
              inputRef={inputRefForPassword}
              {...inputPropsForPassword}
              {...field}
              autoFocus
              margin="dense"
              label={"New Password"}
              type="password"
              fullWidth
              variant="outlined"
              error={!!errors.npwd}
              helperText={errors?.npwd?.message}
              autoComplete="new-password"
              size="small"
            />
          )}
        />
        <Controller
          name={"cnpwd"}
          control={control}
          render={({ field }) => (
            <TextField
              inputRef={inputRefForConfirm}
              {...inputPropsForConFirm}
              {...field}
              autoFocus
              margin="dense"
              label={"Confirm New Password"}
              type="password"
              fullWidth
              variant="outlined"
              error={!!errors.cnpwd}
              helperText={errors?.cnpwd?.message}
              autoComplete="new-password"
              size="small"
            />
          )}
        />
      </form>
    </div>
  );
};

export default EditUser;
