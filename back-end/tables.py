from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)


class Result(db.Model):
    __tablename__ = 'result'
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Text, nullable=False)  # Store result data in text format


class UserResultRelation(db.Model):
    __tablename__ = 'user_result_relation'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    result_id = db.Column(db.Integer, db.ForeignKey('result.id'), nullable=False)
    relationship_data = db.Column(db.String(100))  # Additional relation details if needed

    user = db.relationship('User', backref='user_results')
    result = db.relationship('Result', backref='result_users')
