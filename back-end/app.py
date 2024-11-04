from flask import Flask, render_template, request, jsonify, Response
import io
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from build import object_factory, config as cfg
import visualization as vz
from model.simulation import get_updated_progress
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/default_configs')
def get_default_configs():
    return jsonify(cfg.default_configs)


@app.route('/start_simulation', methods=['POST'])
def start_simulation():
    print("POST request received")
    config = request.json
    print(config)

    from build.object_factory import build_simulation
    simulation = build_simulation(config)
    result = simulation.run()

    return jsonify({"status": "Simulation completed"})


@app.route('/progress', methods=['GET'])
def get_progress():
    return jsonify({"progress": get_updated_progress()})


if __name__ == '__main__':
    app.run(debug=True)
