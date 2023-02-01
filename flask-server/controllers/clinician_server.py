import pymysql.cursors
import time
from connection.connection import db, ma
from flask import Flask, jsonify, request, session

from models.patients import Patients
from models.assessments import Assessments
from controllers.get_current_user import *
from models.patient_screening_details import PatientsScreeningDetails
from auth.auth import is_authenticated

from sqlalchemy import create_engine
from sqlalchemy import delete, update

engine = create_engine("mysql://root:5CamgC3qCLDlOAKTnBQh@containers-us-west-69.railway.app:7669/railway")
connect = engine.connect()

app = Flask(__name__)

connection = pymysql.connect(
    host='containers-us-west-69.railway.app',
    user='root',
    password='5CamgC3qCLDlOAKTnBQh',
    database='railway',
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor
)


def retrieveData():
    user_id = session.get("user_id")

    # Check if session exist
    if not is_authenticated(user_id):
        return jsonify({"error": "Unauthorized"}), 401

    patients_query = db.session.query(
        *Patients.__table__.columns).select_from(Patients)
    patients_query = patients_query.outerjoin(Assessments, Patients.id == Assessments.patient_id).filter(
        Patients.created_by == user_id).order_by(Patients.id)

    patients_query_response = patients_query.all()
    patient_response_object = patient_record_schema.jsonify(
        patients_query_response)

    screening_details_query = db.session.query(*PatientsScreeningDetails.__table__.columns).select_from(PatientsScreeningDetails)
    screening_details_response = patient_screening_details_schema.jsonify(screening_details_query)

    assessments_query = db.session.query(*Assessments.__table__.columns).select_from(
        Assessments).filter(Assessments.patient_id == Patients.id)
    assessment_response_object = patient_assessment_schema.jsonify(
        assessments_query)

    records = {'patients': patient_response_object.get_json(
    ), 'assessment': assessment_response_object.get_json(), 'screening_details': screening_details_response.get_json()}
    return records

def deletePatientRecord(id):

    user_id = session.get("user_id")

    # Check if session exist
    if not is_authenticated(user_id):
        return jsonify({"error": "Unauthorized"}), 401

    delete_patients_query = delete(Patients).where(Patients.id == id)
    delete_assessment_query = delete(
        Assessments).where(Assessments.patient_id == id)
    delete_screening_details_query = delete(
        PatientsScreeningDetails).where(PatientsScreeningDetails.id == id)

    # Delete data first from tables that reference a field from the parent table
    # Children tables that reference patient_id field
    connect.execute(delete_screening_details_query)
    connect.execute(delete_assessment_query)

    # Parent table
    connect.execute(delete_patients_query)

    return retrieveData()

def retrieveDashboardContent():
    user_id = session.get("user_id")

    # Check if session exist
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # All patients
    patients_query = db.session.query(
        *Patients.__table__.columns).select_from(Patients)
    patients_query = patients_query.outerjoin(Assessments, Patients.id == Assessments.patient_id).filter(
        Patients.created_by == user_id).order_by(Patients.id)
    patient_response_object = patient_record_schema.jsonify(patients_query)

    # Screened Patients
    screened_patients_query = db.session.query(*Patients.__table__.columns).select_from(Patients).filter(
        Assessments.patient_id == Patients.id).filter(Patients.created_by == user_id).order_by(Patients.id)
    screened_patients_response_object = patient_record_schema.jsonify(
        screened_patients_query)

    # Non-Screened Patients
    non_screened_patients_query = db.session.query(*Patients.__table__.columns).select_from(Patients).filter(
        Assessments.patient_id != Patients.id).filter(Patients.created_by == user_id).order_by(Patients.id)
    non_screened_patients_response_object = patient_record_schema.jsonify(
        non_screened_patients_query)

    # Patient Screening Details
    screening_query = db.session.query(
        *PatientsScreeningDetails.__table__.columns).select_from(PatientsScreeningDetails)
    screening_query = screening_query.outerjoin(
        Assessments, PatientsScreeningDetails.id == Assessments.patient_id).filter(Assessments.assessor_id == user_id)
    screening_response_object = patient_screening_details_schema.jsonify(
        screening_query)

    # Assessment Data
    assessments_query = db.session.query(*Assessments.__table__.columns).select_from(Assessments).filter(
        Assessments.patient_id == Patients.id).filter(Patients.created_by == user_id).order_by(Assessments.date_finished.desc())
    assessment_response_object = patient_assessment_schema.jsonify(
        assessments_query)

    records = {
        'patients': patient_response_object.get_json(),
        'screened_patients': screened_patients_response_object.get_json(),
        'non_screened_patients': non_screened_patients_response_object.get_json(),
        'screening_details': screening_response_object.get_json(),
        'assessments': assessment_response_object.get_json()
    }

    return records


class PatientAssessmentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'date_taken', 'date_finished',
                  'assessor_id', 'patient_id', 'result_description')


patient_assessment_schema = PatientAssessmentSchema(many=True)


class PatientScreeningDetailsSchema(ma.Schema):
    class Meta:
        fields = ('id', 'assessment_id', 'patient_notes', 'last_edited_on')


patient_screening_details_schema = PatientScreeningDetailsSchema(many=True)


class PatientRecordSchema(ma.Schema):
    class Meta:
        fields = ('id', 'fname', 'lname', 'fullname', 'age', 'bday', 'phone', 'email',
                  'gender', 'city', 'country', 'street', 'zip', 'registered_date', 'date_taken', 'date_finished', 'created_by')


patient_record_schema = PatientRecordSchema(many=True)
