from flask import Flask, jsonify, request, render_template, redirect, url_for
import json
from flask_mysqldb import MySQL
import MySQLdb.cursors
import hashlib


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
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT t.Client_ID, t.Password, t.Level FROM Trader t WHERE t.Username=%s', (username, ))
    cid, psw, lv = cursor.fetchone()
    cursor.close()
    if cid:
        print(psw)
        hashed = hashlib.md5(password.encode('utf-8'))
        if psw == hashed.hexdigest():
            res = {'message': "Success", 'tid': cid, 'lvl': lv}
        else:
            res = {'message': "Fail"}
    else:    
        res = {'message': "Fail"}
    #print(res)
    return json.dumps(res)

@app.route('/registration', methods=['POST'])
def register():
    input = request.get_json()
    username = input['inputusername']
    password = input['inputpassword']
    fname = input['ifirstname']
    lname = input['ilastname']
    hnum = input['ihomephone']
    cnum = input['icellphone']
    email = input['iemail']

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT Username FROM Trader WHERE Username=%s', (username, ))
    acct = cursor.fetchone()
    if acct:
        cursor.close()
        res = {"message": "Fail"}
        return json.dumps(res)
    cursor.execute('SELECT MAX(Client_ID), MAX(ETH_Addr) from Trader')
    id, addr = cursor.fetchone()

    hashpass = password.encode('utf-8')
    insertion = (
        "INSERT INTO Trader (Client_ID, ETH_Addr, Username, Password, Level) "
        "VALUES (%s, %s, %s, MD5(%s), %s)"
    )
    data = (id + 1, addr + 1, username, hashpass, 1)
    cursor.execute(insertion, data)

    insertion = (
        "INSERT INTO Contact (Client_ID, First_Name, Last_Name, Home_Phone, Cell_Phone, Email_Addr) "
        "VALUES (%s, %s, %s, %s, %s, %s)"
    )
    data = (id + 1, fname, lname, hnum, cnum, email)
    cursor.execute(insertion, data)

    insertion = (
        "INSERT INTO Wallet (ETH_addr, Fiat_Amount, ETH_Amount) "
        "Values (%s, %s, %s)"
    )
    data = (addr + 1, 0, 0)
    cursor.execute(insertion, data)

    mysql.connection.commit()
    cursor.close()
    res = {"message": "Success"}
    return json.dumps(res)


@app.route('/home', methods=['POST'])
def home():
    input = request.get_json()
    cid = input['cid']
    print(cid)

    cursor = mysql.connection.cursor()
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

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT c.First_Name, c.Last_Name, c.Home_Phone, c.Cell_Phone, c.Email_Addr FROM Contact c WHERE c.Client_ID=%s', (cid, ))
    account = cursor.fetchone()
    cursor.close()

    res = {'fname': account[0], 'lname': account[1], 'hnum': account[2], 'cnum': account[3], 'eaddr': account[4]}
    return json.dumps(res)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)

