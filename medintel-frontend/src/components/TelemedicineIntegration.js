import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Container = styled(motion.div)`
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #1e3a8a; /* Purple */
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #374151; /* Gray */
`;

const TelemedicineIntegration = () => {
  return (
    <Container
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Title>Telemedicine Integration</Title>
      <Description>
        MedIntel integrates seamlessly with telemedicine platforms, enabling rural and remote areas to access AI-assisted diagnostics, bridging the healthcare gap.
      </Description>
    </Container>
  );
};

export default TelemedicineIntegration;