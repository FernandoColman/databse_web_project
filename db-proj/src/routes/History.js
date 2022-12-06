import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


function History(){

    const [hist, setHist] = useState([]);
    const [undoID, setUndoID] = useState("");
    const [reload, setReload] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem("logged") === null){
            alert("You are not logged in!")
            navigate("/")
        }
        if(localStorage.getItem("logged")){
            fetch('/history', {
                'method': 'POST',
                headers: {
                  'Content-Type': 'application/json'    // Send/Receives JSON information
                },
                body:JSON.stringify({tid: localStorage.getItem('tid')} )   // Send JSON-ified username
              })
              .then(res => res.json())    // Recieve data from server and set response hook
              .then(res => setHist(res.logs))
              .catch(error => console.log('error', error))
        }
    }, [reload]);    

    const undone = (res) => {
        alert(res.alert);
        setReload(!reload);
    }

    const isNumeric = str => /^-?\d+$/.test(str);
    const undoXact = () =>{
        if(isNumeric(undoID)){
            fetch('/historyUndo', {
                'method': 'POST',
                headers: {
                  'Content-Type': 'application/json'    // Send/Recieves JSON information
                },
                body:JSON.stringify({tid: localStorage.getItem('tid'), 
                                     addr: localStorage.getItem('addr'),
                                     xact: undoID
                })   // Send JSON-ified username
            })
              .then(res => res.json())    // Recieve data from server and set response hook
              .then(res => undone(res))
              .catch(error => console.log('error', error))
        }
        else{
            alert("Please enter a valid Transaction ID!")
        }
    }
    
    return (
        <div>
            <h1>History</h1>
                <table>
                    <thead>
                        <th> Transaction ID </th>
                        <th> Type of Transaction </th>
                        <th> Date/Time </th>
                        <th> Description </th>
                    </thead>
                    <tbody>
                    {hist.map((hist_info) =>(
                        <tr>
                        <td>{hist_info.Transaction_ID}</td>
                        <td>{hist_info.Transaction_Type}</td>
                        <td>{hist_info.Time_Date}</td>
                        <td>{hist_info.Description}</td>
                    </tr>
                    ))}    
                </tbody>
                </table>
                <div>
                    <div>
                        <h2>Undo a Transaction</h2>
                        <p>Enter the Transaction ID</p>
                        <TextField id='outlined-basic' value={undoID} onChange={(e) => setUndoID(e.target.value)}/>
                        <Button color="primary" variant="contained" onClick={undoXact}>Undo</Button>
                    </div>
                </div>
        </div>
    );
};

export default History;