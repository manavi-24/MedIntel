# MedIntel - The Ultimate Healthcare Assistant 

MedIntel is an AI-driven healthcare assistant designed to streamline prescription verification and assist in disease diagnosis. It automates prescription matching against medical databases and analyzes medical images & symptoms for accurate diagnoses.

##  Features

-  **Prescription Matching**: Uses OCR to extract handwritten prescription details and cross-checks them against a verified drug database.
-  **AI Diagnostic Assistant**: Analyzes medical images (X-rays, MRIs, etc.) and patient symptoms to assist doctors in disease detection.
-  **Drug Interaction & Allergy Detection**: Identifies potential medication risks based on a patient's allergy history.
-  **Scalable & Secure**: Built with Flask, React, and SQLAlchemy, ensuring HIPAA/GDPR compliance.

##  Project Structure

```plaintext
medintel-backend/
│── app/
│   │── __init__.py      # Initializes Flask app
│   │── models.py        # Database models
│   │── routes.py        # API endpoints
│   │── utils.py         # Helper functions (OCR, AI models)
│── config.py            # Configuration settings
│── run.py               # Entry point
│── requirements.txt     # Dependencies
│── .env                 # Environment variables
│── README.md            # Project documentation
```

## 🛠 Tech Stack

- **Backend**: Flask (Python)
- **Database**: PostgreSQL / SQLite
- **OCR**: Tesseract, EasyOCR (for extracting handwritten text)
- **AI Models**:
  - CNNs (TensorFlow/PyTorch) → For medical image analysis
  - NLP (SpaCy, BERT) → For prescription matching & symptom-based diagnosis
- **Security**: OAuth 2.0, JWT, AES encryption

##  Getting Started

### 🔹 Prerequisites
Make sure you have Python 3.8+ installed.

### 🔹 Installation

#### Clone the repository
```sh
git clone https://github.com/yourusername/medintel.git
cd medintel-backend
```

#### Create a virtual environment
```sh
python -m venv venv
source venv/bin/activate  # (Mac/Linux)
venv\Scripts\activate     # (Windows)
```

#### Install dependencies
```sh
pip install -r requirements.txt
```

#### Set up environment variables
Create a `.env` file and add:
```sh
SECRET_KEY=your_secret_key
```

#### Run the application
```sh
python run.py
```

The API will be available at: [http://127.0.0.1:5000/test](http://127.0.0.1:5000/test)

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/test`  | Check if API is working |
| POST   | `/upload_prescription` | Upload prescription for analysis |
| POST   | `/diagnose` | Analyze symptoms & suggest diagnoses |

##  Future Enhancements

-  Integration with Electronic Health Records (EHR)
-  Chatbot for AI-powered medical Q&A
-  Multilingual Prescription Recognition
-  Voice-Based Symptom Input for Accessibility


## Security & Compliance

MedIntel follows strict data privacy measures:

- Data encryption (AES, HTTPS)
- HIPAA/GDPR compliance
- Role-based access control

- **Srishti Chamoli** - AI/ML Engineer

**Made with ❤️ by MedIntel Team**
