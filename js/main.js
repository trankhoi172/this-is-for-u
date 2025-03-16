onload = () => {
    const c = setTimeout(() => {
        document.body.classList.remove("not-loaded");

        // Add title animation
        const titles = 'You’re stronger than you think and braver than you believe. Life may throw challenges your way. So keep going, because you are capable of amazing things'.split('');
        const titleElement = document.getElementById('title');
        let index = 0;

        function appendTitle() {
            if (index < titles.length) {
                titleElement.innerHTML += titles[index];
                index++;
                setTimeout(appendTitle, 300);
            }
        }

        appendTitle();

        // Animate navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach((btn, index) => {
            btn.style.opacity = '0';
            setTimeout(() => {
                btn.style.transition = 'opacity 0.5s ease-in-out';
                btn.style.opacity = '1';
            }, 2000 + (index * 200)); // Stagger the appearance of buttons
        });

        clearTimeout(c);
    }, 1000);
};