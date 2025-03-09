from flask import request, jsonify, session
from flask import Blueprint
from app.models import Prescription, Diagnosis
from app import db  # Import the db object
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, UserRole
import pytesseract
from PIL import Image
import torch
from app.ai_models import DiagnosisModel
from app.ai_models import DrugInteractionModel

# Create a Blueprint
bp = Blueprint('app', __name__)
diagnosis_model = DiagnosisModel()
drug_interaction_model = DrugInteractionModel()

# Test route
@bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Test route is working!"})

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    new_user = User(
        name=data['name'],
        email=data['email'],
        role=UserRole(data['role'])
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "Registration successful"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    session['user_id'] = user.id
    
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.value
        }
    })

@bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logout successful"})

# In routes.py, update the upload_prescription function
@bp.route('/upload_prescription', methods=['POST'])
def upload_prescription():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    # Get patient_id and doctor_id from request
    patient_id = request.form.get('patient_id')
    doctor_id = request.form.get('doctor_id')
    
    if not patient_id or not doctor_id:
        return jsonify({"error": "Patient ID and Doctor ID are required"}), 400
    
    file = request.files['file']
    image = Image.open(file)
    extracted_text = pytesseract.image_to_string(image)
    
    new_prescription = Prescription(
        patient_id=patient_id,
        doctor_id=doctor_id,
        prescription_text=extracted_text
    )
    db.session.add(new_prescription)
    db.session.commit()

    return jsonify({"extracted_text": extracted_text})

# Route for AI-based diagnosis
@bp.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Check if we have symptoms
    if 'symptoms' not in data:
        return jsonify({"error": "No symptoms provided"}), 400
    
    # Get patient and doctor IDs if available
    patient_id = data.get('patient_id')
    doctor_id = data.get('doctor_id')
    
    # Get prediction from model
    prediction = diagnosis_model.predict(data['symptoms'])
    
    # If we have patient and doctor IDs, save the diagnosis
    if patient_id and doctor_id:
        new_diagnosis = Diagnosis(
            patient_id=patient_id,
            doctor_id=doctor_id,
            diagnosis_text=f"Disease: {prediction['disease']}, Confidence: {prediction['confidence']}%"
        )
        db.session.add(new_diagnosis)
        db.session.commit()
    
    return jsonify(prediction)

@bp.route('/check_interaction', methods=['POST'])
def check_interaction():
    data = request.json
    if not data or 'medications' not in data:
        return jsonify({"error": "No medications provided"}), 400
    
    medications = data['medications']
    allergies = data.get('allergies', [])
    
    # Check for drug interactions
    interaction_results = drug_interaction_model.check_interactions(medications)
    
    # Check for allergy conflicts
    allergy_results = drug_interaction_model.check_allergies(allergies, medications)
    
    return jsonify({
        "drug_interactions": interaction_results,
        "allergy_warnings": allergy_results,
        "medications_checked": medications
    })

# Route for fetching past records
@bp.route('/records', methods=['GET'])
def get_records():
    prescriptions = Prescription.query.all()
    diagnoses = Diagnosis.query.all()
    
    prescription_data = [{"id": p.id, "text": p.text} for p in prescriptions]
    diagnosis_data = [{"id": d.id, "symptoms": d.symptoms, "result": d.result} for d in diagnoses]

    return jsonify({"prescriptions": prescription_data, "diagnoses": diagnosis_data})

# Function to register routes
def register_routes(app):
    app.register_blueprint(bp)