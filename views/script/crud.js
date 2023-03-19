let socketListener;
localStorage.setItem('status', 'open')
function registerSocket() {
    if (socketListener) {
        socketListener.off();
    }
    const socket = io();
    socketListener = socket.on(`${localStorage.getItem('ticketId')}-newMessage`, (message) => {
        user = message.user;
        message = message.message;
        if (message.type != 'default') {
            if (message.type == 'alert') {
                document.querySelector('.messages-container').innerHTML += `
                <div class="outline alert-chat" id="chat-alert">
                    <div class="alert">
                        <img src="./assets/alert.svg" class="message-alert">${message.content}</div>
                </div>
            `;
            } else if (message.type == 'discord') {
                document.querySelector('.messages-container').innerHTML += `
                <div class="discord">
                <div class="discord-box">
                    <img src="./assets/t_black.svg" class="discord-icon">
                    <div class="guild-infos">
                        <h3 class="guild-title">Teranga Industries</h3>
                        <p class="guild-desc">General topics, economy</p>
                    </div>
                    <button onclick="window.location.href='https://discord.gg/zep4CBfd';" class="join-server">Join</button>
                </div>
                <div class="discord-box">
                    <img src="./assets/t_blueprint.svg" class="discord-icon">
                    <div class="guild-infos">
                        <h3 class="guild-title">Teranga Blueprint</h3>
                        <p class="guild-desc">General topics, mutual aid</p>
                    </div>
                    <button onclick="window.location.href='https://discord.gg/85KS5fx5s3';" class="join-server">Join</button>
                </div>
                <div class="discord-box">
                    <img src="./assets/t_dev.svg" class="discord-icon">
                    <div class="guild-infos">
                        <h3 class="guild-title">Teranga Dev</h3>
                        <p class="guild-desc">Follow the development</p>
                    </div>
                    <button onclick="window.location.href='https://discord.gg/zep4CBfd';" class="join-server">Join</button>
                </div>
            </div>
            `;
            }
        } else if (message.owner != localStorage.getItem('ticketIdCreator')) {
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
            console.log('Cannot send typing request')
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
            if (data.admin === true) {
                document.getElementById('qa').style.display = 'flex';
            }
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
                LoadTickets("open");
            }
        });
}

document.getElementById('submit').addEventListener('click', () => {
    fetch('/ticket', {
        method: 'POST',
        body: JSON.stringify({ title: document.querySelector('.issue-title').value, description: document.querySelector('.issue-desc').value, category: localStorage.getItem('category') }),
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

const iconsReference = {
    'gi': './assets/issue-gi.svg',
    'ir': './assets/issue-ir.svg',
    'pi': './assets/issue-pi.svg',
    'bb': './assets/issue-bb.svg'
}

const categories = {
    'gi': 'General Issue',
    'ir': 'Incident / report',
    'pi': 'Payement Issue',
    'bb': 'Breach / Bug'
}

function LoadTickets(status) {
    console.log(status)
    localStorage.setItem('status', status)
    document.querySelector('.all-tickets').innerHTML = '<span class="loader"></span>';
    fetch('/ticket/get', {
        method: 'POST',
        body: JSON.stringify({status: status, sorting: localStorage.getItem('sorting')}),
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
                        <img class="ticket-type-img" src="${iconsReference[ticket.category]}">
                        <h3>Ticket ${ticket._id}<span class="ticket-type">${categories[ticket.category]}</span></h3>
                        <img class="dots-ticket" src="./assets/dots.svg">
                    </div>
                    <h2 class="ticket-title">${ticket.title}</h2>
                    <p class="ticket-description">${ticket.description}</p>`
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




document.querySelector('.close-modal-infos').addEventListener('click', () => {
    document.querySelector('.messages-container').style.display = 'block';
});

/* MANAGE ALL INTERACTIONS */
const todp = {
    'new-case': ['display-new-case'],
    'close-post': ['ic-container'],
    'post': ['open-post-container'],
    'cancel': ['display-tickets'],
    'closed': ['display-tickets', 'selector', 'selector-active'],
    'infos': ['infos-modal'],
    'close-discord-infos': ['row-user-inputs'],
    'my-tickets': ['tickets', 'display-tickets', 'selector', 'selector-active'],
    'new-case-button': ['display-new-case', 'tickets', 'selector', 'selector-active'],
}
const hide = {
    'close-post': ['open-post-container'],
    'new-case': ['display-tickets'],
    'post': ['ic-container'],
    'cancel': ['display-new-case'],
    'closed': ['display-messages', 'infos-modal'],
    'infos': ['messages-container', 'row-user-inputs'],
    'close-discord-infos': ['infos-modal'],
    'my-tickets': ['article', 'ideasCenter', 'display-new-case', 'display-messages', 'infos-modal'],
    'new-case-button': ['display-tickets', 'article', 'ideasCenter', 'display-messages', 'infos-modal'],
}

const optionnal = {
    'my-tickets': ['toggleLateral'],
    'new-case-button': ['toggleLateral'],
}


let Boolean = false
function toggleLateral() {
    Boolean = !Boolean
    let angle = Boolean ? 180 : 0
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
    document.querySelector('.ideasCenter').style.display = 'none';
    document.querySelector('.selector').style.display = 'none';
    document.querySelector('.selector-active').style.display = 'none';
    document.querySelector('.messages-container').style.display = 'none';
    document.getElementById('auto').style.display = 'flex';
    document.querySelector('.row-user-inputs').style.display = 'flex';
    document.querySelector('.display-tickets').style.display = 'none';
    document.querySelector('.display-messages').style.display = 'flex';
    document.getElementById('close-ticket').style.display = 'flex';
    fetch(`/ticket/get/infos/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('.ticket-badge').src = `${iconsReference[data.category]}`;
        localStorage.setItem('ticketId', data._id);
        localStorage.setItem('ticketIdCreator', data.owner);
        fetch('/api/discord/get', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: data.owner })
        })
            .then(response => response.json())
            .then(data => {
                if (data.banner) {
                    document.querySelector('.banner').style.backgroundImage = `url("https://cdn.discordapp.com/banners/${data.id}/${data.banner}.png?size=600")`
                } else {
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
            document.getElementById('close-ticket').style.display = 'none';
        }
    });
}


function onClick(e) {
}


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
            document.querySelectorAll('.alert-chat').forEach(alert => {
                alert.remove();
            });
            document.querySelectorAll('.discord').forEach(discord => {
                discord.remove();
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
                if (message.type != 'default') {
                    if (message.type == 'alert') {
                        document.querySelector('.messages-container').innerHTML += `
                        <div class="outline alert-chat" id="chat-alert">
                            <div class="alert">
                                <img src="./assets/alert.svg" class="message-alert">${message.content}</div>
                        </div>
                    `;
                    } else if (message.type == 'discord') {
                        document.querySelector('.messages-container').innerHTML += `
                        <div class="discord">
                            <div class="discord-box">
                                <img src="./assets/t_black.svg" class="discord-icon">
                                <div class="guild-infos">
                                    <h3 class="guild-title">Teranga Industries</h3>
                                    <p class="guild-desc">General topics, economy</p>
                                </div>
                                <button onclick="window.location.href='https://discord.gg/zep4CBfd';" class="join-server">Join</button>
                            </div>
                            <div class="discord-box">
                                <img src="./assets/t_blueprint.svg" class="discord-icon">
                                <div class="guild-infos">
                                    <h3 class="guild-title">Teranga Blueprint</h3>
                                    <p class="guild-desc">General topics, mutual aid</p>
                                </div>
                                <button onclick="window.location.href='https://discord.gg/85KS5fx5s3';" class="join-server">Join</button>
                            </div>
                            <div class="discord-box">
                                <img src="./assets/t_dev.svg" class="discord-icon">
                                <div class="guild-infos">
                                    <h3 class="guild-title">Teranga Dev</h3>
                                    <p class="guild-desc">Follow the development</p>
                                </div>
                                <button onclick="window.location.href='https://discord.gg/zep4CBfd';" class="join-server">Join</button>
                            </div>
                        </div>
                    `;
                    }
                } else if (message.owner != localStorage.getItem('ticketIdCreator')) {
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

function getTrendings() {
    fetch('/articles/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.results');
            data.forEach(article => {
                const h3 = document.createElement('h3');
                h3.classList.add('recommended');
                h3.innerHTML = article.title;
                h3.setAttribute('onclick', `openArticle('${article._id}')`);
                container.appendChild(h3);
            });
        });
}

getTrendings();

function openArticle(id) {
    toggleLateral();
    fetch(`/articles/get/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('.article').innerHTML = '';
        const articleContainer = document.querySelector('.article');
        document.querySelector('.tickets').style.display = 'none';
        document.querySelector('.ideasCenter').style.display = 'none';
        document.querySelector('.article').style.display = 'block';
        title = document.createElement('h1');
        title.classList.add('art-title');
        title.innerHTML = data.title;
        articleContainer.appendChild(title);
        description = document.createElement('h3');
        description.classList.add('art-lower-title');
        description.innerHTML = data.description;
        articleContainer.appendChild(description);
        for (let key in data.content) {
            switch (key) {
                case 'youtube':
                    const div = document.createElement('div');
                    div.classList.add('video-container');
                    div.id = 'ytb-responsive';
                    div.innerHTML = `<iframe width="560" height="315" src="${data.content[key]}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    articleContainer.appendChild(div);
                    break;
                case 'paragraph':
                    const text = document.createElement('p');
                    text.classList.add('art-paragraph');
                    text.innerHTML = data.content[key];
                    articleContainer.appendChild(text);
                    break;
                case 'image':
                    const img = document.createElement('img');
                    img.classList.add('art-img');
                    img.src = data.content[key];
                    articleContainer.appendChild(img);
                    break;
                case 'alert':
                    const alert = document.createElement('div');
                    alert.classList.add('outline');
                    alert.id = 'margin-low';
                    alert.innerHTML = `<div class="alert"><img src="./assets/alert.svg" class="message-alert">${data.content[key]}</div>`
                    articleContainer.appendChild(alert);
            }
        };
    });
}

document.querySelector('.search-bar').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        search();
    }
});

function search() {
    const search = document.querySelector('.search-bar').value;
    fetch(`/articles/search`, {
        method: 'POST',
        body: JSON.stringify({ search }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('.results').innerHTML = '';
        data.forEach(article => {
            const h3 = document.createElement('h3');
            h3.classList.add('recommended');
            h3.innerHTML = article.title;
            h3.setAttribute('onclick', `openArticle('${article._id}')`);
            document.querySelector('.results').appendChild(h3);
        });
    });
}

document.querySelectorAll('.options > button').forEach(option => {
    option.addEventListener('click', () => {
        if (option.id == 'notification') {
            let message = prompt('Specify the notification message', 'Hello there, we want to let you know that you received a new message on the teranga help center.');
            if (message == null) {
                return;
            }
            fetch('/ticket/notification', {
                method: 'POST',
                body: JSON.stringify({ receiverId: localStorage.getItem('ticketIdCreator') , message: message }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if(!data.message) {
                    alert('An error occured, please try again later.');
                } else {
                    alert(data.message);
                }
            });
        } else if (option.id == 'add-alert') {
            let alert = prompt('Specify the alert message');
            if (alert == null) {
                return;
            }
            fetch('/ticket/message', {
                method: 'POST',
                body: JSON.stringify({ ticketId: localStorage.getItem('ticketId'), content: alert, type: 'alert' }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if(!data.message) {
                    alert('An error occured, please try again later.');
                } else {
                    alert(data.message);
                }
            });
        } else if (option.id  = 'discord') {
            fetch('/ticket/message', {
                method: 'POST',
                body: JSON.stringify({ ticketId: localStorage.getItem('ticketId'), content: "Sent by the Teranga Team", type: 'discord' }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if(!data.message) {
                    alert('An error occured, please try again later.');
                } else {
                    alert(data.message);
                }
            });
        }
    });
});

document.querySelectorAll('.dropdown-content').forEach(content => {
    content.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.classList.remove('open-modal');
        });
    });
});

function openIdeas() {
    toggleLateral();
    document.querySelector('.tickets').style.display = 'none';
    document.querySelector('.article').style.display = 'none';
    document.querySelector('.ideasCenter').style.display = 'flex';
    fetch('/post', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            document.querySelector('.newest').innerHTML = '';
            document.querySelector('.trending').innerHTML = '';
            data.forEach(post => {
                const div = document.createElement('div');
                div.setAttribute('onclick', `openPost('${post._id}')`);
                div.setAttribute('id', "post");
                div.classList.add('post', 'interact');
                div.innerHTML = `<div class="post-infos"><h3>${post.title}</h3><h4>${post.description}</h4></div><p>${post.votes}</p>`
                document.querySelector('.newest').appendChild(div);
            });
            refreshInteract();
        });
}

function openPost(id) {
    fetch(`/post/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            document.querySelector('.post-content > h1').innerHTML  = data.title;
            document.querySelector('.post-content > h3').innerHTML  = data.description;
            fetch('/api/discord/get', {
                method: 'POST',
                body: JSON.stringify({ id: data.owner }),
                headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(infos => {
                    document.querySelector('.post-user-avatar').src = `https://cdn.discordapp.com/avatars/${infos.id}/${infos.avatar}.png`;
                    document.querySelector('.post-user-name').innerHTML = infos.username;

                });
        });
}