const base = "@";
const text = "mvdusr";
const typeDelay = 130;
const deleteDelay = 90;
const pauseAfterType = 2400;
const pauseAfterDelete = 600;

let i = 0;
let isDeleting = false;

function updateTitle() {
    const current = text.substring(0, i);
    document.title = base + current;

    if (!isDeleting) {
        if (i < text.length) {
            i++;
            setTimeout(updateTitle, typeDelay);
        } else {
            isDeleting = true;
            setTimeout(updateTitle, pauseAfterType);
        }
    } else {
        if (i > 0) {
            i--;
            setTimeout(updateTitle, deleteDelay);
        } else {
            isDeleting = false;
            setTimeout(updateTitle, pauseAfterDelete);
        }
    }
}

updateTitle();
