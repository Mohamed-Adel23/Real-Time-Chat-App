let inp = document.querySelector(".inp");
let btn = document.querySelector(".btn");
let err = document.querySelector(".err");

console.log(btn);

btn.onclick = function(){
    let inpVal = inp.value.trim();
    console.log(inpVal)
    if(inpVal.length <= 0) {
        err.innerHTML = "Please Enter Your Name!";
    } else {
        err.innerHTML = "";
        localStorage.setItem('client', inpVal);
        window.location.href = "chat.html";
    }
};