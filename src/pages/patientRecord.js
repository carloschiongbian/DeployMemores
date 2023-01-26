/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Modal, Button, Dialog, Alert, Snackbar } from "@mui/material";
import CommonModal from "../components/modal/CommonModal";
import CreatePatient from "./createPatient";

import DeleteIcon from "@mui/icons-material/Delete";
import MaterialReactTable from "material-react-table";
import FindInPageIcon from "@mui/icons-material/FindInPage";

import Layout from "../components/Layout";
import "../public/css/pages/PatientRecord/patientRecord.scss";
import "../public/css/components/PatientManagementModal/Modal.scss";

import Api from "../services/api";

const recordActions = {
  EDIT: "EDIT",
  DELETE: "DELETE",
};

const PatientRecord = () => {
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);
  const [getRecord, setGetRecord] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [patientRecords, setPatientRecords] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "left",
  });
  const { open } = openSnackbar;
  const handleCloseSnackbar = () => {
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const columns = [
    { accessorKey: "id", header: "Patient ID" },
    {
      accessorKey: "firstName",
      header: "First name",
    },
    {
      accessorKey: "lastName",
      header: "Last name",
    },
    {
      accessorKey: "age",
      header: "Age",
    },
    {
      accessorKey: "is_screened",
      header: "Screened",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      Cell: (cell) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4rem",
            }}
          >
            <FindInPageIcon
              style={{ color: "#8860D0", cursor: "pointer" }}
              onClick={() => {
                handleRecordAction(cell.row, recordActions.EDIT);
              }}
            />
            <DeleteIcon
              data-bs-toggle="modal" data-bs-target="#delete-record"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => handleRecordAction(cell.row, recordActions.DELETE)}
            />
          </Box>
        );
      },
    },
  ];

  const updatePatientRecords = (data) => {
    data.patients.forEach((patient) => {
      let patientRecord = {
        id: patient.id,
        firstName: patient.fname,
        lastName: patient.lname,
        age: patient.age,
        is_screened: data.assessment.find(
          (assessment) => assessment.patient_id === patient.id
        )
          ? "Yes"
          : "No",
        action: DeleteIcon,
      };
      setPatientRecords((patientRecords) => [...patientRecords, patientRecord]);
    });
  };

  const retrieveRecords = async () => {
    const response = await Api().get("/patient-records");
    if (response.status === 200) {
      updatePatientRecords(response.data);
    }
  };

  const handleRecordAction = (data, action) => {
    switch (action) {
      case recordActions.EDIT:
        navigate("/patient-details/id=" + parseInt(data.original.id));
        break;

      case recordActions.DELETE:
        setOpenModal(true);
        setGetRecord(data);
        break;

      default:
        break;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const response = await Api().delete(
      "/patient-records/delete/id=" + +parseInt(getRecord.original.id)
    );


    if (response.status === 200) {
      const newArr = patientRecords.filter(
        (record) => record.id !== getRecord.original.id
      );
      setPatientRecords(newArr);
      setOpenModal(false);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    retrieveRecords();
  }, []);

  return (
    <Layout>
      <div>
        <div className="d-flex align-items-center justify-content-end mb-100 mt-5" style={{marginBottom: '70px'}} />
        <MaterialReactTable
          columns={columns}
          data={patientRecords}
          enableDensityToggle={false}
          renderTopToolbarCustomActions={() => (
            <button
              className="btn btn-success"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + New Patient
            </button>
          )}
        />

        <Modal
          open={openModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="modal-container-delete-modal">
            <div className="modal-header-delete-modal bg-primary">
              <h3>Delete Record</h3>
            </div>

            <div className="modal-content-delete-modal">
              <h4>
                Once you delete this record, it cannot be recovered. Would you
                like to proceed?
              </h4>
            </div>

            <div className="modal-actions">
              <Button
                size="large"
                variant="contained"
                disabled={isDeleting}
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="large"
                color="warning"
                variant="contained"
                disabled={isDeleting}
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
      <CommonModal
        dialogTitle={"Create New Patient"}
        width={"lg"}
        openModal={isCreateModalOpen}
        handleClose={() => {
          setIsCreateModalOpen(false);
        }}
        btnPrimaryTxt={"Create"}
      >
        <CreatePatient
          handleData={setPatientRecords}
          handleIsCreateModalOpen={setIsCreateModalOpen}
          handleResponseMessage={setResponseMessage}
          handleOpenSnackbar={setOpenSnackbar}
          handleAlertMessage={setAlertMessage}
          handleIsAlertOpen={setIsAlertOpen}
        />
      </CommonModal>
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
    </Layout>
  );
};

export default PatientRecord;
