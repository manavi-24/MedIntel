from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
from flask_migrate import Migrate
migrate = Migrate()

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Load configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///medintel.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')
    app.config['DEBUG'] = True

    db.init_app(app)
    migrate.init_app(app, db)

    from app import models
    from app.routes import register_routes
    register_routes(app)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app