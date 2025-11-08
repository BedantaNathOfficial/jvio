// Get all necessary DOM elements
const toggleBtn = document.getElementById("theme-toggle");
const slides = document.querySelectorAll(".hero-slideshow img");
const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const albums = document.querySelectorAll(".album");

let isPlaying = false;
let slideIndex = 0;

// --- 1. THEME TOGGLE FUNCTIONALITY ---
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    // CRITICAL FIX: Ensure the button icon reflects the *new* state
    toggleBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});


// --- HERO SLIDESHOW FUNCTIONALITY WITH TEXT ---
const heroTitles = [
  "Feel the Beat, Create the Magic",
  "Music That Speaks from the Soul",
  "Where Dreams Turn Into Soundwaves",
  "Stories Told Through Songs and Melodies",
  "Listen to Life — Feel Every Note"
];

const heroSubtexts = [
  "Producer 🎸 + Singer 🎤 = Jvio Studio",
  "Bedanta Nath, known as Jvio or DJ Jvio, is an international music producer, artist, and DJ from India.",
  "Crafting emotions through the rhythm and harmony of electronic music fused with folk instruments.",
  "Your sound, your story — only at Jvio Studio. Experience the finest production and recording environment.",
  "We collect memories, colors, and melodies from around the world and transform them into soulful musical stories."
];


function changeSlide() {
  slides[slideIndex].classList.remove("active");
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");

  // Change hero text with a smooth fade
  const heroTitle = document.getElementById("hero-title");
  const heroSubtext = document.getElementById("hero-subtext");

  heroTitle.style.opacity = 0;
  heroSubtext.style.opacity = 0;

  setTimeout(() => {
    heroTitle.textContent = heroTitles[slideIndex];
    heroSubtext.textContent = heroSubtexts[slideIndex];
    heroTitle.style.opacity = 1;
    heroSubtext.style.opacity = 1;
  }, 400); // Smooth transition
}

setInterval(changeSlide, 5000); // every 5 seconds



// --- 3. AUDIO PLAYER CORE LOGIC ---
// Helper function to update the play/pause button state
function updatePlayButton(paused) {
    if (paused) {
        playBtn.textContent = "▶ Play";
        isPlaying = false;
    } else {
        playBtn.textContent = "⏸ Pause";
        isPlaying = true;
    }
}

// Helper function to reset all album indicators
function clearAlbumIndicators() {
    albums.forEach(album => album.classList.remove("playing"));
}

// Listen for when the audio finishes playing
audio.addEventListener('ended', () => {
    updatePlayButton(true);
    clearAlbumIndicators();
});

// Play/Pause button for the Hero section
playBtn.addEventListener("click", () => {
    if (!isPlaying) {
        // Set default song if none is loaded (only required the first time)
        if (!audio.src || audio.paused) {
            // **IMPORTANT:** Ensure 'assets/song1.mp3' exists
            audio.src = "assets/song1.mp3"; 
        }
        audio.play();
        updatePlayButton(false);
        
        // Highlight the first album since that is the default song
        clearAlbumIndicators();
        albums[0].classList.add('playing');

    } else {
        audio.pause();
        updatePlayButton(true);
    }
});

const progressBar = document.getElementById("progress-bar");

// Update progress bar as song plays
audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress || 0;
});

// Seek song when user drags the slider
progressBar.addEventListener("input", () => {
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});


// --- ALBUM CLICK PLAY FUNCTIONALITY WITH POPUP + ICONS ---
albums.forEach(album => {
  album.addEventListener("click", () => {
    const songPath = album.getAttribute("data-song");
    const songName = album.querySelector("p").textContent.trim();

    // Toggle play/pause for same song
    if (audio.src.includes(songPath) && isPlaying) {
      audio.pause();
      updatePlayButton(true);
      clearAlbumIndicators();
      document.querySelectorAll(".link-popup").forEach(p => p.remove());
      return;
    }

    // Play new song
    audio.src = songPath;
    audio.play();
    updatePlayButton(false);
    clearAlbumIndicators();
    album.classList.add("playing");

    // Remove old popups
    document.querySelectorAll(".link-popup").forEach(p => p.remove());

    // Create new popup
    const popup = document.createElement("div");
    popup.className = "link-popup";
    popup.innerHTML = `
      <div class="icon-links">
        <a href="https://open.spotify.com/artist/4f6aYY24qfKmDSvzimAkhL?si=4GWfc3GSTIimahtp2CaM6Q" target="_blank" title="Listen on Spotify"><i class="fab fa-spotify"></i></a>
        <a href="https://www.youtube.com/channel/UCqY5sLrHFxva9DGiTuZnO7Q" target="_blank" title="Listen on YouTube Music"><i class="fab fa-youtube"></i></a>
        <a href="https://music.amazon.com/artists/B08ND6W586/jvio" target="_blank" title="Listen on Amazon Music"><i class="fab fa-amazon"></i></a>
      </div>
    `;
    album.appendChild(popup);
  });
});


