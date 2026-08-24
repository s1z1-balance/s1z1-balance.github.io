const player = document.querySelector('.player');
const audio = document.getElementById('bg');
const playBtn = player ? player.querySelector('.play') : null;
const fill = player ? player.querySelector('.fill') : null;
const curTimeEl = player ? player.querySelector('.time.current') : null;
const totalTimeEl = player ? player.querySelector('.time.total') : null;
const seekArea = player ? player.querySelector('.seek') : null;

function fmt(t) {
    if (isNaN(t) || !isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

if (audio && player) {
    audio.addEventListener('loadedmetadata', () => {
        if (totalTimeEl) totalTimeEl.textContent = fmt(audio.duration);
    });

    audio.addEventListener('durationchange', () => {
        if (totalTimeEl) totalTimeEl.textContent = fmt(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        if (curTimeEl) curTimeEl.textContent = fmt(audio.currentTime);
        if (fill && audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            fill.style.width = `${pct}%`;
        }
    });

    audio.addEventListener('play', () => {
        if (playBtn) playBtn.classList.add('playing');
    });

    audio.addEventListener('pause', () => {
        if (playBtn) playBtn.classList.remove('playing');
    });

    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (audio.paused) {
                audio.play().catch(console.error);
            } else {
                audio.pause();
            }
        });
    }

    if (seekArea) {
        let isDragging = false;

        function updateSeek(e) {
            const bar = seekArea.querySelector('.bar');
            const rect = bar.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let pos = (clientX - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));
            if (fill) fill.style.width = `${pos * 100}%`;
            if (audio.duration) {
                audio.currentTime = pos * audio.duration;
            }
        }

        seekArea.addEventListener('click', updateSeek);

        seekArea.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSeek(e);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateSeek(e);
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        seekArea.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSeek(e);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isDragging) {
                updateSeek(e);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
}
