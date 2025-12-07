const base="bio ";const text="@mvdusr";const delay=200;const pause=1000;let i=0;let isDeleting=false;function updateTitle(){if(!isDeleting){i++;document.title=base+text.substring(0,i);if(i===text.length){isDeleting=true;setTimeout(updateTitle,pause);return;}}else{i--;document.title=base+text.substring(0,i);if(i===0){isDeleting=false;}}
setTimeout(updateTitle,delay);}
updateTitle();