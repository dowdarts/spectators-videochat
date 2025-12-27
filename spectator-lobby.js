const liveListEl = document.getElementById('liveList');
const statusEl = document.getElementById('status');
const refreshBtn = document.getElementById('refreshBtn');

// Point to the spectator viewer (we preserved the old viewer as viewer.html)
const spectatorBase = `${window.location.origin}/viewer.html`;

function formatAgo(isoString) {
    const created = new Date(isoString);
    const diffMin = Math.max(0, Math.round((Date.now() - created.getTime()) / 60000));
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const hours = Math.floor(diffMin / 60);
    return `${hours}h ago`;
}

function renderRooms(rooms) {
    liveListEl.innerHTML = '';

    if (!rooms || rooms.length === 0) {
        liveListEl.innerHTML = '<div class="empty">No active calls right now. Start a call in the participants app to see it here.</div>';
        statusEl.textContent = 'No active calls';
        return;
    }

    rooms.forEach((room) => {
        const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h3');
        title.textContent = `Room ${room.room_code}`;

        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.innerHTML = `<span>🔴 Live</span><span>${formatAgo(room.created_at)}</span>`;

        const watchBtn = document.createElement('button');
        watchBtn.className = 'btn watch-btn';
        watchBtn.textContent = '👁 Watch Call';
        watchBtn.addEventListener('click', () => handleWatch(room.room_code));

        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(watchBtn);
        liveListEl.appendChild(card);
    });

    statusEl.textContent = `${rooms.length} active ${rooms.length === 1 ? 'call' : 'calls'}`;
}

async function fetchLiveRooms() {
    statusEl.textContent = 'Loading...';
    liveListEl.innerHTML = '';

    const { data, error } = await supabaseClient
        .from('rooms')
        .select('room_code, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading rooms', error);
        statusEl.textContent = 'Error loading calls';
        liveListEl.innerHTML = '<div class="empty error">Failed to load active calls. Please refresh.</div>';
        return;
    }

    renderRooms(data || []);
}

async function handleWatch(roomCode) {
    try {
        statusEl.textContent = `Joining room ${roomCode}`;
        const token = Math.random().toString(36).substring(2, 12);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const { error } = await supabaseClient
            .from('spectators')
            .insert([{
                room_code: roomCode,
                spectator_token: token,
                created_at: new Date(),
                expires_at: expiresAt
            }]);

        if (error) throw error;

        const target = `${spectatorBase}?roomCode=${roomCode}&token=${token}`;
        window.location.href = target;
    } catch (err) {
        console.error('Error joining as spectator', err);
        statusEl.textContent = 'Error joining room';
    }
}

refreshBtn.addEventListener('click', fetchLiveRooms);
document.addEventListener('DOMContentLoaded', fetchLiveRooms);
