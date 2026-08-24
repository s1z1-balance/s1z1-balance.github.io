document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('blurOverlay');
    const wrap = document.querySelector('.wrap');
    const audio = document.getElementById('bg');

    if (!overlay) return;

    function handleEnter() {
        overlay.classList.add('hidden');
        if (wrap) {
            setTimeout(() => wrap.classList.add('moved'), 50);
        }

        if (audio) {
            audio.muted = false;
            audio.play().catch((err) => {
                console.log('Audio autoplay prevented:', err);
            });
        }

        overlay.removeEventListener('click', handleEnter);
        overlay.removeEventListener('touchstart', handleEnter);
    }

    overlay.addEventListener('click', handleEnter);
    overlay.addEventListener('touchstart', handleEnter, { passive: true });
});
