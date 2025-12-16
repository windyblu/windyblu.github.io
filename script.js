/* --- Robust Music Player Logic --- */
const songs = [
    { 
        title: "Into The Unknown", 
        artist: "Aurora", 
        src: "music/itu.mp3" 
    },
    { 
        title: "Billie Jean", 
        artist: "Michael Jackson", 
        src: "music/billie-jean.mp3" 
    },
    { 
        title: "Chill BGM", 
        artist: "Tarak Mehta Ka Ooltah Chashmah", 
        src: "music/tmkoc-bgm.mp3" 
    },
    { 
        title: "Smooth Criminal", 
        artist: "Michael Jackson", 
        src: "music/smooth-criminal.mp3" 
    }
];
let currentSongIndex = 0;

const audioPlayer = document.getElementById('audio-player');
const titleEl = document.getElementById('song-title');
const artistEl = document.getElementById('song-artist');
const playBtn = document.getElementById('play-btn');
function loadSong(index) {
    const song = songs[index];
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    audioPlayer.src = song.src;
    // NOTE: We do NOT automatically play here to avoid unwanted noise on load
}
// Initial load
loadSong(currentSongIndex);
/* 
   --- CRITICAL FIX: Event-Driven UI Updates ---
   We update the button text ONLY when the audio state *actually* changes.
   This prevents the button from getting "stuck" if the play request fails 
   or if the song ends.
*/
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        // Attempt to play. catch() handles missing files gracefully.
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Playback failed (missing file?):", error);
                // No need to revert text here manually, 
                // because the 'play' event below won't fire if this fails.
            });
        }
    } else {
        audioPlayer.pause();
    }
});
// 1. When audio actually starts playing
audioPlayer.addEventListener('play', () => {
    playBtn.textContent = "pause";
});
// 2. When audio actually pauses
audioPlayer.addEventListener('pause', () => {
    playBtn.textContent = "play";
});
// 3. When song ends (auto-play next)
audioPlayer.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play().catch(e => console.error(e));
});
// Next Button
document.getElementById('next-btn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play().catch(e => console.error("Next song play failed", e));
});
// Prev Button
document.getElementById('prev-btn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play().catch(e => console.error("Prev song play failed", e));
});
/* --- Art Lightbox Logic --- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeIcon = document.getElementById('lightbox-close-icon');
document.querySelectorAll('.art-placeholder').forEach(box => {
    box.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const fullRes = box.getAttribute('data-full');
        lightboxImg.src = fullRes;
        lightbox.style.display = 'flex';
    });
});
const closeLightbox = () => {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
};
closeIcon.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});