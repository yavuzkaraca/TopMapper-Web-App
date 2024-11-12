from flask import Flask, request, jsonify
from flask_cors import CORS

from build import config as cfg
from model.simulation import get_updated_progress
from tables import db

app = Flask(__name__)
CORS(app)

# Set up the database URI directly
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://username:password@db/topMapper"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db.init_app(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()

simulation_results = {}


@app.route('/default_configs')
def get_default_configs():
    return jsonify(cfg.default_configs)


@app.route('/start_simulation', methods=['POST'])
def start_simulation():
    config = request.json

    from build.object_factory import build_simulation
    simulation = build_simulation(config)
    result = simulation.run()

    simulation_results["summary"] = result.get_summary()
    simulation_results["images"] = result.get_images()

    return jsonify({"status": "Simulation completed"})


@app.route('/progress', methods=['GET'])
def get_progress():
    return jsonify({"progress": get_updated_progress()})


@app.route('/simulation_results', methods=['GET'])
def get_simulation_results():
    if simulation_results:
        return jsonify(simulation_results)
    else:
        return jsonify({"error": "No simulation results found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
