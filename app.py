from flask import Flask, jsonify, request, render_template, redirect, url_for
import json
from flask_mysqldb import MySQL
import MySQLdb.cursors

app = Flask(__name__)

app.config['MYSQL_HOST'] = "dbd-proj-db.c50nc5cj1awr.us-east-1.rds.amazonaws.com"
app.config['MYSQL_USER'] = "webuser1"
app.config['MYSQL_PASSWORD'] = "TPG87J2t7N6q"
app.config['MYSQL_DB'] = "nft_db"

mysql = MySQL(app)

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the backend"

@app.route('/login', methods=['POST'])
def login():
    input = request.get_json()
    username = input['inputusername']
    password = input['inputpassword']    
    #print(username)
    cursor = mysql.connect.cursor()
    cursor.execute('SELECT t.username, t.password FROM Trader t WHERE t.username=%s AND t.password=%s', (username, password, ))
    account = cursor.fetchone()
    cursor.close()
    if account:
        #print("success")
        res = {'message': "Success"}
    else:    
        #print("fail")
        res = {'message': "Fail"}
    #print(res)
    return json.dumps(res)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)