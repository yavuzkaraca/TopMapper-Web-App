import time

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from sqlalchemy import text
from tables import db, User

from build import config as cfg
from model.simulation import get_updated_progress

import visualization as vz

app = Flask(__name__)
CORS(app)

# Set up the database URI directly
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://username:password@localhost:3306/topMapper"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db.init_app(app)

with app.app_context():
    db.create_all()

try:
    with app.app_context():
        db.session.execute(text('SELECT 1'))
        print("Database connected successfully!")
except Exception as e:
    print("Database connection failed:", e)

simulation_results = {}


@app.route('/default_configs')
def get_default_configs():
    return jsonify(cfg.default_configs)


@app.route('/start_simulation', methods=['POST'])
def start_simulation():
    config = request.json

    from build.object_factory import build_simulation
    simulation = build_simulation(config)

    # Add pre-simulation images
    simulation_results["images"] = simulation_results.get("images", [])
    pre_images = vz.get_images_pre(simulation)
    simulation_results["images"] = pre_images

    result = simulation.run()

    # Add post-simulation images
    simulation_results["summary"] = result.get_summary()
    post_images = vz.get_images_post(simulation, result)
    simulation_results["images"].update(post_images)

    return jsonify({"status": "Simulation completed"})


@app.route('/progress', methods=['GET'])
def get_progress():
    return jsonify({"progress": get_updated_progress()})


@app.route('/simulation_results', methods=['GET'])
def get_simulation_results():
    if simulation_results:
        time.sleep(2)  # leaving enough time for fetching the images
        return jsonify(simulation_results)
    else:
        return jsonify({"error": "No simulation results found"}), 404


@app.route('/auth/register', methods=['POST'])
@cross_origin(origins="http://localhost:4200")
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if the email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Create a new user with a hashed password
    new_user = User(email=email)
    new_user.set_password(password)  # Use set_password to hash the password
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"id": new_user.id, "email": new_user.email}), 201


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Find the user by email
    user = User.query.filter_by(email=email).first()

    # Verify user and password
    if user and user.check_password(password):
        return jsonify({"id": user.id, "email": user.email}), 200  # Return user data on success
    else:
        return jsonify({"error": "Invalid email or password"}), 401  # Unauthorized response for incorrect credentials


if __name__ == '__main__':
    app.run(debug=True)
