from flask import request, session
from auth.auth import is_authenticated, is_admin
from flask.json import jsonify
from models.patients import Patients, db, ma
from models.assessments import Assessments
from models.patient_screening_details import PatientsScreeningDetails
import pymysql


def create_patient():
    data = request.get_json()

    fname = data["firstname"]
    lname = data["lastname"]
    email = data["email"]
    phone = data["contact"]
    age = data["age"]
    bday = data["bday"]
    gender = data["gender"]
    street = data["address"]
    city = data["city"]
    country = data["country"]
    zip = data["zipcode"]
    user_id = session.get("user_id")

    # Check if session exist
    if not is_authenticated(user_id):
        return jsonify({"error": "Unauthorized"}), 401

    # Check if email exist in the database
    patient_exists = Patients.query.filter(
        Patients.email == email).first()
    if patient_exists:
        return jsonify({"error": "Email already exist!"}), 409

    try:
        new_user = Patients(fname=fname, lname=lname, fullname="{} {}".format(
            fname, lname), email=email, phone=phone, age=age, bday=bday, gender=gender, street=street, city=city, country=country, zip=zip, created_by=user_id)

        db.session.add(new_user)
        db.session.commit()

    except pymysql.Error as e:
        print("could not close connection error pymysql %d: %s" %
              (e.args[0], e.args[1]))

    patients_query = db.session.query(
        *Patients.__table__.columns).select_from(Patients)
    patients_query = patients_query.outerjoin(Assessments, Patients.id == Assessments.patient_id).filter(
        Patients.created_by == user_id).order_by(Patients.id)

    patients_query_response = patients_query.all()
    patient_response_object = patient_record_schema.jsonify(
        patients_query_response)

    assessments_query = db.session.query(*Assessments.__table__.columns).select_from(
        Assessments).filter(Assessments.patient_id == Patients.id)
    assessment_response_object = patient_assessment_schema.jsonify(
        assessments_query)

    records = {'patients': patient_response_object.get_json(
    ), 'assessment': assessment_response_object.get_json()}

    return records


class PatientAssessmentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'date_taken', 'date_finished',
                  'assessor_id', 'patient_id')


patient_assessment_schema = PatientAssessmentSchema(many=True)


class PatientRecordSchema(ma.Schema):
    class Meta:
        fields = ('id', 'fname', 'lname', 'fullname', 'age', 'bday', 'phone', 'email',
                  'gender', 'city', 'country', 'street', 'zip', 'registered_date', 'created_by')


patient_record_schema = PatientRecordSchema(many=True)


class PatientScreeningDetailsSchema(ma.Schema):
    class Meta:
        fields = ('id', 'assessment_id', 'patient_notes', 'last_edited_on')


patient_screening_details_schema = PatientScreeningDetailsSchema(many=True)
