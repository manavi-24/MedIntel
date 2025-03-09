import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Container = styled(motion.div)`
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #1e3a8a; /* Navy Blue */
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const SymptomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SymptomCard = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #e0f2fe; /* Light Blue */
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #bfdbfe; /* Slightly darker blue */
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #1e3a8a; /* Navy Blue */
  text-transform: capitalize;
`;

const SubmitButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: #1e3a8a; /* Navy Blue */
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
  align-self: center;

  &:hover {
    background-color: #1d4ed8; /* Blue */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DiagnosisResults = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #bfdbfe; /* Light Blue */
  border-radius: 0.5rem;
  background-color: #e0f2fe; /* Light Blue */
`;

const DiagnosisTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1e3a8a; /* Navy Blue */
  margin-bottom: 0.5rem;
`;

const DiagnosisText = styled.p`
  font-size: 1rem;
  color: #1e3a8a; /* Navy Blue */
  font-weight: 500;
`;

const DiagnosisForm = () => {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  // Common symptoms checklist
  const symptoms = [
    'fever', 'cough', 'fatigue', 'shortness of breath', 'headache',
    'sore throat', 'body ache', 'nausea', 'diarrhea', 'loss of taste'
  ];

  // State to track selected symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState({
    fever: false,
    cough: false,
    fatigue: false,
    shortness_of_breath: false,
    headache: false,
    sore_throat: false,
    body_ache: false,
    nausea: false,
    diarrhea: false,
    loss_of_taste: false
  });

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms({
      ...selectedSymptoms,
      [symptom]: !selectedSymptoms[symptom]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/diagnose', {
        symptoms: selectedSymptoms,
        // In a real app, you would get these from authentication
        patient_id: 1,
        doctor_id: 2
      });

      setDiagnosis(res.data);
    } catch (err) {
      console.error(err);
      alert('Error diagnosing symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Title>AI Diagnostic Assistant</Title>

      <Form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold mb-2">Select Your Symptoms:</h3>

        <SymptomsGrid>
          {symptoms.map((symptom) => (
            <SymptomCard
              key={symptom}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleSymptomChange(symptom)}
            >
              <Checkbox
                type="checkbox"
                id={symptom}
                checked={selectedSymptoms[symptom]}
                onChange={() => handleSymptomChange(symptom)}
              />
              <Label htmlFor={symptom}>
                {symptom.replace('_', ' ')}
              </Label>
            </SymptomCard>
          ))}
        </SymptomsGrid>

        <SubmitButton
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? 'Analyzing...' : 'Diagnose Symptoms'}
        </SubmitButton>
      </Form>

      {diagnosis && (
        <DiagnosisResults>
          <DiagnosisTitle>Diagnosis Results:</DiagnosisTitle>
          <DiagnosisText>Disease: {diagnosis.disease}</DiagnosisText>
          <DiagnosisText>Confidence: {diagnosis.confidence}%</DiagnosisText>
          <div className="mt-2">
            <p className="text-sm text-blue-600 font-semibold">Symptoms Detected:</p>
            <ul className="list-disc pl-5">
              {diagnosis.symptoms_detected.map(symptom => (
                <li key={symptom} className="text-sm text-blue-600 capitalize">
                  {symptom.replace('_', ' ')}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-gray-500">Note: This is an AI-assisted diagnosis. Always consult with a healthcare professional for accurate medical advice.</p>
        </DiagnosisResults>
      )}
    </Container>
  );
};

export default DiagnosisForm;