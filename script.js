let del_btn = document.getElementById("delete-btn");
let mode = document.getElementById("mode-toggle");
let chatbox = document.querySelector(".chat");

window.onload = () => {
    let introdiv = document.createElement("div");
    introdiv.classList.add("intro-msg");
    
    let para = document.createElement("p");
    para.innerText = "How can I help you today ?";
    para.style.fontSize = "24px";
    para.style.color = "white";

    introdiv.appendChild(para);
    chatbox.appendChild(introdiv);

    if(localStorage.getItem("theme") === "dark"){
        document.body.classList.add("dark-mode");
    }
}

del_btn.addEventListener("click", ()=>{
    chatbox.innerHTML = "";
});


mode.addEventListener("click", ()=>{
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        localStorage.setItem("theme", "dark");
    }
    else{
        localStorage.setItem("theme", "light");
    }
});

