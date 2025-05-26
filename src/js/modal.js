// Elementos del DOM
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const authorName = document.getElementById('author-name');
const closeBtn = document.querySelector('.close-modal');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Variables de estado
let currentImages = [];
let currentIndex = 0;

// Función para abrir el modal con galería
export function openGallery(images, index) {
    currentImages = images;
    currentIndex = index;
    updateModal();
    modal.style.display = 'flex';
}

// Actualizar imagen y autor en el modal
function updateModal() {
    const img = currentImages[currentIndex];
    modalImg.src = img.urls.regular;
    modalImg.alt = `Foto por ${img.user.name}`;
    authorName.textContent = `Autor: ${img.user.name}`;
}

// Navegación
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateModal();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < currentImages.length - 1) {
        currentIndex++;
        updateModal();
    }
});

// Cerrar modal
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

function closeModal() {
    modal.style.display = 'none';
}