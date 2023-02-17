let socketListener;

function registerSocket() {
    if (socketListener) {
        socketListener.off();
    }
    const socket = io();
    socketListener = socket.on(`${localStorage.getItem('ticketId')}-newMessage`, (message) => {
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
                    <img src="${localStorage.getItem('avatar')}" class="conv-icons">
                    <div class="right-box">${message.content}</div>
                </div>
            </div>`;
        }
        document.querySelector('.messages-container').scrollTo(0, document.querySelector('.messages-container').scrollHeight);
    });
    let isTyping = false;

    socket.on(`${localStorage.getItem('ticketId')}-typing`, (user) => {
        user = user.user;
    if (user !== localStorage.getItem('id')) {
        if (!isTyping) {
        const typingMessage = `
            <div class="messages typing">
            <div class="left-message">
                <img src="./assets/logo.svg" class="conv-icons">
                <div class="left-box type-message"><span class="loader-typing"></span></div>
            </div>
            </div>`;
        document.querySelector('.messages-container').insertAdjacentHTML('beforeend', typingMessage);
        isTyping = true;
        setTimeout(() => {
            document.querySelector('.typing').remove();
            isTyping = false;
        }, 3000);
        document.querySelector('.messages-container').scrollTo(0, document.querySelector('.messages-container').scrollHeight);
        }
    }
    });
}



document.querySelector('.message-input').addEventListener('input', () => {
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
        }
    );
});


function getUserInfo() {
    fetch('/api/discord/infos', {
        method: 'POST',
        body: JSON.stringify({ access_token: document.cookie.split('=')[1] }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
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
                alert(data.message);
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
                refreshInteract();
            }
        });
}

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

/* MANAGE ALL INTERACTIONS */
reference = {
    'new-case': ['display-new-case'],
    'cancel': ['display-tickets'],
    'closed': ['display-tickets', 'selector', 'selector-active']
}
config = {
    'new-case': ['display-tickets'],
    'cancel': ['display-new-case'],
    'closed': ['display-messages']
}

function refreshInteract() {
    document.querySelectorAll('.interact').forEach(function (interact) {
        interact.addEventListener('click', function (e) {
            let id = e.target.id;
            let parent = e.target.parentElement;
            while (parent && !parent.classList.contains('interact')) {
                parent = parent.parentElement;
            }
            if (parent) {
                id = parent.id;
            }
            reference[id].forEach(function (className) {
                document.querySelector(`.${className}`).style.display = 'flex'
            })
            config[id].forEach(function (className) {
                document.querySelector(`.${className}`).style.display = 'none'
            })
        })
    }) 
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
        registerSocket();
        LoadMessages();
        document.querySelector('.ticket-desc').innerHTML = `${data.title}`;
        document.querySelector('.ticket-user-desc').innerHTML = `${data.description}`;
        if (data.open == false) {
            document.querySelector('.row-user-inputs').style.display = 'none';
        }
    });
}

document.getElementById('open-ticket').addEventListener('click', () => {
    LoadTickets();
});



document.querySelector('.message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
        document.querySelector('.message-input').value = '';
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
            });
    }
}

function LoadMessages() {
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
                            <img src="${localStorage.getItem('avatar')}" class="conv-icons">
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

