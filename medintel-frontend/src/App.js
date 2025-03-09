// filepath: /d:/OneDrive/Desktop/medintel/medintel-frontend/src/App.js
import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import PrescriptionUpload from './components/PrescriptionUpload';
import DiagnosisForm from './components/DiagnosisForm';
import DrugInteractionCheck from './components/DrugInteractionCheck';
import TelemedicineIntegration from './components/TelemedicineIntegration';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  body {
    background-color: #f8fafc;
    color: #334155;
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const LogoBlue = styled.span`
  color: #3b82f6;
`;

const LogoWhite = styled.span`
  color: #1e40af;
`;

const Nav = styled.nav`
  display: flex;
  gap: 16px;
`;

const NavItem = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
  font-weight: ${props => props.active ? '600' : '400'};
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? '#eff6ff' : '#f1f5f9'};
  }
`;

const Main = styled.main`
  min-height: 80vh;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 14px;
`;

const App = () => {
  const [activeTab, setActiveTab] = useState('prescription');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'prescription':
        console.log('Rendering PrescriptionUpload');
        return <PrescriptionUpload />;
      case 'diagnosis':
        console.log('Rendering DiagnosisForm');
        return <DiagnosisForm />;
      case 'interaction':
        console.log('Rendering DrugInteractionCheck');
        return <DrugInteractionCheck />;
      case 'telemedicine':
        console.log('Rendering TelemedicineIntegration');
        return <TelemedicineIntegration />;
      default:
        console.log('Rendering default PrescriptionUpload');
        return <PrescriptionUpload />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Logo>
            <LogoBlue>Med</LogoBlue><LogoWhite>Intel</LogoWhite>
          </Logo>
          <Nav>
            <NavItem 
              active={activeTab === 'prescription'} 
              onClick={() => setActiveTab('prescription')}
            >
              Prescription Scanning
            </NavItem>
            <NavItem 
              active={activeTab === 'diagnosis'} 
              onClick={() => setActiveTab('diagnosis')}
            >
              AI Diagnosis
            </NavItem>
            <NavItem 
              active={activeTab === 'interaction'} 
              onClick={() => setActiveTab('interaction')}
            >
              Drug Interactions
            </NavItem>
            <NavItem 
              active={activeTab === 'telemedicine'} 
              onClick={() => setActiveTab('telemedicine')}
            >
              Telemedicine
            </NavItem>
          </Nav>
        </Header>

        <Main>
          {renderTabContent()}
        </Main>

        <Footer>
          <p>© 2025 MedIntel - The Ultimate Healthcare Assistant</p>
          <p>Developed with ❤️ for better healthcare</p>
        </Footer>
      </AppContainer>
    </>
  );
};

export default App;