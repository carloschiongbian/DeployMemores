import "../public/css/pages/PatientRecord/patientRecord.scss";
import { useState } from "react";
import FormContext from "./wizard/FormContext";

import PersonalSection from "./wizard/wizard-user/PersonalSection";
import AccountSection from "./wizard/wizard-user/AccountSection";
import AddressSection from "./wizard/wizard-user/AddressSection";

const sections = [
  "Personal Information",
  "Account Information",
  "Address Information",
];

const CreateUser = ({
  handleData,
  handleIsCreateModalOpen,
  handleResponseMessage,
  handleOpenSnackbar,
  handleAlertMessage,
  handleIsAlertOpen,
}) => {
  const [activeSection, setActiveSection] = useState("Personal Information");
  const [wizardData, setWizardData] = useState({});
  const [imagePreview, setImagePreview] = useState({});

  return (
    <FormContext.Provider value={{ wizardData, setWizardData }}>
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs">
          {sections.map((data, index) => {
            return (
              <li className="nav-item flex-grow-1" key={index}>
                <button
                  className={`nav-link w-100 ${
                    data === activeSection ? "active" : ""
                  }`}
                >
                  <div className="row">
                    <div className="col-3 d-flex px-1 justify-content-center align-items-center position-relative">
                      <span
                        className={`badge fs-5 ${
                          data === activeSection
                            ? "bg-primary"
                            : "bg-outline-primary"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-9 text-start">
                      <p
                        className={`fs-6 mb-0 fw-bold ${
                          data === activeSection ? "text-primary" : ""
                        }`}
                      >
                        Section
                      </p>
                      <p
                        className={`fs-7 mb-0 ${
                          data === activeSection
                            ? "fw-bold text-secondary"
                            : "text-dark"
                        }`}
                      >
                        {data}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {activeSection === "Personal Information" && (
        <PersonalSection
          handleActiveSection={setActiveSection}
          imagePreview={imagePreview}
          handleImagePreview={setImagePreview}
          purpose="create-user"
        />
      )}

      {activeSection === "Account Information" && (
        <AccountSection handleActiveSection={setActiveSection} />
      )}

      {activeSection === "Address Information" && (
        <AddressSection
          handleActiveSection={setActiveSection}
          handleData={handleData}
          handleIsCreateModalOpen={handleIsCreateModalOpen}
          handleResponseMessage={handleResponseMessage}
          handleOpenSnackbar={handleOpenSnackbar}
          handleAlertMessage={handleAlertMessage}
          handleIsAlertOpen={handleIsAlertOpen}
        />
      )}
      {/* 
      <DialogActions className="pt-3 pb-3">
        {(activeSection === "Account Information" ||
          activeSection === "Address Information") && (
          <Button
            onClick={() => {
              if (activeSection === "Account Information") {
                setActiveSection("Personal Information");
              }
              if (activeSection === "Address Information") {
                setActiveSection("Account Information");
              }
            }}
          >
            Previous
          </Button>
        )}

        {(activeSection === "Personal Information" ||
          activeSection === "Account Information") && (
          <Button onClick={() => {}}>Next</Button>
        )}

        {activeSection === "Address Information" && (
          <Button onClick={() => {}}>Submit</Button>
        )}
      </DialogActions> */}
    </FormContext.Provider>
  );
};

export default CreateUser;
