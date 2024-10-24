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






"""

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/papers')
def papers():
    return "<h1>Papers Page</h1>"


@app.route('/simulation')
def simulation():
    return render_template('index.html')


@app.route('/plot')
def plot_png():
    # Assuming you have a way to create or obtain a Substrate object
    sim = object_factory.build_default()  # Replace with actual substrate creation
    fig = vz.visualize_substrate(sim.substrate)
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')


@app.route('/plot/substrate')
def plot_substrate():
    sim = object_factory.build_default()  # Replace with actual substrate creation
    fig = vz.visualize_substrate(sim.substrate)
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')


@app.route('/plot/growth_cones')
def plot_growth_cones():
    sim = object_factory.build_default()  # Replace with actual substrate creation
    fig = vz.visualize_growth_cones(sim.growth_cones)
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')


"""

if __name__ == '__main__':
    app.run(debug=True)
