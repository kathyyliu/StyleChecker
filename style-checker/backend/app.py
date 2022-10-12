from flask import Flask, request
from flask_cors import CORS
import tempfile

from check import check


app = Flask(__name__)
CORS(app)

@app.route("/", methods=['POST'])
def check_style():
    content = request.files['file'].read()
    dir = '/Users/kathy/Desktop/Comps/StyleChecker/style-checker/backend/submissions/'
    file = tempfile.NamedTemporaryFile(mode='wb', suffix='.py', dir=dir, delete=False)
    file.write(content)
    file.close()
    print("route " + str(file.name))
    warnings, ex = check(file.name)
    return {
        'warnings': warnings,
        'examples': ex
    }