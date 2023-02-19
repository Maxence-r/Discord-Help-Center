let socketListener;

function registerSocket() {
    if (socketListener) {
        socketListener.off();
    }
    const socket = io();
    socketListener = socket.on(`${localStorage.getItem('ticketId')}-newMessage`, (message) => {
        user = message.user;
        message = message.message;
        if (message.owner != localStorage.getItem('ticketIdCreator')) {
        document.querySelector('.messages-container').innerHTML += `
        <div class="messages">
            <div class="left-message">
                <img src="./assets/logo.svg" class="conv-icons">
                <div class="left-box">${message.content}</div>
            </div>
        </div>`;
        } else {
            document.querySelector('.messages-container').innerHTML += `
            <div class="messages">
                <div class="right-message">
                    <img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" class="conv-icons">
                    <div class="right-box">${message.content}</div>
                </div>
            </div>`;
        }
        document.querySelector('.messages-container').scrollTo(0, document.querySelector('.messages-container').scrollHeight);
    });
    let isTyping = false;

    socket.on(`${localStorage.getItem('ticketId')}-typing`, (user) => {
    if (user !== localStorage.getItem('id')) {
        if (!isTyping) {
            const typingMessage = `
            <div class="messages typing">
                <div class="left-message">
                    <img src="./assets/logo.svg" class="conv-icons">
                    <div class="left-box type-message">
                    <div class="loaderTyping">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            </div>`;
            document.querySelector('.messages-container').insertAdjacentHTML('beforeend', typingMessage);
            isTyping = true;
            setTimeout(() => {
                if(document.querySelector('.typing')) document.querySelector('.typing').remove();
                isTyping = false;
            }, 5000);
        
        }
    } 
    document.querySelector('.messages-container').scrollTo(0, document.querySelector('.messages-container').scrollHeight);
    });
}



const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };
  
  const messageInput = document.querySelector('.message-input');
  
  const sendTypingRequest = () => {
    fetch('/ticket/typing', {
      method: 'POST',
      body: JSON.stringify({ ticketId: localStorage.getItem('ticketId') }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (!data.message) {
          console.log(data);
        }
      });
  };
  
  const debouncedSendTypingRequest = debounce(sendTypingRequest, 500);
  
  messageInput.addEventListener('input', debouncedSendTypingRequest);
  


function getUserInfo() {
    fetch('/api/discord/infos', {
        method: 'POST',
        body: JSON.stringify({ access_token: document.cookie.split('=')[1] }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                refreshInteract();
                document.querySelector('.user-infos') ? document.querySelector('.user-infos').remove() : null;
            } else {
                document.querySelector('.login').remove();
                document.querySelector('.user-logo').src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
                document.getElementById('user-name').innerHTML = `${data.username}#${data.discriminator}`;
                document.querySelector('.role').innerHTML = data.email;
                localStorage.setItem('avatar', `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`);
                localStorage.setItem('username', `${data.username}#${data.discriminator}`);
                localStorage.setItem('id', data.id);
                LoadTickets();
            }
        });
}

document.getElementById('submit').addEventListener('click', () => {
    fetch('/ticket', {
        method: 'POST',
        body: JSON.stringify({ title: document.querySelector('.issue-title').value, description: document.querySelector('.issue-desc').value }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('cancel').click();
                document.getElementById('open-ticket').click();     
            }
        });
});

getUserInfo();

function LoadTickets() {
    document.querySelector('.all-tickets').innerHTML = '<span class="loader"></span>';
    fetch('/ticket/get/open', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.querySelector('.all-tickets').innerHTML = '';
                data.forEach(ticket => {
                    getUserInfo
                    const ticketDiv = document.createElement('div');
                    ticketDiv.setAttribute('onclick', `openTicket("${ticket._id}")`);
                    ticketDiv.classList.add('ticket');
                    ticketDiv.innerHTML = `
                    <div class="infos-ticket">
                        <img class="ticket-type-img" src="./assets/issue-ir.svg">
                        <h3>Ticket ${ticket._id}<span class="ticket-type">General Inqueries</span></h3>
                        <img class="dots-ticket" src="./assets/dots.svg">
                    </div>
                    <h2 class="ticket-title">${ticket.title}</h2>
                    <p class="ticket-description">${ticket.description}</p>
                    <div class="ticket-footer">
                        <div class="details">
                            <div class="detail">
                                <img src="./assets/chrono.svg">
                                <h4 class="detail-text">8h ago</h4>
                            </div>
                            <div class="detail">
                                <img src="./assets/chat.svg">
                                <h4 class="detail-text">12</h4>
                            </div>
                        </div>
                    </div>`
                    document.querySelector('.all-tickets').appendChild(ticketDiv);
                });
            }
            refreshInteract();
        });
}

document.getElementById('close-ticket').addEventListener('click', () => {
    if (confirm('Are you sure you want to close this ticket ?')) {
    fetch('/ticket/close', {
        method: 'PATCH',
        body: JSON.stringify({ ticketId: localStorage.getItem('ticketId') }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('closed').click();
                document.getElementById('open-ticket').click();
            }
        });
    }
});


document.getElementById('closed-ticket').addEventListener('click', () => {
    document.querySelector('.all-tickets').innerHTML = '<span class="loader"></span>';
    fetch('/ticket/get/closed', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.querySelector('.all-tickets').innerHTML = '';
                data.forEach(ticket => {
                    const ticketDiv = document.createElement('div');
                    ticketDiv.setAttribute('onclick', `openTicket("${ticket._id}")`);
                    ticketDiv.classList.add('ticket');
                    ticketDiv.innerHTML = `
                    <div class="infos-ticket">
                        <img class="ticket-type-img" src="./assets/issue-ir.svg">
                        <h3>Ticket ${ticket._id}<span class="ticket-type">General Inqueries</span></h3>
                        <img class="dots-ticket" src="./assets/dots.svg">
                    </div>
                    <h2 class="ticket-title">${ticket.title}</h2>
                    <p class="ticket-description">${ticket.description}</p>
                    <div class="ticket-footer">
                        <div class="details">
                            <div class="detail">
                                <img src="./assets/chrono.svg">
                                <h4 class="detail-text">8h ago</h4>
                            </div>
                            <div class="detail">
                                <img src="./assets/chat.svg">
                                <h4 class="detail-text">12</h4>
                            </div>
                        </div>
                    </div>`
                    document.querySelector('.all-tickets').appendChild(ticketDiv);
                });
                refreshInteract();
            }
        });
});


document.querySelector('.close-modal-infos').addEventListener('click', () => {
    document.querySelector('.messages-container').style.display = 'block';
});

/* MANAGE ALL INTERACTIONS */
const todp = {
    'new-case': ['display-new-case'],
    'cancel': ['display-tickets'],
    'closed': ['display-tickets', 'selector', 'selector-active'],
    'infos': ['infos-modal'],
    'close-discord-infos': ['row-user-inputs'],
    'my-tickets': ['tickets'],
}
const hide = {
    'new-case': ['display-tickets'],
    'cancel': ['display-new-case'],
    'closed': ['display-messages', 'infos-modal'],
    'infos': ['messages-container', 'row-user-inputs'],
    'close-discord-infos': ['infos-modal'],
    'my-tickets': ['article'],
}

const optionnal = {
    'my-tickets': ['toggleLateral'],
}


let Boolean = false
function toggleLateral() {
    Boolean = !Boolean
    let angle = Boolean ? 180 : 0
    console.log(angle)
    document.querySelector('.open-icon').style.transform = `rotate(${angle}deg)`;
    document.querySelector('.lateral-menu').classList.toggle('open-lateral')
}

toggleLateral()
function removeListeners() {
    let elements = document.querySelectorAll('.interact');
    elements.forEach(function (element) {
        element.removeEventListener('click', onClick);
    });
}

function onClick() {
    // Do something when the element is clicked
}

let elements = document.querySelectorAll('.interact');
elements.forEach(function (element) {
    element.addEventListener('click', onClick);
});



function removeListeners() {
    let elements = document.querySelectorAll('.interact');
    elements.forEach(function (element) {
        element.removeEventListener('click', interactClick);
    });
}

function interactClick(e) {
    let id = e.target.id;
    let parent = e.target.parentElement;
    while (parent && !parent.classList.contains('interact')) {
        parent = parent.parentElement;
    }
    if (parent) {
        id = parent.id;
    }
    console.log(todp[id])
    todp[id].forEach(function (className) {
        document.querySelector(`.${className}`).style.display = 'flex'
    })
    hide[id].forEach(function (className) {
        document.querySelector(`.${className}`).style.display = 'none'
    })
    if (optionnal[id]) {
        optionnal[id].forEach(function (className) {
            window[className]()
        })
    }
}

function refreshInteract() {
    removeListeners();
    let elements = document.querySelectorAll('.interact');
    elements.forEach(function (element) {
        element.addEventListener('click', interactClick);
    });
}



/* MANAGE ALL INTERACTIONS */

function openTicket(id) {
    document.querySelector('.selector').style.display = 'none';
    document.querySelector('.selector-active').style.display = 'none';
    document.querySelector('.messages-container').style.display = 'none';
    document.getElementById('auto').style.display = 'flex';
    document.querySelector('.row-user-inputs').style.display = 'flex';
    document.querySelector('.display-tickets').style.display = 'none';
    document.querySelector('.display-messages').style.display = 'flex';
    fetch(`/ticket/get/infos/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('ticketId', data._id);
        localStorage.setItem('ticketIdCreator', data.owner);
        fetch('/api/discord/get', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: data.owner })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.banner) {
                    console.log('banner');
                    document.querySelector('.banner').style.backgroundImage = `url("https://cdn.discordapp.com/banners/${data.id}/${data.banner}.png?size=600")`
                } else {
                    console.log('color');
                    document.querySelector('.banner').style.backgroundColor = `${data.banner_color ? data.banner_color : '#7289da'}`;
                } 
                document.querySelector('.user-ticket-info-avatar').src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=128`;
                document.querySelector('.user-ticket-info-name').innerHTML = data.username;
                document.querySelector('.user-ticket-info-discriminator').innerHTML = `#${data.discriminator}`;
                registerSocket();
                LoadMessages(data);
            });
        document.querySelector('.ticket-desc').innerHTML = data.title;
        document.querySelector('.ticket-user-desc').innerHTML = data.description;
        if (data.open == false) {
            document.querySelector('.row-user-inputs').style.display = 'none';
        }
    });
}

document.getElementById('open-ticket').addEventListener('click', () => {
    LoadTickets();
});



document.querySelector('.send-button').addEventListener('click', () => {
    sendMessage();
    document.querySelector('.message-input').value = '';
    if(document.querySelector('.type-message')) {
        document.querySelector('.type-message').remove();
    }
});

document.querySelector('.message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
        document.querySelector('.message-input').value = '';
        if(document.querySelector('.type-message')) {
            document.querySelector('.type-message').remove();
        }
    }
});

function sendMessage() {
    const content = document.querySelector('.message-input').value;
    const ticketId = localStorage.getItem('ticketId');
    if (content != '' || content != ' ' || content != '\n') {
        fetch('/ticket/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticketId, content })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                }
                if (document.querySelector('.type-message')) document.querySelector('.type-message').remove();
            });
    }
}

function LoadMessages(userInfos) {
    const ticketId = localStorage.getItem('ticketId');
    fetch(`/ticket/messages`, {
        method: 'POST',
        body: JSON.stringify({ ticketId }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll('.messages').forEach(message => {
                message.remove();
            });
            introMessage = document.createElement('div');
            introMessage.classList.add('messages');
            introMessage.innerHTML = `
            <div class="left-message">
                <img src="./assets/logo.svg" class="conv-icons">
                <div id="intro-message" class="left-box">Dear ${localStorage.getItem('username')}, we received your ticket and we will answer you as soon as possible. The current waiting time is 2h. Thank you for your patience. Feel free to add element in the meantime !</div>
            </div>`;
            document.querySelector('.messages-container').appendChild(introMessage);
            data.forEach(message => {
                if (message.owner != localStorage.getItem('ticketIdCreator')) {
                    document.querySelector('.messages-container').innerHTML += `
                    <div class="messages">
                        <div class="left-message">
                            <img src="./assets/logo.svg" class="conv-icons">
                            <div class="left-box">${message.content}</div>
                        </div>
                    </div>
                    `;
                } else {
                    document.querySelector('.messages-container').innerHTML += `
                    <div class="messages">
                        <div class="right-message">
                            <img src="https://cdn.discordapp.com/avatars/${userInfos.id}/${userInfos.avatar}.png?size=128" class="conv-icons">
                            <div class="right-box">${message.content}</div>
                        </div>
                    </div>
                    `;
                }  
        });
        document.getElementById('auto').style.display = 'none';
        document.querySelector('.messages-container').style.display = 'block';
        document.querySelector('.messages-container').scrollTo(0, document.querySelector('.messages-container').scrollHeight);
    });
}

