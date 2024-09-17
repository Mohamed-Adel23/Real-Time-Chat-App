let wel = document.querySelector(".wel");
let users = document.querySelector(".users");
let sendBtn = document.querySelector(".send-btn");
let leaveBtn = document.querySelector(".leave-btn");
let newMsg = document.querySelector(".inp");
let conToast = document.querySelector(".con-toast");
let toast = document.querySelector("#toast-msg");
let err = document.querySelector(".err");

const clientName = localStorage.getItem("client");
wel.innerHTML = `Welcome, ${clientName} 😇`;

// Build The WS Connection
let ws = null;
if(/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === true) {
    ws = new WebSocket("ws://192.168.1.2:8080");
} else {
    ws = new WebSocket("ws://localhost:8080");
}
// Send To Server A Message with New Connected Client
setTimeout(() => ws.send(`~${clientName}`), 3000);

// Receiving Messages From Server
ws.onmessage = function(msg) {
    if(msg.data[0] == '~') {
        toast.innerHTML = `🚀 ${msg.data.substring(1)} is Live Now 🚀`;
        conToast.classList.add('show');
        toast.classList.add('connect');
        setTimeout(function() {
            conToast.classList.remove('show');
        }, 5000);
    } else if(msg.data[0] == '$') {
        toast.innerHTML = `👋 ${msg.data.substring(1)} Left 👋`;
        conToast.classList.add('show');
        toast.classList.add('leave');
        setTimeout(function() {
            conToast.classList.remove('show');
        }, 5000);
    } else if(msg.data[0] == '@') {
        users.innerHTML = `🚀 &nbsp;&nbsp; ${msg.data.substring(1)} Live Users &nbsp;&nbsp; 🙎‍♂️`;
    } else {
        let message = msg.data;
        let splittedMsg = message.split("/");
        let container = document.querySelector(".msgs");
        if(splittedMsg[0] === clientName) {
            let conSend = document.createElement("div");
            let myMsg = document.createElement("div");
            let me = document.createElement("span");
            let text = document.createElement("p");

            me.innerHTML = 'Me';
            me.classList.add('client');
            text.innerHTML = splittedMsg[1];
            text.classList.add("message");
            myMsg.classList.add("my-msg");
            conSend.classList.add("send");

            myMsg.appendChild(me);
            myMsg.appendChild(text);
            conSend.appendChild(myMsg);
            container.appendChild(conSend);
        } else {
            let conRec = document.createElement("div");
            let msg = document.createElement("div");
            let cl = document.createElement("span");
            let text = document.createElement("p");

            cl.innerHTML = splittedMsg[0];
            cl.classList.add('client');
            text.innerHTML = splittedMsg[1];
            text.classList.add("message");
            msg.classList.add("msg");
            conRec.classList.add("received");

            msg.appendChild(cl);
            msg.appendChild(text);
            conRec.appendChild(msg);
            container.appendChild(conRec);
        }
    }
}

sendBtn.onclick = function() {
    if(newMsg.value.length <= 0) {
        err.innerHTML = "You can't send empty message!";
    } else {
        err.innerHTML = "";
        ws.send(`${clientName}/${newMsg.value}`);
        newMsg.value = "";
    }
}
leaveBtn.onclick = function() {
    // Send To Server The Left Client
    ws.send(`$${clientName}`);
    window.location.href = "index.html";
}