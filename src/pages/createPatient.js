import "../public/css/pages/PatientRecord/patientRecord.scss";
import { useState } from "react";
import FormContext from "../components/wizard/FormContext";

import PersonalSection from "../components/wizard/wizard-patient/PersonalSection";
import AddressSection from "../components/wizard/wizard-patient/AddressSection";

const sections = ["Personal Information", "Address Information"];

const CreatePatient = ({
  handleData,
  handleIsCreateModalOpen,
  handleResponseMessage,
  handleOpenSnackbar,
  handleAlertMessage,
  handleIsAlertOpen,
}) => {
  const [activeSection, setActiveSection] = useState("Personal Information");
  const [wizardData, setWizardData] = useState({});

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
        <PersonalSection handleActiveSection={setActiveSection} />
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
    </FormContext.Provider>
  );
};
export default CreatePatient;
