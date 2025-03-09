import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8fafc;
  overflow: hidden; /* Remove scrollbar initially */
`;

const UploadBox = styled(motion.div)`
  margin-top: 10vh; /* Move the upload box higher */
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Poppins', sans-serif;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 1rem;
`;

const FileInput = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const UploadButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2563eb;
  }
`;

const ResponseText = styled.p`
  margin-top: 1rem;
  color: #3b82f6;
`;

const Footer = styled.footer`
  margin-top: auto;
  padding: 1rem;
  background-color: #1e3a8a;
  color: #ffffff;
  text-align: center;
  width: 100%;
`;

const PrescriptionUpload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Remove scrollbar initially
    document.body.style.overflow = 'hidden';

    // Restore scrollbar when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload_prescription', formData);
      setResponse(res.data.extracted_text);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <UploadBox
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Title>Upload Prescription</Title>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <FileInput
            type="file"
            onChange={handleFileChange}
          />
          <UploadButton
            type="submit"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Upload
          </UploadButton>
        </form>
        {response && <ResponseText>Extracted Text: {response}</ResponseText>}
      </UploadBox>
      <Footer>
        © 2025 MedIntel - The Ultimate Healthcare Assistant
      </Footer>
    </Container>
  );
};

export default PrescriptionUpload;