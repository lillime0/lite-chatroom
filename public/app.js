const chatForm = document.querySelector(".chat-form");
const chatMessages = document.querySelector(".chat-messages");
const chatContainer = document.querySelector(".messages-container");
const userList = document.querySelector("#users");
const inputMessage = document.querySelector("#msg");
const alert = document.querySelector(".alert-overlay");
const leaveConfirm = document.querySelector("#leave");
const close = document.querySelector(".close");
const stayBtn = document.querySelector(".alert-stay");
const leaveBtn = document.querySelector(".alert-leave");
const aside = document.querySelector(".chat-aside");
const openAside = document.querySelector(".toggle-aside");
const closeAside = document.querySelector(".close-aside");

const urlSearchParams = new URLSearchParams(location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const { username } = params;

inputMessage.focus();
const socket = io();

socket.emit("join", username);
socket.on("room users", users => displayUsers(users));

socket.on("message", message => {
  displayMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const msg = inputMessage.value.trim();
  if (!msg) return;
  socket.emit("chat message", msg);
  inputMessage.value = "";
});

const displayUsers = users => {
  userList.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    userList.appendChild(li);
  });
};

const displayMessage = message => {
  const article = document.createElement("article");
  article.classList.add("message");
  article.classList.remove("bot-message");
  article.classList.remove("message-user");
  if (message.username) {
    const div = document.createElement("div");
    div.classList.add("meta");
    div.innerHTML = `<span class="user">${message.username}</span><span class="time">${message.time}</span>`;
    article.appendChild(div);
    if (message.username === username) article.classList.add("message-user");
  } else {
    article.classList.add("bot-message");
  }
  const p = document.createElement("p");
  p.classList.add("text");
  p.textContent = message.text;
  article.appendChild(p);
  chatContainer.appendChild(article);
};

leaveConfirm.addEventListener("click", () => (alert.style.display = "flex"));

const closeAlert = () => (alert.style.display = "none");

stayBtn.addEventListener("click", closeAlert);
close.addEventListener("click", closeAlert);
leaveBtn.addEventListener("click", () => (location = "./index.html"));

openAside.addEventListener("click", () => aside.classList.add("active-users"));

closeAside.addEventListener("click", () =>
  aside.classList.remove("active-users")
);
