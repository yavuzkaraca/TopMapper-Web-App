# models.py
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import JSON
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Results(db.Model):
    __tablename__ = 'results'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    summary = db.Column(JSON, nullable=False)
    images = db.Column(JSON, nullable=False)

    # Remove user_id and user relationship as the association is managed by UserResults


class UserResults(db.Model):
    __tablename__ = 'user_results'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    result_id = db.Column(db.Integer, db.ForeignKey('results.id'), primary_key=True)

    # Relationships to access User and Results from UserResults
    user = db.relationship('User', backref=db.backref('user_results', cascade="all, delete-orphan"))
    result = db.relationship('Results', backref=db.backref('user_results', cascade="all, delete-orphan"))