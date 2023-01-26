import { Button } from "@mui/material";

const DeleteUserContent = ({ handleDelete, handleClose }) => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center text-center p-3">
        <div className="modal-content-delete-modal">
          <h4>
            Once you delete this record, it cannot be recovered. Would you like
            to proceed?
          </h4>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center p-3">
        <Button
          style={{ marginRight: 20 }}
          size="large"
          variant="contained"
          onClick={() => {
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="large"
          color="warning"
          variant="contained"
          onClick={() => {
            handleDelete();
          }}
        >
          Delete
        </Button>
      </div>
    </>
  );
};

export default DeleteUserContent;
