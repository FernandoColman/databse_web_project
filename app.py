from flask import Flask, jsonify, request, render_template, redirect, url_for
import json
from flask_mysqldb import MySQL
import MySQLdb.cursors
import hashlib
import os
from datetime import datetime


app = Flask(__name__)

app.config['MYSQL_HOST'] = os.getenv("DATABASE_URL")
app.config['MYSQL_USER'] = os.getenv("DATABASE_USER")
app.config['MYSQL_PASSWORD'] = os.getenv("DATABASE_PSWRD")
app.config['MYSQL_DB'] = os.getenv("DATABASE_DBNAME")

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
    cursor.execute('SELECT t.Client_ID, t.Password, t.Level, t.ETH_Addr FROM Trader t WHERE t.Username=%s', (username, ))
    query = cursor.fetchone()

    cursor.close()
    if query:
        cid, psw, lv, addr = query
        print(psw)
        hashed = hashlib.md5(password.encode('utf-8'))
        if psw == hashed.hexdigest():
            res = {'message': "Success", 'tid': cid, 'lvl': lv, 'addr': addr}
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
    
@app.route('/wallet', methods=['POST'])
def wallet():
    input = request.get_json()
    addr = input['addr']

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT w.Fiat_Amount, w.ETH_Amount FROM Wallet w WHERE w.ETH_Addr=%s', (addr, ))
    wallet = cursor.fetchone()
    if wallet:
        res = {'message': "Success", 'fiat': wallet[0], 'eth': wallet[1], 'addr': addr}
    else:
        res = {'message': "Fail"}
    cursor.close()
    return json.dumps(res)

@app.route('/walletUpdate', methods=['POST'])
def walletUpdate():
    input = request.get_json()
    tid = input['tid']
    addr = input['addr']
    opt = input['type']
    amt = int(input['amt'])
    addAddr = input['addAddr']

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT MAX(Transaction_ID) FROM Transactions')  #GET LATEST XID
    xact = cursor.fetchone()
    xid = xact[0]
    if xid == None:
        xid = 0
    xid += 1

    cursor.execute('SELECT Fiat_Amount, ETH_Amount FROM Wallet WHERE ETH_addr=%s', (addr, ))    #GET CURRENT FIAT AND ETH AMTS
    fiat_amt, eth_amt = cursor.fetchone()

    insertion = (
        "INSERT INTO Transactions (Transaction_ID, Client_ID, Time_Date, Transaction_Type) "    #INSERT TRANSFER INTO TRANSACTIONS RELATION
        "Values (%s, %s, %s, %s)"
    )
    data = (xid, tid, datetime.now(), 'transfer')
    cursor.execute(insertion, data)

    insertion = (
        "INSERT INTO Logs (Transaction_ID, Active_Cancelled, Client_ID) "    #INSERT TRANSACTION INTO LOGS RELATION
        "VALUES (%s, %s, %s)"
    )
    data = (xid, 0, tid)
    cursor.execute(insertion, data)
    
    insertion = (   
        "INSERT INTO Transfer (Transaction_ID, Transfer_Amount, Payment_Type, Payment_Addr) "    #INSERT TRANSFER INTO TRANSFER RELTAION
        "Values (%s, %s, %s, %s)"
    )
    data = (xid, amt, opt, addAddr)
    cursor.execute(insertion, data)

    update = (
        "UPDATE Wallet "                            #UPDATE WALLET AMOUNT
        "SET Fiat_Amount=%s, ETH_Amount=%s "
        "WHERE ETH_Addr=%s "
    )
    if opt == "fiat":
        data = (fiat_amt + amt, eth_amt, addr)
    else:
        data = (fiat_amt, eth_amt + amt, addr)
    cursor.execute(update, data)

    mysql.connection.commit()
    cursor.close()
    res = {"message": "Transfer successful!"}
    return json.dumps(res)

@app.route('/history', methods=['POST'])
def history():
    input = request.get_json()
    tid = input['tid']
    #xid = input['xid']  #if history is > 20 -> specify last xid and get 20 next xacts

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT l.Transaction_ID, l.Active_Cancelled, t.Time_Date, t.Transaction_Type FROM Logs l, Transactions t  WHERE l.Client_ID = %s and l.Transaction_ID = t.Transaction_ID", (tid, ))
    columns = [col[0] for col in cursor.description]
    logs = [dict(zip(columns, row)) for row in cursor.fetchall()]

    for log in logs:
        log['Time_Date'] = log['Time_Date'].strftime("%m/%d/%Y, %H:%M:%S")
        if log['Transaction_Type'] == 'transfer':
            cursor.execute("SELECT Transfer_Amount, Payment_Type, Payment_Addr FROM Transfer t WHERE Transaction_ID=%s", (log['Transaction_ID'], ))
            xact_info = cursor.fetchone()
            log['Description'] = "Transfered {0} {1} from {2}".format(xact_info[0], xact_info[1], xact_info[2])
        else:
            cursor.execute("SELECT * From Trade t WHERE Transaction_ID=%s", (log['Transaction_ID'], ))
            xact_info = cursor.fetchone()
            cursor.execute("SELECT * From Commission WHERE Commission_ID=%s", (xact_info[0], ))
            comm_info = cursor.fetchone()
            log['Description'] = "Purchased NFT {0} from {1} for {2} {3}. Commission was {4} {5}.".format(xact_info[5], xact_info[6], xact_info[1], xact_info[2], comm_info[2], comm_info[1])

    cursor.close()
    res = {"message": "Success", "logs": logs}
    return json.dumps(res)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)

