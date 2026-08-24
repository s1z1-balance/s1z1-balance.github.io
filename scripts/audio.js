const bgAudio = document.getElementById('bg');

async function initAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0.8;
}

initAudio();
