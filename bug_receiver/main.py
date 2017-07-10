#! /usr/bin/env python

# import json
# from flask import Flask, request, jsonify
# app = Flask(__name__)

# @app.route('/')
# def hello_world():
#     return 'Hello, World!'

# @app.route('/bug', methods=['post'])
# def receive_bug():
#     with open("bug.txt", "a") as f:
#         f.write(json.dumps(request.json)+"\n")
#     return jsonify({"hello": "world"})

# app.run(port=7077, host="0.0.0.0")

import socket
import threading
import time
import struct

def function(newsock, address):
    print "open address : ", address
    s = newsock.recv(10240000)
    f = open('bug.txt','a')
    f.write(s)
    f.close()
    newsock.close()

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  
sock.bind(('0.0.0.0', 7077))  
sock.listen(5)  
while True:
    newsock, address = sock.accept()
    tmpThread = threading.Thread(target=function, args=(newsock, address))  
    tmpThread.start()  
print 'end'

