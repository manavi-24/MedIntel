import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///medintel.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # OCR Settings
    OCR_ENGINE = os.getenv("OCR_ENGINE", "tesseract")  # Options: 'tesseract', 'easyocr'
    
    # AI Model Paths
    PRESCRIPTION_MODEL_PATH = os.getenv("PRESCRIPTION_MODEL_PATH", "models/prescription_model.pth")
    DIAGNOSTIC_MODEL_PATH = os.getenv("DIAGNOSTIC_MODEL_PATH", "models/diagnostic_model.pth")
    
    # Security
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretjwtkey")

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
