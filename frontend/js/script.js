//login-elements
const login =  document.querySelector(".login")
const loginForm =  document.querySelector(".login-form")
const loginInput =  document.querySelector(".login-input")
//chat-elementos
const chat =  document.querySelector(".chat")
const chatForm =  document.querySelector(".chat-form")
const chatInput =  document.querySelector(".chat-input")
const chatMessages =  document.querySelector(".chat-messages")

const color = [
    "cadetblue",
    "coral",
    "brown",
    "gold",
    "darkgoldenrod",
    "dodgerblue",
    "#247BA0",
    "#CB9173",
    "#F5E2C8",
    "#E4572E",
    "#BD4F6C"
]
const user = { id: "", name:"", color:""} 
let webSocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    div.classList.add("message-self")
    div.innerHTML = content

    return div
}
const createMessageOtherfElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message-other")
    span.classList.add("message-sender")
    span.style.color = senderColor;
    div.appendChild(span)
    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () =>{
    const randomIndex = Math.floor(Math.random() *color.length);
    return color[randomIndex];
}
const scrollScreen = () =>{
    window.scrollTo({ 
        top:document.body.scrollHeight,
        behavior: "smooth"
    })
}
const processMessage = ({ data }) => {
   const {userId, userName, userColor, content} = JSON.parse(data)

   const message = userId== user.id
   ? createMessageSelfElement(content)
   : createMessageOtherfElement(content,userName, userColor)
   chatMessages.appendChild(message)
   scrollScreen()
}

const handleLogin = (event) =>{
    event.preventDefault();

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    webSocket = new WebSocket("wss://projeto-chat-mensagem.onrender.com")
    webSocket.onmessage = processMessage;
}

const sendMessage = (event) => {
    event.preventDefault();
    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }
    webSocket.send(JSON.stringify(message))
    chatInput.value = '';
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)