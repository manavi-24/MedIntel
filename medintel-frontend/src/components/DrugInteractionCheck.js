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
  color: #1e3a8a; /* Red */
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #374151; /* Gray */
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db; /* Light Gray */
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151; /* Gray */
`;

const SubmitButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: #1e3a8a; /* Red */
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
  align-self: center;

  &:hover {
    background-color: #1d4ed8; /* Darker Red */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 2rem;
`;

const ResultsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #374151; /* Gray */
  margin-bottom: 1rem;
`;

const ResultGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const ResultLabel = styled.h4`
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151; /* Gray */
  margin-bottom: 0.5rem;
`;

const ResultItem = styled.div`
  padding: 0.75rem;
  background-color: ${(props) => (props.type === 'interaction' ? '#fee2e2' : '#d1fae5')}; /* Light Red or Light Green */
  border: 1px solid ${(props) => (props.type === 'interaction' ? '#fecaca' : '#a7f3d0')}; /* Red or Green */
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ResultText = styled.p`
  font-size: 1rem;
  color: ${(props) => (props.type === 'interaction' ? '#b91c1c' : '#065f46')}; /* Dark Red or Dark Green */
`;

const Disclaimer = styled.p`
  margin-top: 2rem;
  font-size: 0.875rem;
  color: #6b7280; /* Gray */
`;

const DrugInteractionCheck = () => {
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const medicationsArray = medications
      .split(',')
      .map((med) => med.trim())
      .filter((med) => med);

    const allergiesArray = allergies
      .split(',')
      .map((allergy) => allergy.trim())
      .filter((allergy) => allergy);

    try {
      const res = await axios.post('http://localhost:5000/check_interaction', {
        medications: medicationsArray,
        allergies: allergiesArray,
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert('Error checking drug interactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Title>Drug Interaction & Allergy Check</Title>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="medications">Medications</Label>
          <Input
            id="medications"
            type="text"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            placeholder="Enter medications separated by commas (e.g., aspirin, warfarin, metformin)"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="allergies">Known Allergies</Label>
          <Input
            id="allergies"
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Enter allergies separated by commas (e.g., penicillin, nsaids, sulfa)"
          />
        </InputGroup>

        <SubmitButton
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? 'Analyzing...' : 'Check Interactions'}
        </SubmitButton>
      </Form>

      {results && (
        <ResultsContainer>
          <ResultsTitle>Results:</ResultsTitle>

          <ResultGroup>
            <ResultLabel>Medications Checked:</ResultLabel>
            <div className="flex flex-wrap gap-2 mt-1">
              {results.medications_checked.map((med, index) => (
                <ResultItem key={index} type="checked">
                  <ResultText>{med}</ResultText>
                </ResultItem>
              ))}
            </div>
          </ResultGroup>

          {results.drug_interactions.length > 0 ? (
            <ResultGroup>
              <ResultLabel>Potential Drug Interactions:</ResultLabel>
              <ul className="mt-1 space-y-2">
                {results.drug_interactions.map((interaction, index) => (
                  <ResultItem key={index} type="interaction">
                    <ResultText>
                      <strong>{interaction.medication1} + {interaction.medication2}</strong>
                    </ResultText>
                    <ResultText>{interaction.warning}</ResultText>
                    <ResultText>
                      Severity: <strong>{interaction.severity.toUpperCase()}</strong>
                    </ResultText>
                  </ResultItem>
                ))}
              </ul>
            </ResultGroup>
          ) : (
            <ResultItem type="no-interaction">
              <ResultText>No drug interactions found between these medications.</ResultText>
            </ResultItem>
          )}

          {results.allergy_warnings.length > 0 ? (
            <ResultGroup>
              <ResultLabel>Allergy Warnings:</ResultLabel>
              <ul className="mt-1 space-y-2">
                {results.allergy_warnings.map((warning, index) => (
                  <ResultItem key={index} type="interaction">
                    <ResultText>
                      <strong>Allergy: {warning.allergy}, Medication: {warning.medication}</strong>
                    </ResultText>
                    <ResultText>{warning.warning}</ResultText>
                  </ResultItem>
                ))}
              </ul>
            </ResultGroup>
          ) : allergies && (
            <ResultItem type="no-interaction">
              <ResultText>No allergy conflicts found with these medications.</ResultText>
            </ResultItem>
          )}

          <Disclaimer>
            Disclaimer: This tool provides information for educational purposes only. Always consult with a healthcare professional before making decisions about medication.
          </Disclaimer>
        </ResultsContainer>
      )}
    </Container>
  );
};

export default DrugInteractionCheck;