const playlistSongs = document.getElementById("playlist-songs");
const queueList = document.getElementById("queue-list");
const playPauseButton = document.getElementById("play-pause"); // Single button
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const loopButton = document.getElementById("loop");
const searchInput = document.getElementById("search-songs");
const volumeSlider = document.querySelector('.volume-slider');
const volumeDisplay = document.getElementById('volume-display');
const trackCount = document.getElementById('track-count');
const playerStatus = document.getElementById('player-status');
const footerStatus = document.getElementById('footer-status');
const loopStatus = document.getElementById('loop-status');
const footerLoop = document.getElementById('footer-loop');

const allSongs = [
    {
        id: 0,
        title: "Scratching The Surface",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "4:25",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
    },
    {
        id: 1,
        title: "Can't Stay Down",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "4:15",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
    },
    {
        id: 2,
        title: "Still Learning",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "3:51",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
    },
    {
        id: 3,
        title: "Cruising for a Musing",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "3:34",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
    },
    {
        id: 4,
        title: "Never Not Favored",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "3:35",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
    },
    {
        id: 5,
        title: "From the Ground Up",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "3:12",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
    },
    {
        id: 6,
        title: "Walking on Air",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "3:25",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
    },
    {
        id: 7,
        title: "Can't Stop Me. Can't Even Slow Me Down.",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "3:52",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
    },
    {
        id: 8,
        title: "The Surest Way Out is Through",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "3:10",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
    },
    {
        id: 9,
        title: "Chasing That Feeling",
        artist: "Quincy Larson",
        album: "Learning to Code",
        duration: "2:43",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
    },
];

const audio = new Audio();
let userData = {
    songs: [...allSongs],
    currentSong: null,
    songCurrentTime: 0,
    queue: [],
    isShuffled: false,
    loopMode: 'off' // 'off', 'one', 'all'
};

// Initialize game
function initGame() {
    userData.songs = [...allSongs];
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    userData.queue = [];
    userData.isShuffled = false;
    userData.loopMode = 'off';

    audio.pause();
    audio.currentTime = 0;
    
    renderSongs(userData.songs);
    updateQueue();
    updateStats();
    updatePlayerDisplay();
    updateLoopDisplay();
    setPlayButtonAccessibleText();
    
    playerStatus.textContent = "STOPPED";
    footerStatus.textContent = "STOPPED";
    playerStatus.style.color = "var(--accent-error)";
    playPauseButton.classList.remove("playing");
}

// Update loop display
function updateLoopDisplay() {
    const loopText = userData.loopMode === 'off' ? 'LOOP_OFF' : 
                    userData.loopMode === 'one' ? 'LOOP_ONE' : 'LOOP_ALL';
    loopStatus.textContent = `[${loopText}]`;
    footerLoop.textContent = userData.loopMode === 'off' ? 'OFF' : 
                           userData.loopMode === 'one' ? 'ONE' : 'ALL';
    
    // Update loop button appearance
    loopButton.classList.toggle('active', userData.loopMode !== 'off');
}

// Toggle loop mode
function toggleLoop() {
    const modes = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(userData.loopMode);
    userData.loopMode = modes[(currentIndex + 1) % modes.length];
    updateLoopDisplay();
}

// Update queue display
function updateQueue() {
    const currentIndex = userData.currentSong ? userData.songs.indexOf(userData.currentSong) : -1;
    userData.queue = userData.songs.slice(currentIndex + 1);
    
    const queueHTML = userData.queue.slice(0, 5).map(song => `
        <li class="song-item">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
        </li>
    `).join('');
    
    queueList.innerHTML = queueHTML || '<li class="song-item"><div class="song-info"><div class="song-title" style="color: var(--text-dim);">Queue is empty</div></div></li>';
}

// Update stats
function updateStats() {
    trackCount.textContent = userData.songs.length;
    volumeDisplay.textContent = `${Math.round(audio.volume * 100)}%`;
}

// Progress bar functionality
const updateProgressBar = () => {
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    
    if (progressBar && audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
        if (durationEl && !isNaN(audio.duration)) {
            durationEl.textContent = formatTime(audio.duration);
        }
    }
};

// Format time helper function
const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Click on progress bar to seek
const setupProgressBar = () => {
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            if (userData?.currentSong) {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const duration = audio.duration;
                
                audio.currentTime = (clickX / width) * duration;
            }
        });
    }
};

// Volume control
const setupVolumeControl = () => {
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value / 100;
            updateStats();
        });
        volumeSlider.value = audio.volume * 100;
    }
};

// Search functionality
const setupSearch = () => {
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm === '') {
                renderSongs(userData.songs);
            } else {
                const filteredSongs = userData.songs.filter(song => 
                    song.title.toLowerCase().includes(searchTerm) || 
                    song.artist.toLowerCase().includes(searchTerm)
                );
                renderSongs(filteredSongs);
            }
        });
    }
};

// Keyboard shortcuts
const setupKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === 'ArrowRight' && !e.ctrlKey) {
            playNextSong();
        } else if (e.code === 'ArrowLeft' && !e.ctrlKey) {
            playPreviousSong();
        } else if (e.code === 'KeyL' && !e.ctrlKey) {
            toggleLoop();
        } else if (e.code === 'KeyS' && !e.ctrlKey) {
            shuffle();
        }
    });
};

// Toggle play/pause
function togglePlayPause() {
    if (userData?.currentSong) {
        if (audio.paused) {
            playSong(userData.currentSong.id);
        } else {
            pauseSong();
        }
    } else if (userData?.songs.length > 0) {
        playSong(userData.songs[0].id);
    }
}

const playSong = (id) => {
    const song = userData?.songs.find((song) => song.id === id);
    if (!song) return;

    audio.src = song.src;
    audio.title = song.title;

    if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
        audio.currentTime = 0;
    } else {
        audio.currentTime = userData?.songCurrentTime;
    }
    userData.currentSong = song;
    
    // Update button state
    playPauseButton.classList.add("playing");

    highlightCurrentSong();
    updatePlayerDisplay();
    setPlayButtonAccessibleText();
    updateQueue();
    
    playerStatus.textContent = "PLAYING";
    footerStatus.textContent = "PLAYING";
    playerStatus.style.color = "var(--accent-success)";
    
    audio.play().catch(error => {
        console.log('Playback failed:', error);
    });
};

const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;
    
    playPauseButton.classList.remove("playing");
    audio.pause();
    
    playerStatus.textContent = "PAUSED";
    footerStatus.textContent = "PAUSED";
    playerStatus.style.color = "var(--accent-warning)";
};

const playNextSong = () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    } else {
        const currentSongIndex = getCurrentSongIndex();
        const nextSong = userData?.songs[currentSongIndex + 1];

        if (nextSong) {
            playSong(nextSong.id);
        } else if (userData.loopMode === 'all') {
            // Loop back to first song
            playSong(userData?.songs[0].id);
        } else {
            // End of playlist
            userData.currentSong = null;
            userData.songCurrentTime = 0;
            pauseSong();
            updatePlayerDisplay();
            highlightCurrentSong();
        }
    }
};

const playPreviousSong = () => {
    if (userData?.currentSong === null) return;
    
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    if (previousSong) {
        playSong(previousSong.id);
    } else {
        // Loop to last song if loop all is enabled
        if (userData.loopMode === 'all') {
            const lastSongIndex = userData.songs.length - 1;
            playSong(userData.songs[lastSongIndex].id);
        } else {
            // Go to beginning of current song
            audio.currentTime = 0;
            if (audio.paused) {
                audio.play();
            }
        }
    }
};

const shuffle = () => {
    userData.isShuffled = !userData.isShuffled;
    
    if (userData.isShuffled) {
        // Shuffle songs but keep current song if playing
        const currentSong = userData.currentSong;
        const otherSongs = userData.songs.filter(song => song !== currentSong);
        
        for (let i = otherSongs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherSongs[i], otherSongs[j]] = [otherSongs[j], otherSongs[i]];
        }
        
        userData.songs = currentSong ? [currentSong, ...otherSongs] : otherSongs;
        shuffleButton.classList.add('active');
    } else {
        // Restore original order
        userData.songs = [...allSongs];
        shuffleButton.classList.remove('active');
    }
    
    renderSongs(userData.songs);
    updateQueue();
    highlightCurrentSong();
};

const updatePlayerDisplay = () => {
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");
    const songAlbum = document.getElementById("player-song-album");
    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;
    const currentAlbum = userData?.currentSong?.album;

    playingSong.textContent = currentTitle ? currentTitle : "Select a song";
    songArtist.textContent = currentArtist ? currentArtist : "Artist";
    songAlbum.textContent = currentAlbum ? currentAlbum : "Album";
};

const highlightCurrentSong = () => {
    const playlistSongElements = document.querySelectorAll(".song-item");
    const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);

    playlistSongElements.forEach((songEl) => {
        songEl.classList.remove("playing");
    });

    if (songToHighlight) songToHighlight.classList.add("playing");
};

const renderSongs = (array) => {
    const songsHTML = array.map((song) => {
        return `
        <li id="song-${song.id}" class="song-item" onclick="playSong(${song.id})">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
            <div class="song-actions">
                <button class="action-btn" onclick="event.stopPropagation(); addToQueue(${song.id})" title="Add to queue">
                    <svg width="12" height="12" viewBox="0 0 16 16">
                        <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"/>
                    </svg>
                </button>
            </div>
        </li>
        `;
    }).join("");

    playlistSongs.innerHTML = songsHTML;
};

const addToQueue = (id) => {
    const song = userData.songs.find(s => s.id === id);
    if (song) {
        userData.queue.push(song);
        updateQueue();
    }
};

const setPlayButtonAccessibleText = () => {
    const song = userData?.currentSong || userData?.songs[0];
    playPauseButton.setAttribute("aria-label", song?.title ? `Play ${song.title}` : "Play");
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

// Event Listeners
playPauseButton.addEventListener("click", togglePlayPause);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffle);
loopButton.addEventListener("click", toggleLoop);

audio.addEventListener("ended", () => {
    if (userData.loopMode === 'one') {
        // Loop current song
        audio.currentTime = 0;
        audio.play();
    } else {
        playNextSong();
    }
});

// Update progress bar continuously
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('loadedmetadata', updateProgressBar);

// Initialize everything when the script loads
document.addEventListener('DOMContentLoaded', () => {
    setupProgressBar();
    setupVolumeControl();
    setupSearch();
    setupKeyboardShortcuts();
    renderSongs(userData.songs);
    updateQueue();
    updateStats();
    setPlayButtonAccessibleText();
});

// New game functionality
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (confirm("Start new music session?")) {
            initGame();
        }
    }
});
