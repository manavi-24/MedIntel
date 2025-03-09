# Create a new file in app/ai_models.py
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

class DiagnosisModel:
    def __init__(self):
        self.model = None
        self.symptoms = [
            'fever', 'cough', 'fatigue', 'shortness_of_breath', 'headache',
            'sore_throat', 'body_ache', 'nausea', 'diarrhea', 'loss_of_taste'
        ]
        self.diseases = [
            'Common Cold', 'Influenza', 'COVID-19', 'Bronchitis',
            'Pneumonia', 'Gastroenteritis', 'Migraine', 'Allergic Rhinitis'
        ]
        
        # Create a model directory if it doesn't exist
        if not os.path.exists('models'):
            os.makedirs('models')
            
        # Train or load the model
        self.load_or_train_model()
    
    def train_model(self):
        # Simplified training data (symptom vectors -> disease)
        # In a real system, this would use actual patient data
        X_train = np.array([
            [1, 1, 1, 0, 1, 1, 0, 0, 0, 0],  # Common Cold
            [1, 1, 1, 0, 1, 1, 1, 0, 0, 0],  # Influenza
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],  # COVID-19
            [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],  # Bronchitis
            [1, 1, 1, 1, 0, 0, 1, 0, 0, 0],  # Pneumonia
            [1, 0, 1, 0, 0, 0, 0, 1, 1, 0],  # Gastroenteritis
            [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],  # Migraine
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]   # Allergic Rhinitis
        ])
        y_train = np.array(range(len(self.diseases)))
        
        # Train a RandomForest classifier
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Save the model
        with open('models/diagnostic_model.pkl', 'wb') as f:
            pickle.dump(self.model, f)
    
    def load_or_train_model(self):
        try:
            with open('models/diagnostic_model.pkl', 'rb') as f:
                self.model = pickle.load(f)
        except (FileNotFoundError, EOFError):
            self.train_model()
    
    def predict(self, symptoms_dict):
        # Convert symptoms dictionary to feature vector
        features = np.zeros(len(self.symptoms))
        for i, symptom in enumerate(self.symptoms):
            if symptom in symptoms_dict and symptoms_dict[symptom]:
                features[i] = 1
        
        # Make prediction
        prediction = self.model.predict([features])[0]
        disease = self.diseases[prediction]
        
        # Calculate confidence score (simplified)
        probabilities = self.model.predict_proba([features])[0]
        confidence = round(probabilities[prediction] * 100, 2)
        
        return {
            "disease": disease,
            "confidence": confidence,
            "symptoms_detected": [symptom for i, symptom in enumerate(self.symptoms) if features[i] == 1]
        }

class DrugInteractionModel:
    def __init__(self):
        # A simple dictionary to simulate drug interactions
        # In a real system, this would come from a comprehensive database
        self.interactions = {
            ('aspirin', 'warfarin'): 'High risk of bleeding. Avoid combination.',
            ('lisinopril', 'spironolactone'): 'Risk of hyperkalemia. Monitor potassium levels.',
            ('fluoxetine', 'tramadol'): 'Risk of serotonin syndrome. Avoid combination.',
            ('simvastatin', 'clarithromycin'): 'Increased risk of myopathy. Consider alternative.',
            ('metformin', 'furosemide'): 'May decrease metformin efficacy. Monitor glucose levels.',
        }
        
        # Common allergies and medications to avoid
        self.allergies = {
            'penicillin': ['amoxicillin', 'ampicillin', 'dicloxacillin'],
            'sulfa': ['sulfamethoxazole', 'sulfadiazine', 'sulfasalazine'],
            'nsaids': ['aspirin', 'ibuprofen', 'naproxen'],
            'shellfish': ['iodinated contrast media'],
        }
    
    def check_interactions(self, medications):
        """Check for interactions between medications"""
        results = []
        
        # Check all pairs of medications for interactions
        for i in range(len(medications)):
            for j in range(i+1, len(medications)):
                med1, med2 = medications[i].lower(), medications[j].lower()
                
                # Check both ways
                if (med1, med2) in self.interactions:
                    results.append({
                        'medication1': med1,
                        'medication2': med2,
                        'warning': self.interactions[(med1, med2)],
                        'severity': 'high'
                    })
                elif (med2, med1) in self.interactions:
                    results.append({
                        'medication1': med2,
                        'medication2': med1,
                        'warning': self.interactions[(med2, med1)],
                        'severity': 'high'
                    })
        
        return results
    
    def check_allergies(self, allergies, medications):
        """Check for allergy conflicts with medications"""
        results = []
        
        for allergy in allergies:
            allergy = allergy.lower()
            if allergy in self.allergies:
                for medication in medications:
                    medication = medication.lower()
                    if medication in self.allergies[allergy]:
                        results.append({
                            'allergy': allergy,
                            'medication': medication,
                            'warning': f'Patient is allergic to {allergy} and should not take {medication}.',
                            'severity': 'high'
                        })
        
        return results