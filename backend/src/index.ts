import express from "express";
import { createClient } from "redis";
import { WebSocket, WebSocketServer } from "ws";
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');



const app = express();
app.use(express.json());
app.use(cors());
//created redis client
const subscribeClient = createClient();
const publishClient = createClient();
//create wesocket server
const httpserver = app.listen(8080, () => { console.log("wesocket listening on port 8080") });
const wss = new WebSocketServer({ server: httpserver });

//type for userID
interface customWebsocket extends WebSocket{
    userID ?: string,
}

//create websocket connection
wss.on("connection", function connection(ws: customWebsocket) {

    //save user id on websocket
    const userID = uuidv4();
    ws.userID = userID;

    //websocket on error
    ws.on("error", (err) => { console.log(err) });

    //websocket on message
    ws.on("message", function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            const customClient = client as customWebsocket;
            if (customClient.readyState === WebSocket.OPEN) {
                const info = JSON.stringify({
                    userID: ws.userID,
                    data: data.toString()
                })
                client.send(info, { binary: isBinary });
            }
        })
    });

    ws.on("close",()=>{console.log("websocket connnection is closed")});


    // //tells websocket connection connected
    // ws.send("chat connected");

})


//api end for announcements
app.post("/announcement",(req,res)=>{
    try {
        const {announcement} = req.body;   
        if(!announcement){
            res.status(200).send("announcement needed")
        } 
        publishClient.publish("announcements",announcement.toString());     
        res.status(200).send("published");
    } catch (error) {
        console.log("error publishing announcements"+error);
    }
})

//start redis server

async function redisServer() {
    try {
        await subscribeClient.connect();  
        console.log("initiated redis SUBSCRIBER");

        await publishClient.connect();  
        console.log("initiated redis PUBLISHER");

        //subscribe the user 
        await subscribeClient.subscribe("announcements",(messages)=>{
            console.log(`message received : ${messages}`);


            //broadcast to all open websocket connections
            wss.clients.forEach(function each(client){
                if(client.readyState === WebSocket.OPEN){
                    client.send(JSON.stringify({
                        message: messages,
                    }))
                }
            })
        })

        console.log("Subscribed to the announcements channel");

    } catch (error) {
        console.log("error connecting to redis server"+error);
    } 
}

redisServer();






