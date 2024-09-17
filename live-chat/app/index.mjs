// بسم الله الرحمن الرحيم
// --> Real-Time Chatting APP <--
// Author: Mohamed Adel (BnAdel)
// Instructor: Hussein Nasser
// Publish Date: 16-9-2024

import http from 'http';
import ws from 'websocket';
import redis from 'redis';

const APPID = process.env.APPID;
const WebSocketServer = ws.server;
// Because one client may has many connections (POOL OF CONNECTIONS)
let connections = [];

// Creating a SUB
const subscriber = redis.createClient({
    port: 6379,
    host: 'rds' // Redis Container Server
});
// Creating a PUB
const publisher = redis.createClient({
    port: 6379,
    host: 'rds' // Redis Container Server
});
// Setting and Getting Data
const client = redis.createClient({
    port: 6379,
    host: 'rds' // Redis Container Server
});

// On Subscribe 
subscriber.on("subscribe", function(channel, count) {
    console.log(`Server - ${APPID} - subscribed successfully to livechat!`);
});

// When receiving a message from Redis for each ws server
subscriber.on("message", function(channel, message) {
    try {
        console.log(`Server - ${APPID} - received a message from channel ${channel} MSG: ${message}`);
        // Send the message to each connection that I have (Multiple Clients)
        connections.forEach((con) => con.send(`${message}`));
    }
    catch(ex) {
        console.log(`ERROR: ${ex}`);
    }
});

// Subscribe the current client
subscriber.subscribe("livechat");

// Raw Http Server which help us to create the TCP to be passed to websocket
// Handshake (Switching Protocol)
const httpServer = http.createServer();
// Passing httpServer to WebSocket
const websocket = new WebSocketServer({
    "httpServer": httpServer // The Handshake
});
// Listening PORT
httpServer.listen(8080, () => console.log("My Server is listening on PORT 8080"));

// When Requesting
websocket.on("request", request => {
    // Send back the switching protocol with status code 101
    const connection = request.accept(null, request.origin);

    connection.on("open", () => console.log("OPENED!"));
    connection.on("close", () => console.log("CLOSED!"));

    // When Getting a message from a client, must be published immediately
    connection.on("message", message => {
        console.log(` - ${APPID} - Server Received Message: ${message.utf8Data}`);
        // If Message Begins with $ then The Client left
        if(message.utf8Data[0] === '$') {
            // Update The ConnectedUsersNum in Redis
            handleConnects('decrement');
        }
        // Publish Client Message
        publisher.publish("livechat", message.utf8Data);
    });

    // After 5s I will inform the current client and other clients that he was connected successfully!
    setTimeout(function() {
        console.log(`Connected To Server - ${APPID} -`);
    }, 500);

    // Set New Connection
    handleConnects('increment');

    // Pushing all connection events
    connections.push(connection);
});

// A Function To Handle Connected Users With Redis
function handleConnects(state) {
    if(state === 'increment') {
        client.get("ConnectedUsersNum", (err, reply) => {
            if(reply === null) {
                client.set("ConnectedUsersNum", 1, (err, reply) => {
                    console.log("FROM SET 1", reply);
                });
                publisher.publish("livechat", `@${1}`);
            }
            else {
                client.set("ConnectedUsersNum", parseInt(reply)+1, (err, reply) => {
                    console.log("FROM SET 2", reply);
                });
                publisher.publish("livechat", `@${parseInt(reply)+1}`);
            }
            console.log("From GET INC", reply);
        });
    } else {
        client.get("ConnectedUsersNum", (err, reply) => {
                client.set("ConnectedUsersNum", parseInt(reply)-1, (err, reply) => {
                    console.log("FROM SET DEC", reply);
                });
                publisher.publish("livechat", `@${parseInt(reply)-1}`);
            console.log("From GET DEC", reply);
        });
    }
}
