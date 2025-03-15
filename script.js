let del_btn = document.getElementById("delete-btn");
let mode = document.getElementById("mode-toggle");
let chatbox = document.querySelector(".chat");
let enter_btn = document.querySelector(".enter");
let inputfield = document.getElementById("prompt");

document.addEventListener("DOMContentLoaded", ()=>{
    showapikeypopup();
});

function showapikeypopup(){
    let Api_key = localStorage.getItem("openai_api_key");

    if(!Api_key){

        if (document.querySelector(".popup-container")) return;

        let popup = document.createElement("div");
        popup.classList.add("popup-container");

        popup.innerHTML = `
            <div class="popup-content">
                <h2>Enter OpenAI API Key</h2>
                <input type="text" id="api-key-input" placeholder="Enter API Key">
                <button id="save-key">Save</button>
                <p>Don't have an API key?  
                    <a href="https://platform.openai.com/api-keys" target="_blank">Get API Key</a>
                </p>
            </div>
            `;

        document.body.appendChild(popup);
        
        let savekey_btn = document.getElementById("save-key");
        let apikey_input = document.getElementById("api-key-input");

        savekey_btn.addEventListener("click", ()=>{
            let userkey = apikey_input.value.trim();
            
            if(userkey){
                localStorage.setItem("openai_api_key" , userkey);
                popup.remove();
            }
            else{
                alert("Enter valid api key");
            }
        });
    }
}

window.onload = () => {
    
    if(localStorage.getItem("theme") === "dark"){
        document.body.classList.add("dark-mode");
    }

    let introdiv = document.createElement("div");
    introdiv.classList.add("intro-msg");
    
    let para = document.createElement("p");
    para.innerText = "How can I help you today ?";
    para.style.fontSize = "34px";

    if (document.body.classList.contains("dark-mode")) {
        para.style.color = "white";
    } else {
        para.style.color = "black";
    }

    introdiv.appendChild(para);
    chatbox.appendChild(introdiv);

}

del_btn.addEventListener("click", ()=>{
    chatbox.innerHTML = "";
});

del_btn.innerHTML = `<img src="./ASSETS/delete.png" alt="Delete" width="20px">`;
mode.innerHTML = `<img src="./ASSETS/brightness.png" alt="Light Mode" width="20px">`;


mode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    let para = document.querySelector(".intro-msg p");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        mode.innerHTML = `<img src="./ASSETS/crescent.png" alt="Dark Mode" width="20px">`;
        if (para) para.style.color = "white"; 
    } else {
        localStorage.setItem("theme", "light");
        mode.innerHTML = `<img src="./ASSETS/brightness.png" alt="Light Mode" width="20px">`;
        if (para) para.style.color = "black"; 
    }
});

// Show enter button only when user types
inputfield.addEventListener("input", () => {
    if (inputfield.value.trim() !== "") {
        enter_btn.style.opacity = "1";
    } else {
        enter_btn.style.opacity = "0";
    }
});

function getuserprompt(){
    let user_text = inputfield.value.trim();
    if(user_text == ""){
        return;
    }

    let introMsg = document.querySelector(".intro-msg");
    if (introMsg) {
        introMsg.remove();
    }

    let userdiv = document.createElement("div");
    userdiv.classList.add("user-prompt");
    userdiv.innerText = user_text;

    chatbox.appendChild(userdiv);
    inputfield.value = "";

    scrolltobottom();

    fetchresponse(user_text);
}

enter_btn.addEventListener("click", getuserprompt);

inputfield.addEventListener("keypress", (event)=>{
    if(event.key === "Enter"){
        getuserprompt();
    }
});

function scrolltobottom(){
    chatbox.scrollTop = chatbox.scrollHeight;
}

const Base_URL = " https://api.openai.com/v1/chat/completions";
const Api_key = "";


async function fetchresponse(usermessage){
    let Api_key = localStorage.getItem("openai_api_key");
    let retryDelay = 5000;

    if (!Api_key) {
        displayBotMessage("⚠️ API Key is missing. Please enter a valid API key.");
        showapikeypopup(); 
        return;
    }
    
    try{
        let response = await fetch(Base_URL,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Api_key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{role: "user", content: usermessage}],
                    temperature: 0.7
                })
            }
        );

        if (response.status === 429) {
            console.warn("Too many requests! Retrying in 5 seconds...");
            await delay(retryDelay);
            return fetchresponse(usermessage);  // Retry request
        }

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("openai_api_key");  
                showapikeypopup();  
                displayBotMessage("⚠️ Invalid API Key. Please enter a valid one.");
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        let botMessage = data.choices[0].message.content.trim(); 

        displayBotMessage(botMessage);
        
    }
    catch(error){
        console.log(error);
        displayBotMessage("⚠️ Sorry, I couldn't process your request. Please try again later.");
    }
}

function displayBotMessage(message) {
    let botdiv = document.createElement("div");
    botdiv.classList.add("bot-response");
    botdiv.innerText = message;

    chatbox.appendChild(botdiv);
    scrolltobottom();
}