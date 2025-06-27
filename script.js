// Candy Counter App JavaScript
class CandyTracker {
    constructor() {
        this.workHours = [8, 9, 10, 11, 13, 14, 15, 16]; // 8 AM to 4 PM (8 hours, no 12 PM)
        this.storageKey = 'candyTracker';
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
        this.highlightCurrentHour();
        this.startClock();
        
        // Check if it's a new day and reset if needed
        this.checkNewDay();
    }

    loadData() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem(this.storageKey);
        
        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === today) {
                this.data = data;
                return;
            }
        }
        
        // Initialize new day data
        this.data = {
            date: today,
            checkedHours: {}
        };
        this.saveData();
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    checkNewDay() {
        const today = new Date().toDateString();
        if (this.data.date !== today) {
            this.resetDay();
        }
    }

    setupEventListeners() {
        // Add event listeners for checkboxes
        this.workHours.forEach(hour => {
            const checkbox = document.getElementById(`hour-${hour}`);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    this.handleCheckboxChange(hour, e.target.checked);
                });
                
                // Set initial state
                checkbox.checked = this.data.checkedHours[hour] || false;
            }
        });

        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetDay();
            });
        }
    }

    handleCheckboxChange(hour, isChecked) {
        this.data.checkedHours[hour] = isChecked;
        this.saveData();
        this.updateStats();
        
        // Add visual feedback
        if (isChecked) {
            this.showCandyEaten();
        }
    }

    showCandyEaten() {
        // Create a temporary celebration effect
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉 Candy time! 🍬';
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff6b6b, #feca57);
            color: white;
            padding: 20px 40px;
            border-radius: 25px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1000;
            animation: celebrationPop 2s ease-out forwards;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#celebration-style')) {
            const style = document.createElement('style');
            style.id = 'celebration-style';
            style.textContent = `
                @keyframes celebrationPop {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.parentNode.removeChild(celebration);
            }
        }, 2000);
    }

    updateStats() {
        const candyCount = Object.values(this.data.checkedHours).filter(Boolean).length;
        const remainingCount = this.workHours.length - candyCount;
        
        const candyCountEl = document.getElementById('candyCount');
        const remainingCountEl = document.getElementById('remainingCount');
        
        if (candyCountEl) candyCountEl.textContent = candyCount;
        if (remainingCountEl) remainingCountEl.textContent = remainingCount;
    }

    updateDisplay() {
        this.updateStats();
        this.updateDate();
    }

    updateDate() {
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateEl.textContent = new Date().toLocaleDateString('en-US', options);
        }
    }

    highlightCurrentHour() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // Remove previous highlights
        document.querySelectorAll('.hour-slot').forEach(slot => {
            slot.classList.remove('current-hour');
        });
        
        // Highlight current hour if it's within work hours
        if (this.workHours.includes(currentHour)) {
            const currentSlot = document.querySelector(`[data-hour="${currentHour}"]`);
            if (currentSlot) {
                currentSlot.classList.add('current-hour');
            }
        }
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            
            const timeEl = document.getElementById('currentTime');
            if (timeEl) {
                timeEl.textContent = timeString;
            }
            
            // Update current hour highlight every minute
            if (now.getSeconds() === 0) {
                this.highlightCurrentHour();
            }
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    resetDay() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to reset your candy tracker for today? This will uncheck all boxes.')) {
            // Reset data
            this.data = {
                date: new Date().toDateString(),
                checkedHours: {}
            };
            
            // Reset checkboxes
            this.workHours.forEach(hour => {
                const checkbox = document.getElementById(`hour-${hour}`);
                if (checkbox) {
                    checkbox.checked = false;
                }
            });
            
            this.saveData();
            this.updateDisplay();
            
            // Show reset confirmation
            this.showResetConfirmation();
        }
    }

    showResetConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.innerHTML = '✨ Day reset! Fresh start! ✨';
        confirmation.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #48bb78, #38a169);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        `;
        
        // Add slide-in animation if not already added
        if (!document.querySelector('#reset-style')) {
            const style = document.createElement('style');
            style.id = 'reset-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.style.animation = 'slideIn 0.5s ease-out reverse';
                setTimeout(() => {
                    if (confirmation.parentNode) {
                        confirmation.parentNode.removeChild(confirmation);
                    }
                }, 500);
            }
        }, 3000);
    }

    // Method to get current stats (useful for debugging or future features)
    getStats() {
        const candyCount = Object.values(this.data.checkedHours).filter(Boolean).length;
        const remainingCount = this.workHours.length - candyCount;
        const completionPercentage = Math.round((candyCount / this.workHours.length) * 100);
        
        return {
            candyCount,
            remainingCount,
            completionPercentage,
            workHours: this.workHours.length
        };
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.candyTracker = new CandyTracker();
});

// Add some fun keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'R' to reset (with Ctrl/Cmd)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        if (window.candyTracker) {
            window.candyTracker.resetDay();
        }
    }
    
    // Press numbers 1-9 to toggle hours (8 AM = 1, 9 AM = 2, etc.)
    if (e.key >= '1' && e.key <= '9') {
        const hourIndex = parseInt(e.key) - 1;
        if (window.candyTracker && hourIndex < window.candyTracker.workHours.length) {
            const hour = window.candyTracker.workHours[hourIndex];
            const checkbox = document.getElementById(`hour-${hour}`);
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        }
    }
}); 