const DISCORD_USER_ID = '1273543576155979834';

const avatarImg = document.getElementById('avatar-img');
const statusBadge = document.getElementById('status-badge');
const phraseEl = document.getElementById('phrase');

function updatePresence(data) {
    if (!data) return;

    const user = data.discord_user;
    const status = data.discord_status || 'offline';

    // Update status badge
    if (statusBadge) {
        statusBadge.className = `status-badge ${status}`;
        statusBadge.title = status.charAt(0).toUpperCase() + status.slice(1);
    }

    // Update avatar with gif support
    if (avatarImg && user && user.avatar) {
        const ext = user.avatar.startsWith('a_') ? 'gif' : 'webp';
        avatarImg.src = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${user.avatar}.${ext}?size=256`;
    }

    // Optional: reflect custom discord status text if present, otherwise default phrase
    if (phraseEl) {
        const customActivity = data.activities ? data.activities.find(a => a.type === 4) : null;
        if (customActivity && customActivity.state) {
            phraseEl.textContent = customActivity.state;
        } else {
            phraseEl.textContent = 'idk';
        }
    }
}

// REST initial fetch
async function fetchLanyardRest() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (json.success && json.data) {
            updatePresence(json.data);
        }
    } catch (e) {
        console.warn('Lanyard REST fetch failed, using fallback assets', e);
    }
}

// WebSocket live connection
function initLanyardWebSocket() {
    let socket;
    let heartbeatInterval;

    function connect() {
        socket = new WebSocket('wss://api.lanyard.rest/socket');

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                const { op, d, t } = message;

                if (op === 1) { // Hello
                    heartbeatInterval = setInterval(() => {
                        if (socket.readyState === WebSocket.OPEN) {
                            socket.send(JSON.stringify({ op: 3 }));
                        }
                    }, d.heartbeat_interval);

                    socket.send(JSON.stringify({
                        op: 2,
                        d: {
                            subscribe_to_id: DISCORD_USER_ID
                        }
                    }));
                } else if (op === 0) { // Event
                    if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
                        updatePresence(d);
                    }
                }
            } catch (err) {
                console.error('Lanyard WS parse error', err);
            }
        };

        socket.onclose = () => {
            clearInterval(heartbeatInterval);
            setTimeout(connect, 5000);
        };

        socket.onerror = () => {
            socket.close();
        };
    }

    connect();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLanyardRest();
    initLanyardWebSocket();
});
