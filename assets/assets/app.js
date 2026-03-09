const cardContainer = document.getElementById("card-container");

function updateUrl(params) {
    const url = new URL(window.location);
    params.tag ? url.searchParams.set('tag', params.tag) : url.searchParams.delete('tag');
    if (params.hash !== undefined) {
        url.hash = params.hash;
    }
    history.replaceState(null, '', url);
}

function loadMedia(slide, descEl) {
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
    if (descEl && slide.dataset.description) {
        descEl.innerHTML = slide.dataset.description;
    }
}

function resetModal(modal) {
    const counter = modal.querySelector('.carousel-counter .current');
    if (counter) {
        counter.textContent = '1';
    }
    const slides = modal.querySelectorAll('.carousel-slide');
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === 0);
    });
    modal._cachedDescEl = modal.querySelector('.image-description');
}

function changeSlide(modal, direction) {
    const slides = modal.querySelectorAll('.carousel-slide');
    const counter = modal.querySelector('.carousel-counter .current');
    const descEl = modal._cachedDescEl || modal.querySelector('.image-description');
    
    let current = counter ? parseInt(counter.textContent) - 1 : 0;
    
    slides[current]?.classList.remove('active');
    current = (current + direction + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    
    loadMedia(slides[current], descEl);
    
    if (counter) {
        counter.textContent = current + 1;
    }
}

function openModal(modal) {
    if (!modal) return;
    modal.style.visibility = "visible";
    loadModalSlides(modal);
}

function handleHashChange() {
    const hash = location.hash.slice(1);
    if (hash) {
        const modal = document.getElementById('modal-' + hash);
        openModal(modal);
    }
}

function toggleSidebar(forceState) {
    const nav = document.querySelector('nav');
    const overlay = document.getElementById('overlay');
    const isOpen = nav.classList.toggle('is-open', forceState);
    const shouldOpen = forceState !== undefined ? isOpen : !isOpen;
    overlay?.classList.toggle('is-open', shouldOpen);
    if (!shouldOpen) {
        nav.classList.remove('is-open');
    }
}

function initEventListeners() {
    document.querySelector('.nav-close')?.addEventListener('click', () => toggleSidebar(false));
    document.querySelector('.nav-open')?.addEventListener('click', () => toggleSidebar(true));
    document.getElementById('overlay')?.addEventListener('click', () => toggleSidebar(false));
    
    document.querySelectorAll('#jumps a').forEach(link => {
        link.addEventListener('click', () => toggleSidebar(false));
    });
    
    cardContainer?.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.modal-close');
        if (closeBtn) {
            const modal = closeBtn.closest('.modal');
            if (modal) closeModal(modal.id);
            return;
        }
        
        const navBtn = e.target.closest('.modal-nav');
        if (navBtn) {
            const modal = navBtn.closest('.modal');
            if (modal) changeSlide(modal, navBtn.classList.contains('modal-nav-prev') ? -1 : 1);
            return;
        }
    });
}

function show_modal(event) {
    const modal = event.target.closest('.card')?.nextElementSibling;
    if (!modal) return;
    
    openModal(modal);
    updateUrl({ hash: modal.id.replace('modal-', '') });
}

function loadModalSlides(modal) {
    const descEl = modal.querySelector('.image-description');
    modal._cachedDescEl = descEl;
    
    const slides = modal.querySelectorAll('.carousel-slide');
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === 0);
        if (idx === 0) loadMedia(slide, descEl);
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.querySelectorAll('video').forEach(video => video.pause());
    modal.style.visibility = "hidden";
    resetModal(modal);
    updateUrl({ hash: '' });
}

function filterByTag(tag) {
    if (!cardContainer) return;
    
    const cards = cardContainer.querySelectorAll('.card');
    
    cards.forEach(card => {
        const cardTags = card.getAttribute('data-tags') || '';
        const isMatch = !tag || cardTags.includes(tag);
        
        card.classList.toggle('hidden', !isMatch);
        
        const modal = card.nextElementSibling;
        if (modal?.classList.contains('modal')) {
            modal.classList.toggle('hidden', !isMatch);
            modal.style.visibility = isMatch ? '' : 'hidden';
        }
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tag === tag);
    });
    
    updateUrl({ tag: tag || null });
}

function initFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    if (tag) {
        filterByTag(tag);
    }
    handleHashChange();
}

function initCards() {
    cardContainer?.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) {
            show_modal({ target: card });
            return;
        }
        
        const modal = e.target.closest('.modal');
        if (modal && e.target.classList.contains('modal') && 
            !e.target.closest('.modal-nav') &&
            !e.target.closest('.modal-close') &&
            !e.target.closest('.modal-info') &&
            e.target.localName !== "model-viewer") {
            closeModal(modal.id);
        }
    });
}

function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterByTag(btn.dataset.tag);
        });
    });
}

initFromUrl();
initCards();
initFilterButtons();
initEventListeners();

window.addEventListener('hashchange', handleHashChange);