function getUserInfo() {
    fetch('/api/discord/infos', {
        method: 'POST',
        body: JSON.stringify({ access_token: document.cookie.split('=')[1] }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=839526461349822485&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord&response_type=code&scope=identify%20guilds%20email';
            } else {
                document.querySelector('.user-logo').src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
                document.getElementById('user-name').innerHTML = `${data.username}#${data.discriminator}`;
            }
        });
}

getUserInfo();