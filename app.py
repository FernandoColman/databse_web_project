from flask import Flask, jsonify, request, render_template, redirect, url_for
import json
import pymysql

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the backend"



if __name__ == '__main__':
    app.run(debug=True)