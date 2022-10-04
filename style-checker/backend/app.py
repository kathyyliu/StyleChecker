from flask import Flask
from flask_cors import CORS

from check import check

app = Flask(__name__)
CORS(app)

@app.route("/")
def check_style():
    warnings, ex  = check('examples.py')
    return {
        'warnings': warnings,
        'examples': ex
    }