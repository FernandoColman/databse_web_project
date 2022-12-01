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
    cursor.execute('SELECT t.Client_ID, t.Level FROM Trader t WHERE t.Username=%s AND t.Password=%s', (username, password, ))
    account = cursor.fetchone()
    cursor.close()
    if account:
        #print("success")
        res = {'message': "Success", 'tid': account[0], 'lvl': account[1]}
    else:    
        #print("fail")
        res = {'message': "Fail"}
    #print(res)
    return json.dumps(res)

@app.route('/home', methods=['POST'])
def home():
    input = request.get_json()
    cid = input['cid']
    print(cid)

    cursor = mysql.connect.cursor()
    cursor.execute('SELECT n.Token_ID, n.Name, n.ETH_Price FROM NFT n LIMIT 20')
    columns = [col[0] for col in cursor.description]
    res = [dict(zip(columns, row)) for row in cursor.fetchall()]
    cursor.close()
    print(res)

    return json.dumps(res)

@app.route('/userinfo', methods=['POST'])
def userinfo():
    input = request.get_json()
    cid = input['cid']
    print(cid)

    cursor = mysql.connect.cursor()
    cursor.execute('SELECT c.First_Name, c.Last_Name, c.Home_Phone, c.Cell_Phone, c.Email_Addr FROM Contact c WHERE c.Client_ID=%s', (cid, ))
    account = cursor.fetchone()

    res = {'fname': account[0], 'lname': account[1], 'hnum': account[2], 'cnum': account[3], 'eaddr': account[4]}
    return json.dumps(res)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)

