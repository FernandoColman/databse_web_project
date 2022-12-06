from flask import Flask, jsonify, request, render_template, redirect, url_for
import json
from flask_mysqldb import MySQL
import MySQLdb.cursors
import hashlib
import os
from datetime import datetime


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

@app.route('/userinfochecklevel', methods=['POST'])
def check_level():
    input = request.get_json()
    username = input['inputusername']
    password = input['inputpassword']
    today = datetime.date.today()   #GET the date
    time = today.strftime("%Y")+"-"+today.strftime("%m") #no data from last month, use data from this month for testing
    
    # first = today.replace(day=1)       
    # last_month = first - datetime.timedelta(days=1)
    # time = last_month.strftime("%Y")+'-'+last_month.strftime("%m")+'%' #GET string Year-Month of Last Month
    
    cursor = mysql.connection.cursor() #check all the records in Transaction_ID & corresponding total trade values
    sql_1 =("SELECT Transactions.Client_ID, sum(if (`Transfer`.Payment_Type= 'eth', `Transfer`.Transfer_Amount,0))*1303.85+ sum(if (`Transfer`.Payment_Type= 'fiat', `Transfer`.Transfer_Amount,0))as total_value"
                "FROM nft_db.Transactions Transactions, nft_db.Transfer Transfer WHERE Time_Date like %s and Transactions.Transaction_ID = Transfer.Transaction_ID"
                "group by Transactions.Client_ID;",(time,))
    cursor.execute(sql_1)
    sql_2 =("select Transactions.Client_ID, Trader.`Level` (case"
                "when total_value>=100000 then 2"
                "when total_value<100000 then 1"
                "end)"
                "from nft_db.Transactions Transactions, nft_db.Trader Trader")
    cursor.execute(sql_2)
    client_traderlevel = cursor.fetchall()

    res = {"message": "No last month records"}
        
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
    street = input['istreet']
    city = input['icity']
    state = input['istate']
    zip = input['izip']

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
        "INSERT INTO Address (Client_ID, Street_Addr, City, State, Zip) "
        "VALUES (%s, %s, %s, %s, %s)"
    )

    data = (id + 1, street, city, state, zip)
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
    cursor.execute('SELECT n.Token_ID, n.Name, n.ETH_Price FROM NFT n where n.For_Sale = %s LIMIT 20',(0,))
    columns = [col[0] for col in cursor.description]
    res = [dict(zip(columns, row)) for row in cursor.fetchall()]
    cursor.close()
    print(res)

    return json.dumps(res)

@app.route('/userinfo', methods=['POST'])
def userinfo():
    input = request.get_json()
    cid = input['cid']
    addr=input['addr']
    print(addr)

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT c.First_Name, c.Last_Name, c.Home_Phone, c.Cell_Phone, c.Email_Addr, a.Street_Addr, a.City, a.State, a.Zip FROM Contact c, Address a WHERE c.Client_ID=%s AND c.Client_ID=a.Client_ID' , (cid, ))
    account=cursor.fetchone()

    cursor.execute('SELECT n.Token_ID, n.Name, n.ETH_Price FROM NFT n where n.For_Sale != %s and n.ETH_addr = %s LIMIT 20',(0, addr,))
    column = [col[0] for col in cursor.description]
    columns=[dict(zip(column, row)) for row in cursor.fetchall()]
    cursor.close()
    print("accounts",account)
    res = {'res1':account,'res2':columns}
    return json.dumps(res)

@app.route('/usersellnft', methods=['POST'])
def sellnft():
    input = request.get_json()
    tokenid = input['nftid']
    cursor = mysql.connection.cursor()
    cursor.execute('UPDATE NFT n SET n.For_Sale = %s WHERE n.Token_ID = %s', (0,tokenid))
    mysql.connection.commit()
    cursor.close()
    res={'message': "Success"}
    return json.dumps(res)
    

@app.route('/userbuynft', methods=['POST'])
def buynft():
    input = request.get_json()
    tokenid = input['nftid']
    cursor = mysql.connection.cursor()    
    cursor.execute('SELECT n.ETH_Price, n.ETH_Addr FROM NFT n where n.Token_ID = %s',(tokenid,))
    price=cursor.fetchone()
    cursor.close()
    print(price)
    res={'message':"Success",'price':price[0],'eth_addr':price[1]}
    return json.dumps(res)

@app.route('/nfttrade',methods=['POST'])
def nfttrade():
    input=request.get_json()
    client=input['cid']
    tokenid = input['nftid']
    buyer=input['addr']
    seller=input['seller_addr']
    trade_amt=input['trade_amt']
    trade_type=input['trade_type']
    comm_amt=input['comm_amt']
    comm_type=input['comm_type']
    print(client,tokenid,buyer,seller,trade_amt,trade_type,comm_amt,comm_type)
    cursor=mysql.connection.cursor()
    cursor.execute('SELECT MAX(Transaction_ID) FROM Transactions')  #GET LATEST XID
    xact = cursor.fetchone()
    xid = xact[0]
    if xid == None:
        xid = 0
    xid += 1

    #Adding to transactions
    insertion = (
        "INSERT INTO Transactions (Transaction_ID, Client_ID, Time_Date, Transaction_Type) "    #INSERT TRANSFER INTO TRANSACTIONS RELATION
        "VALUES (%s, %s, %s, %s)"
    )
    data = (xid, client, datetime.now(), 'nfttrade')
    cursor.execute(insertion, data)
    
    #Adding to logs
    insertion = (
        "INSERT INTO Logs (Transaction_ID, Active_Cancelled, Client_ID) "    #INSERT TRANSACTION INTO LOGS RELATION
        "VALUES (%s, %s, %s)"
    )
    data = (xid, 0, client)
    cursor.execute(insertion, data)

    #Commission table
    cursor.execute('SELECT MAX(Commission_ID) FROM Commission')  #GET LATEST XID
    comm = cursor.fetchone()
    comm_id = comm[0]
    if comm_id == None:
        comm_id = 0
    comm_id += 1

    #updating trade table
    cursor.execute('INSERT INTO Trade VALUES (%s,%s,%s,%s,%s,%s,%s)',(xid,trade_amt,trade_type,comm_id,tokenid,seller,buyer))

    cursor.execute('INSERT INTO Commission VALUES (%s,%s,%s)',(comm_id,comm_type,comm_amt))

    
    
    #updating buyers wallet
    if trade_type == "fiat":
        cursor.execute('SELECT Fiat_Amount from Wallet where ETH_Addr = %s',(buyer,))
        cur=cursor.fetchone()
        bw_update=cur[0] - trade_amt
        cursor.execute('UPDATE Wallet set Fiat_Amount = %s WHERE ETH_Addr = %s',(bw_update,buyer))
    else:
        cursor.execute('SELECT ETH_Amount from Wallet where ETH_Addr = %s',(buyer,))
        cur=cursor.fetchone()
        bw_update=cur[0] - trade_amt
        cursor.execute('UPDATE Wallet set ETH_Amount = %s WHERE ETH_Addr = %s',(bw_update,buyer))
    
    #updating sellers wallet
    if trade_type == "fiat":
        cursor.execute('SELECT Fiat_Amount from Wallet where ETH_Addr = %s',(seller,))
        cur=cursor.fetchone()
        sw_update=cur[0] + trade_amt
        cursor.execute('UPDATE Wallet set Fiat_Amount = %s WHERE ETH_Addr = %s',(sw_update,seller))
    else:
        cursor.execute('SELECT ETH_Amount from Wallet where ETH_Addr = %s',(seller,))
        cur=cursor.fetchone()
        sw_update=cur[0] + trade_amt
        cursor.execute('UPDATE Wallet set ETH_Amount = %s WHERE ETH_Addr = %s',(sw_update,seller))

    #updating NFT Table
    cursor.execute('UPDATE NFT n SET n.ETH_Addr = %s, n.For_Sale = %s WHERE n.Token_Id = %s',(buyer,1,tokenid,))

    mysql.connection.commit()
    cursor.close()
    
    res={'message':"Success"}
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

def transactions():
    input = request.get_json()
    tid = input['tid']
    cursor = mysql.connection.cursor()
    cursor.execute()
    
    
    
    cursor.close()
    res = {"message": "Transfer successful!"}     
    return json.dumps(res)
if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)

