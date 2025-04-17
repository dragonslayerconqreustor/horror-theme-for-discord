/**
 * Discord Horror Theme - JavaScript Component
 * Version: 1.0.0
 * 
 * This script adds flashlight cursor effects and CCTV elements to the Discord UI.
 * Use with discord-horror-theme.css for a complete horror experience.
 */

(function() {
    'use strict';
    
    // Configuration
    const config = {
        flashlightSize: 250,         // Size of the flashlight circle in pixels
        cursorSize: 40,              // Size of the cursor glow
        flashlightDelay: 50,         // Milliseconds of delay for flashlight movement (adds creepiness)
        enableRandomSounds: false,   // Set to true if you've added your own sound files
        enableRandomFlicker: true,   // Random flashlight flickers
        soundsPath: '',              // Path to your hosted sound files if you have them
        flickerFrequency: 0.05       // Chance of flickering (0-1)
    };
    
    // Create and append DOM elements
    function createElements() {
        // Flashlight overlay
        const flashlightOverlay = document.createElement('div');
        flashlightOverlay.classList.add('flashlight-overlay');
        document.body.appendChild(flashlightOverlay);
        
        // Cursor element
        const cursor = document.createElement('div');
        cursor.classList.add('flashlight-cursor');
        document.body.appendChild(cursor);
        
        // CCTV overlay
        const cctvOverlay = document.createElement('div');
        cctvOverlay.classList.add('cctv-overlay');
        document.body.appendChild(cctvOverlay);
        
        // Static noise overlay
        const staticOverlay = document.createElement('div');
        staticOverlay.classList.add('static-overlay');
        document.body.appendChild(staticOverlay);
        
        // REC indicator
        const recIndicator = document.createElement('div');
        recIndicator.classList.add('rec-indicator');
        recIndicator.textContent = 'REC';
        document.body.appendChild(recIndicator);
        
        // CCTV timestamp
        const cctvTimestamp = document.createElement('div');
        cctvTimestamp.classList.add('cctv-timestamp');
        document.body.appendChild(cctvTimestamp);
        
        return {
            flashlightOverlay,
            cursor,
            cctvOverlay,
            staticOverlay,
            recIndicator,
            cctvTimestamp
        };
    }
    
    // Set CSS variables
    function setInitialCssVariables() {
        document.documentElement.style.setProperty('--mouse-x', '50%');
        document.documentElement.style.setProperty('--mouse-y', '50%');
    }
    
    // Update timestamp
    function updateTimestamp(cctvTimestamp) {
        const now = new Date();
        const formattedTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        cctvTimestamp.textContent = formattedTime;
    }
    
    // Random flickering
    function randomFlicker(elements) {
        if (!config.enableRandomFlicker) return;
        
        if (Math.random() < config.flickerFrequency) {
            elements.flashlightOverlay.style.opacity = '0.5';
            elements.cursor.style.opacity = '0.5';
            
            setTimeout(() => {
                elements.flashlightOverlay.style.opacity = '1';
                elements.cursor.style.opacity = '1';
            }, 100 + Math.random() * 100);
        }
    }
    
    // Play random ambient sounds
    function setupRandomSounds() {
        if (!config.enableRandomSounds) return;
        
        setInterval(() => {
            if (Math.random() < 0.1) {
                const audioElement = document.createElement('audio');
                const soundNumber = Math.floor(Math.random() * 5) + 1;
                audioElement.src = `${config.soundsPath}/ambient${soundNumber}.mp3`;
                audioElement.volume = 0.2;
                audioElement.play();
                
                // Cleanup
                audioElement.onended = () => {
                    audioElement.remove();
                };
                
                // Backup cleanup
                setTimeout(() => {
                    if (document.body.contains(audioElement)) {
                        audioElement.remove();
                    }
                }, 10000);
            }
        }, 30000);
    }
    
    // Mouse movement handler with delay for creepiness
    function setupMouseTracking(elements) {
        let timeout = null;
        
        document.addEventListener('mousemove', (e) => {
            // Clear previous timeout
            if (timeout) {
                clearTimeout(timeout);
            }
            
            // Set the cursor position immediately for smooth cursor movement
            elements.cursor.style.left = e.clientX + 'px';
            elements.cursor.style.top = e.clientY + 'px';
            
            // Delay the flashlight movement for a creepy effect
            timeout = setTimeout(() => {
                document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
                document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
                
                // Chance of random flicker during movement
                randomFlicker(elements);
            }, config.flashlightDelay);
        });
    }
    
    // Handle window focus/blur events for extra creepiness
    function setupWindowEvents(elements) {
        // Make it extra creepy when user comes back to window
        window.addEventListener('focus', () => {
            elements.flashlightOverlay.style.transition = 'opacity 0.5s';
            elements.flashlightOverlay.style.opacity = '0.5';
            
            setTimeout(() => {
                elements.flashlightOverlay.style.opacity = '1';
                elements.flashlightOverlay.style.transition = '';
            }, 300);
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                elements.flashlightOverlay.style.transition = 'opacity 0.5s';
                elements.flashlightOverlay.style.opacity = '0.5';
                
                setTimeout(() => {
                    elements.flashlightOverlay.style.opacity = '1';
                    elements.flashlightOverlay.style.transition = '';
                }, 300);
            }
        });
    }
    
    // Initialize
    function init() {
        // Create DOM elements
        const elements = createElements();
        
        // Set initial CSS variables
        setInitialCssVariables();
        
        // Setup mouse tracking
        setupMouseTracking(elements);
        
        // Update CCTV timestamp every second
        setInterval(() => {
            updateTimestamp(elements.cctvTimestamp);
        }, 1000);
        
        // Setup random ambient sounds
        setupRandomSounds();
        
        // Handle window events
        setupWindowEvents(elements);
        
        console.log('Discord Horror Theme: Flashlight and CCTV effects initialized');
    }
    
    // Check if we're on Discord
    function checkIfDiscord() {
        return window.location.hostname.includes('discord.com');
    }
    
    // Wait for page to load and then initialize
    function waitForPageLoad() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            if (checkIfDiscord()) {
                init();
            } else {
                console.warn('Discord Horror Theme: Not running on Discord. Theme will only work on discord.com');
            }
        } else {
            setTimeout(waitForPageLoad, 100);
        }
    }
    
    // Start the script
    waitForPageLoad();
    
})();