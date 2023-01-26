import "../public/css/pages/PatientRecord/patientRecord.scss";
import DataTable from "../components/dataTable";
import Layout from "../components/Layout";
import { useState, useEffect, useMemo } from "react";
import Api from "../services/api";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FindInPage from "@mui/icons-material/FindInPage";
import { Box, IconButton, Snackbar, Alert, Dialog } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonModal from "../components/modal/CommonModal";
import CreateUser from "../components/createUser";
import EditUser from "../components/EditUser";
import { updateAccountSchemaValidation } from "../validation/manageValidation";
import { useNavigate } from "react-router-dom";
import DeleteUserContent from "../components/DeleteUserContent";

const UserRecord = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDataForEdit, setUserDataForEdit] = useState({
    id: "",
    uname: "",
    npwd: "",
    cnpwd: "",
  });
  const [responseMessage, setResponseMessage] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "left",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const { open } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateAccountSchemaValidation),
    defaultValues: userDataForEdit,
  });

  const handleOpenView = (id) => {
    navigate("/user-details/id=" + parseInt(id));
  };
  const handleClickOpen = (id) => {
    getUserAccountById(id);
    setIsEditModalOpen(true);
  };
  const handleClose = () => {
    setIsEditModalOpen(false);
  };
  const handleClickOpenDeleteModal = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const getUserAccountById = async (id) => {
    const emptyField = { npwd: "", cnpwd: "" };
    const response = await Api().get("/get-user-account", {
      params: { id: id },
    });
    setUserDataForEdit({ ...response.data[0], ...emptyField });
    reset({ ...response.data[0], ...emptyField });
  };
  const deleteUserById = async (id) => {
    try {
      const response = await Api().put("/delete-user", { id: id });
      if (response.status === 200) {
        setData(data.filter((data) => data.id !== id));
        setIsDeleteModalOpen(false);
        setResponseMessage({
          status: "success",
          message: response.data.success,
        });
        setOpenSnackbar({ open: true });
      }
    } catch (error) {
      setAlertMessage(error.response.data.error);
      setIsAlertOpen(true);
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 2000);
    }
  };
  const onSubmitEditUser = async (data) => {
    try {
      const response = await Api().put("/update-user", data);
      if (response.status === 200) {
        reset();
        // setData(data.map(d =>d.id !== response.data[0].id ? d: response.data[0]))
        handleClose();
        setResponseMessage({
          status: "success",
          message: "Updated Successfully",
        });
        setOpenSnackbar({ open: true });
      }
    } catch (error) {
      setAlertMessage(error.response.data.error);
      setIsAlertOpen(true);
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 2000);
    }
  };
  const getUserData = async () => {
    const response = await Api().get("/get-users");
    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUserData();
  }, []);
  const columns = useMemo(
    () => [
      {
        accessorKey: "uname",
        header: "Username",
      },
      {
        accessorKey: "fname",
        header: "First name",
      },
      {
        accessorKey: "lname",
        header: "Last name",
      },
      {
        accessorKey: "role",
        header: "Role",
        Cell: ({ cell }) => {
          return <span className="badge bg-primary">{cell.getValue()}</span>;
        },
      },
      {
        accessorKey: "email",
        header: "Email Address",
      },
      {
        accessorKey: "created_at",
        header: "Created on",
        Cell: ({ cell }) => {
          return (
            <span className="badge bg-success">
              {dayjs(cell.getValue()).format("MMM DD,YYYY")}
            </span>
          );
        },
      },
      {
        accessorKey: "id",
        header: "Options",
        enableColumnActions: false,
        Cell: ({ cell }) => {
          return (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <IconButton onClick={() => handleOpenView(cell.getValue())}>
                <FindInPage style={{ color: "#8860D0" }} />
              </IconButton>
              <IconButton onClick={() => handleClickOpen(cell.getValue())}>
                <EditIcon color="warning" />
              </IconButton>
              <IconButton
                onClick={() => {
                  handleClickOpenDeleteModal(cell.getValue());
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Layout>
      <div>
        <div className="d-flex align-items-center justify-content-end mb-2 mt-5">
          <button
            className="btn btn-success"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + New User
          </button>
        </div>
        <DataTable data={data} columns={columns} loading={loading} />
        <CommonModal
          openModal={isEditModalOpen}
          textAlign={"center"}
          dialogTitle={"Update Account"}
          handleClose={() => setIsEditModalOpen(false)}
          handleSubmit={handleSubmit(onSubmitEditUser)}
          btnPrimaryTxt={"Update"}
        >
          <EditUser register={register} control={control} errors={errors} />
        </CommonModal>
        <CommonModal
          dialogTitle={"Delete Record"}
          ariaLabel={"alert-dialog-title"}
          openModal={isDeleteModalOpen}
          handleClose={() => setIsDeleteModalOpen(false)}
          btnPrimaryTxt={"Confirm"}
        >
          <DeleteUserContent
            handleDelete={() => deleteUserById(userToDelete)}
            handleClose={() => setIsDeleteModalOpen(false)}
          />
        </CommonModal>
        <CommonModal
          width={"lg"}
          dialogTitle={"Create New User"}
          openModal={isCreateModalOpen}
          textAlign={"center"}
          handleClose={() => {
            setIsCreateModalOpen(false);
          }}
          btnPrimaryTxt={"Create"}
        >
          <CreateUser
            handleData={setData}
            handleIsCreateModalOpen={setIsCreateModalOpen}
            handleResponseMessage={setResponseMessage}
            handleOpenSnackbar={setOpenSnackbar}
            handleAlertMessage={setAlertMessage}
            handleIsAlertOpen={setIsAlertOpen}
          />
        </CommonModal>
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
      </div>
    </Layout>
  );
};
export default UserRecord;
