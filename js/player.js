class MusicPlayer {
    constructor() {
        this.songs = [
            {
                title: 'From The Start',
                artist: 'Laufey',
                file: 'playlist/songs/from-the-start.mp3',
                cover: 'playlist/cv-images/from-the-start.png'
            },
            {
                title: 'Wave to Earth',
                artist: 'Wave to Earth',
                file: 'playlist/songs/wave-to-earth.mp3',
                cover: 'playlist/cv-images/wave-to-earth.png'
            },
            {
                title: 'The Perfect Pair',
                artist: 'Beabadoobee',
                file: 'playlist/songs/the-perfect-pair.mp3',
                cover: 'playlist/cv-images/the-perfect-pair.png'
            },
            {
                title: 'Feels',
                artist: 'Watts',
                file: 'playlist/songs/feels.mp3',
                cover: 'playlist/cv-images/feels.png'
            },
            {
                title: 'Homage',
                artist: 'Mild High Club',
                file: 'playlist/songs/homage.mp3',
                cover: 'playlist/cv-images/homage.png'
            }
        ];

        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isDragging = false;
        this.audio = new Audio();
        this.initializePlayer();
    }

    initializePlayer() {
        // Get DOM elements
        this.playPauseBtn = document.querySelector('.play-pause');
        this.prevBtn = document.querySelector('.previous');
        this.nextBtn = document.querySelector('.next');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.currentTimeSpan = document.querySelector('.current-time');
        this.totalTimeSpan = document.querySelector('.total-time');
        this.coverArt = document.getElementById('cover');
        this.songTitle = document.querySelector('.song-title');
        this.artistName = document.querySelector('.artist');
        this.playlistItems = document.querySelectorAll('.playlist-item');

        // Initialize first song
        this.loadSong(this.currentSongIndex);
        this.updatePlaylistUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Playback controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());

        // Progress bar events
        this.progressBar.addEventListener('mousedown', (e) => this.startDragging(e));
        document.addEventListener('mousemove', (e) => this.dragging(e));
        document.addEventListener('mouseup', () => this.stopDragging());
        
        // Touch events for mobile
        this.progressBar.addEventListener('touchstart', (e) => this.startDragging(e));
        document.addEventListener('touchmove', (e) => this.dragging(e));
        document.addEventListener('touchend', () => this.stopDragging());

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextSong());
        this.audio.addEventListener('loadedmetadata', () => {
            this.totalTimeSpan.textContent = this.formatTime(this.audio.duration);
        });

        // Playlist clicks
        this.playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.currentSongIndex = index;
                this.loadSong(index);
                this.updatePlaylistUI();
                this.play(); // Auto-play when clicking playlist item
            });
        });

        // Space bar to toggle play/pause
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                this.togglePlay();
            }
        });
    }

    startDragging(e) {
        this.isDragging = true;
        this.progressBar.classList.add('dragging');
        this.handleProgressBarInteraction(e);
    }

    dragging(e) {
        if (!this.isDragging) return;
        this.handleProgressBarInteraction(e);
    }

    stopDragging() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.progressBar.classList.remove('dragging');
    }

    handleProgressBarInteraction(e) {
        const rect = this.progressBar.getBoundingClientRect();
        let x;
        
        if (e.type.startsWith('touch')) {
            x = e.touches[0].clientX - rect.left;
        } else {
            x = e.clientX - rect.left;
        }

        const width = rect.width;
        const percentage = Math.min(Math.max(x / width, 0), 1);
        this.progress.style.width = `${percentage * 100}%`;
        
        if (this.isDragging) {
            this.audio.currentTime = percentage * this.audio.duration;
        }
    }

    loadSong(index) {
        const song = this.songs[index];
        
        // Add transition effect
        this.coverArt.style.opacity = '0';
        this.songTitle.style.opacity = '0';
        this.artistName.style.opacity = '0';

        setTimeout(() => {
            // Update song info
            this.audio.src = song.file;
            this.coverArt.src = song.cover;
            this.songTitle.textContent = song.title;
            this.artistName.textContent = song.artist;

            // Fade in elements
            this.coverArt.style.opacity = '1';
            this.songTitle.style.opacity = '1';
            this.artistName.style.opacity = '1';

            // If was playing before loading new song, start playing automatically
            if (this.isPlaying) {
                this.play();
            }
        }, 300);

        // Reset progress
        this.progress.style.width = '0%';
        this.currentTimeSpan.textContent = '0:00';
    }

    updatePlaylistUI() {
        this.playlistItems.forEach((item, index) => {
            if (index === this.currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        this.playPauseBtn.querySelector('.play').classList.add('hidden');
        this.playPauseBtn.querySelector('.pause').classList.remove('hidden');
        
        // Use play() with error handling
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Playback error:", error);
                // Handle the error appropriately
            });
        }
    }

    pause() {
        this.isPlaying = false;
        this.playPauseBtn.querySelector('.play').classList.remove('hidden');
        this.playPauseBtn.querySelector('.pause').classList.add('hidden');
        this.audio.pause();
    }

    prevSong() {
        this.currentSongIndex--;
        if (this.currentSongIndex < 0) {
            this.currentSongIndex = this.songs.length - 1;
        }
        this.loadSong(this.currentSongIndex);
        this.updatePlaylistUI();
        this.play(); // Auto-play when changing songs
    }

    nextSong() {
        this.currentSongIndex++;
        if (this.currentSongIndex >= this.songs.length) {
            this.currentSongIndex = 0;
        }
        this.loadSong(this.currentSongIndex);
        this.updatePlaylistUI();
        this.play(); // Auto-play when changing songs
    }

    updateProgress() {
        if (!this.isDragging && this.audio.duration) {
            const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = `${progressPercent}%`;
            this.currentTimeSpan.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});
