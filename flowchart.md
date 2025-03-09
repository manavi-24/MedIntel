```mermaid
graph TD  
  %% User Input Flow %%
  A[User Input] -->|Handwritten Prescription| B[OCR Model - Extracts Medicine]  
  A -->|Medical Image & Symptoms| C[ML Model for Diagnosis]  
  A -->|Patient History & Medications| J[Drug Interaction Checker]  

  %% OCR-Based Prescription Scanning %%
  B --> D1[Text Preprocessing]  
  D1 --> D2[Named Entity Recognition - Identify Medicines]  
  D2 --> D3[Spell Correction and Standardization]  
  D3 --> D4[Match Medicines with Database]  
  D4 -->|Matched Data| D[Flask Backend - Match Medicines]  
  D4 -->|Unrecognized Drugs| D5[Manual Verification]  

  %% ML-Based Diagnosis %%
  C --> E1[Feature Extraction from Symptoms]  
  E1 --> E2[Compare with Medical Knowledge Base]  
  E2 --> E3[Predict Disease Using ML Model]  
  E3 -->|Predicted Condition| E[Flask Backend - Predict Disease]  

  %% Drug Interaction Checker %%
  J --> J1[Match with Known Drug Interactions]  
  J1 --> J2[Analyze Severity Levels]  
  J2 --> J3[Suggest Safer Alternatives]  
  J3 -->|Alert Doctor and User| K[Display Warnings and Suggestions]  

  %% Results and Recommendations %%
  D -->|Processed Medicines| F[Display Medicine and Dosage]  
  E -->|Diagnosis and Suggested Treatment| G[Show Diagnosis and Next Steps]  
  K -->|Interaction Warnings| F  

  %% Telemedicine and User Interaction %%
  F --> H[User Confirms or Edits Medicines]  
  G --> H[User Confirms Diagnosis]  
  H --> L[Schedule Doctor Consultation]  
  L --> M[Video or Chat with Doctor]  
  M --> N[Doctor Approves or Edits Diagnosis and Prescription]  

  %% Data Storage and Model Learning %%
  H -->|Store Data and Improve Model| I[Update Database and ML Model]  
  N --> I  

  %% Optional Features %%
  H --> O[Generate E-Prescription PDF]  
  H --> P[Send Prescription to Pharmacy]  
  H --> Q[Reminders for Medicine Intake]  
