from flask import Flask, request
from flask_cors import CORS
import tempfile
import os
from check import check


app = Flask(__name__)
CORS(app)

@app.route("/", methods=['POST'])
def check_style():
    if request.content_type == 'multipart/form-data':
        content = request.files['file'].read()
    else:
        content = bytes(request.json, 'utf-8')
    dir = '/Users/kathy/Desktop/Comps/StyleChecker/style-checker/backend/submissions/'
    file = tempfile.NamedTemporaryFile(mode='wb', suffix='.py', dir=dir, delete=False)
    file.write(content)
    file.close()
    warnings, ex = check(file.name)
    os.remove(file.name)
    return {
        'warnings': warnings,
        'examples': ex
    }