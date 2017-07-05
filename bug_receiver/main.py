#! /usr/bin/env python3

import json
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/bug', methods=['post'])
def receive_bug():
    with open("bug.txt", "a") as f:
        f.write(json.dumps(request.json)+"\n")
    return jsonify({"hello": "world"})
 
app.run(port=7077, host="0.0.0.0")