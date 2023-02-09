from flask import session, request, jsonify
from models.patients import Patients
from connection.connection import db
from pymysql import Error

def update_patient_details():

    user_id = session.get("user_id")
    # Check if session exist
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    patient_details = request.get_json()
    id = patient_details['id']
    email = patient_details['email']
    created_by = patient_details['created_by']
    
    # Check if the patient is created by the current user
    patient = Patients.query.filter(Patients.id == id, Patients.created_by == created_by).first()
    if patient is None:
        return jsonify({"error": "Unauthorized"}), 401

    # Check if the email already exists, and the email to be updated is on a different account
    is_exist = Patients.query.filter(Patients.email == email).first()
    if is_exist is not None and id != is_exist.id:
        return jsonify({"error": "Cannot Perform Action. Email already exists!"}), 409

    try:
        # Do not include the id (primary key) when updating
        # otherwise db Integrity Error is thrown
        patient_details.pop('id', None)
        Patients.query.filter(Patients.id == id).update(patient_details)
        db.session.commit()

        patient_details['id'] = id
        return patient_details, 200

    except Error as e:
        print('Error updating a patient details...', e)

        return jsonify({
            "error": "There is an error updating the patient details."
        }), 500

    