// Ensure the page always starts at the top on refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.onload = () => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const heroSection = document.querySelector('#hero');
    heroSection.scrollIntoView({ behavior: 'auto' });
};

const sections = document.querySelectorAll('section');
const navbar = document.querySelector('nav');
let currentSectionIndex = 0;

navbar.classList.remove('visible');
sections[currentSectionIndex].classList.add('visible');

document.querySelector('.scroll-down').addEventListener('click', () => {
    document.body.style.overflow = 'auto';

    const nextSection = document.querySelector('#about');
    nextSection.classList.add('visible');
    nextSection.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
        navbar.classList.add('visible');
    }, 500);
});

function revealSectionsOnScroll() {
    const scrollPosition = window.scrollY + window.innerHeight;

    sections.forEach((section) => {
        if (section.offsetTop < scrollPosition - 100) {
            section.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealSectionsOnScroll);

// Typing effect function
function typeText(element, text, delay = 20, callback) {
    let index = 0;
    element.textContent = "";

    const typeInterval = setInterval(() => {
        element.textContent += text.charAt(index);
        index++;

        if (index === text.length) {
            clearInterval(typeInterval);
            if (callback) callback();
        }
    }, delay);
}

// Trigger typing effect on scroll into view
function triggerTypingEffect() {
    const aboutParagraphs = document.querySelectorAll('#about p');
    let currentIndex = 0;

    function typeNext() {
        if (currentIndex < aboutParagraphs.length) {
            const el = aboutParagraphs[currentIndex];
            const text = el.getAttribute('data-text');
            typeText(el, text, 20, () => {
                currentIndex++;
                setTimeout(typeNext, 400); // Delay before next paragraph
            });
        }
    }

    typeNext();
}

document.addEventListener('scroll', function onScroll() {
    const aboutSection = document.querySelector('#about');
    const position = aboutSection.getBoundingClientRect();

    if (position.top < window.innerHeight && position.bottom > 0) {
        triggerTypingEffect();
        document.removeEventListener('scroll', onScroll);
    }
});

document.addEventListener("scroll", () => {
    const aboutSection = document.querySelector("#about");
    const projectsSection = document.querySelector("#projects");
    const contactSection = document.querySelector("#contact");

    const scrollPosition = window.scrollY + window.innerHeight / 2;

    // Change background for About section
    if (scrollPosition >= aboutSection.offsetTop && scrollPosition < projectsSection.offsetTop) {
        aboutSection.style.background = "linear-gradient(135deg, #1c1c1c, #292929)";
    } else {
        aboutSection.style.background = "linear-gradient(135deg, #1e1e1e, #2a2a2a)";
    }

    // Change background for Projects section
    if (scrollPosition >= projectsSection.offsetTop && scrollPosition < contactSection.offsetTop) {
        projectsSection.style.background = "linear-gradient(135deg, #262626, #343434)";
    } else {
        projectsSection.style.background = "linear-gradient(135deg, #2a2a2a, #3a3a3a)";
    }

    // Change background for Contact section
    if (scrollPosition >= contactSection.offsetTop) {
        contactSection.style.background = "linear-gradient(135deg, #333333, #444444)";
    } else {
        contactSection.style.background = "linear-gradient(135deg, #3a3a3a, #4a4a4a)";
    }
});
