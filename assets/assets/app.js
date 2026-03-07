function sb_open() {
    document.getElementsByTagName("nav")[0].style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function sb_close() {
    document.getElementsByTagName("nav")[0].style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function show_modal(event) {
    const modal = event.currentTarget.nextElementSibling;
    modal.style.visibility = "visible";
    loadModalSlides(modal);
    
    const urlHash = modal.id.replace('modal-', '');
    history.replaceState(null, null, '#' + urlHash);
}

function loadModalSlides(modal) {
    const slides = modal.querySelectorAll('.carousel-slide');
    
    slides.forEach((slide, idx) => {
        if (idx === 0) {
            slide.classList.add('active');
            const img = slide.querySelector('img');
            if (img && slide.dataset.src && img.src !== slide.dataset.src) {
                img.src = slide.dataset.src;
            }
            const video = slide.querySelector('video');
            if (video && slide.dataset.src) {
                const source = video.querySelector('source');
                if (source && !source.src) {
                    source.src = slide.dataset.src;
                    video.load();
                }
            }
            const descEl = modal.querySelector('.image-description');
            if (descEl && slide.dataset.description) {
                descEl.innerHTML = slide.dataset.description;
            }
        } else {
            slide.classList.remove('active');
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.visibility = "hidden";
        resetCarouselCounter(modal);
        if (location.hash) {
            history.replaceState(null, null, location.pathname + location.search);
        }
    }
}

function resetCarouselCounter(modal) {
    const counter = modal.querySelector('.carousel-counter .current');
    if (counter) {
        counter.textContent = '1';
    }
    const slides = modal.querySelectorAll('.carousel-slide');
    slides.forEach((slide, idx) => {
        if (idx === 0) {
            slide.classList.add('active');
            const descEl = modal.querySelector('.image-description');
            if (descEl && slide.dataset.description) {
                descEl.innerHTML = slide.dataset.description;
            }
        } else {
            slide.classList.remove('active');
        }
    });
}

function hide_modal(event) {
    if (event.target.classList.contains('modal') || event.target.closest('.modal')?.classList.contains('modal')) {
        if (event.target.localName !== "model-viewer" && 
            !event.target.closest('.modal-nav') &&
            !event.target.closest('.modal-close') &&
            !event.target.closest('.modal-info')) {
            event.currentTarget.style.visibility = "hidden";
            resetCarouselCounter(event.currentTarget);
            if (location.hash) {
                history.replaceState(null, null, location.pathname + location.search);
            }
        }
    }
}

function prevSlide(btn) {
    const modal = btn.closest('.modal');
    const slides = modal.querySelectorAll('.carousel-slide');
    const counter = modal.querySelector('.carousel-counter .current');
    
    let current = 0;
    if (counter) {
        current = parseInt(counter.textContent) - 1;
    }
    
    slides[current]?.classList.remove('active');
    current = current - 1;
    if (current < 0) current = slides.length - 1;
    slides[current]?.classList.add('active');
    
    const slide = slides[current];
    if (slide) {
        const img = slide.querySelector('img');
        if (img && slide.dataset.src && img.src !== slide.dataset.src) {
            img.src = slide.dataset.src;
        }
        const video = slide.querySelector('video');
        if (video && slide.dataset.src) {
            const source = video.querySelector('source');
            if (source && !source.src) {
                source.src = slide.dataset.src;
                video.load();
            }
        }
        const descEl = modal.querySelector('.image-description');
        if (descEl && slide.dataset.description) {
            descEl.innerHTML = slide.dataset.description;
        }
    }
    
    if (counter) {
        counter.textContent = current + 1;
    }
}

function nextSlide(btn) {
    const modal = btn.closest('.modal');
    const slides = modal.querySelectorAll('.carousel-slide');
    const counter = modal.querySelector('.carousel-counter .current');
    
    let current = 0;
    if (counter) {
        current = parseInt(counter.textContent) - 1;
    }
    
    slides[current]?.classList.remove('active');
    current = current + 1;
    if (current >= slides.length) current = 0;
    slides[current]?.classList.add('active');
    
    const slide = slides[current];
    if (slide) {
        const img = slide.querySelector('img');
        if (img && slide.dataset.src && img.src !== slide.dataset.src) {
            img.src = slide.dataset.src;
        }
        const video = slide.querySelector('video');
        if (video && slide.dataset.src) {
            const source = video.querySelector('source');
            if (source && !source.src) {
                source.src = slide.dataset.src;
                video.load();
            }
        }
        const descEl = modal.querySelector('.image-description');
        if (descEl && slide.dataset.description) {
            descEl.innerHTML = slide.dataset.description;
        }
    }
    
    if (counter) {
        counter.textContent = current + 1;
    }
}

function filterByTag(tag) {
    const cardContainer = document.getElementById('card-container');
    
    if (!cardContainer) return;
    
    const cards = cardContainer.querySelectorAll('.card');
    
    cards.forEach(card => {
        const cardTags = card.getAttribute('data-tags') || '';
        
        if (!tag || (cardTags && cardTags.includes(tag))) {
            card.classList.remove('hidden');
            card.style.display = '';
            
            const modal = card.nextElementSibling;
            if (modal && modal.classList.contains('modal')) {
                modal.classList.remove('hidden');
                modal.style.visibility = '';
            }
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
            
            const modal = card.nextElementSibling;
            if (modal && modal.classList.contains('modal')) {
                modal.classList.add('hidden');
                modal.style.visibility = 'hidden';
            }
        }
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tag === tag);
    });
    
    if (tag) {
        const url = new URL(window.location);
        url.searchParams.set('tag', tag);
        history.replaceState(null, '', url);
    } else {
        const url = new URL(window.location);
        url.searchParams.delete('tag');
        history.replaceState(null, '', url);
    }
}

function initFilterFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    if (tag) {
        filterByTag(tag);
    }
}

function initCards() {
    const cardContainer = document.getElementById("card-container");
    if (!cardContainer) return;
    
    const cards = cardContainer.getElementsByClassName("card");
    const modals = cardContainer.getElementsByClassName("modal");
    
    for (let element of cards) {
        element.addEventListener("click", show_modal);
    }
    for (let element of modals) {
        element.addEventListener("click", hide_modal);
    }
}

function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterByTag(btn.dataset.tag);
        });
    });
}

function checkUrlAnchor() {
    const hash = location.hash.slice(1);
    if (hash) {
        const modal = document.getElementById('modal-' + hash);
        if (modal) {
            modal.style.visibility = "visible";
            loadModalSlides(modal);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initFilterFromUrl();
    initCards();
    initFilterButtons();
    checkUrlAnchor();
});

window.addEventListener('hashchange', checkUrlAnchor);