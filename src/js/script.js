import { openGallery } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const historyContainer = document.getElementById('search-history');
    const resultsContainer = document.getElementById('image-results');
    const btnClearHistory = document.querySelector('.btn-delet'); // Corregido el selector
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Cargar historial al iniciar
    updateHistory();

    // Evento para eliminar historial
    btnClearHistory.addEventListener('click', deleteHistory);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = e.target[0].value.trim();
        if (!query) return;

        // Guardar en historial
        if (!searchHistory.includes(query)) {
            searchHistory.push(query);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            updateHistory();
        }

        // Buscar imágenes
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${query}&client_id=jMBn4JdVYyIHAl4cKVZ7ICCtjtZmXHml5iEczZA7BkE`
            );
            
            if (!response.ok) {
                throw new Error(`Error de API: ${response.status}`);
            }

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                displayImages(data.results);
            } else {
                resultsContainer.innerHTML = "<p>No se encontraron imágenes.</p>";
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            resultsContainer.innerHTML = `<p>Error al cargar imágenes: ${error.message}</p>`;
        }
    });

    function updateHistory() {
        historyContainer.innerHTML = searchHistory
            .map(term => `<p>${term}</p>`)
            .join('');
        
        // Asignar eventos a los nuevos elementos del historial
        document.querySelectorAll('#search-history p').forEach(p => {
            p.addEventListener('click', () => {
                const term = p.textContent;
                document.querySelector('.buscador-input').value = term;
                form.dispatchEvent(new Event('submit'));
            });
        });
    }

    function deleteHistory() {
        searchHistory = [];
        localStorage.removeItem('searchHistory');
        updateHistory();
        resultsContainer.innerHTML = '';
    }

    function displayImages(images) {
        resultsContainer.innerHTML = images
            .map(img => `
                <div class="tarjeta">
                    <img 
                        src="${img.urls.regular}" 
                        alt="${img.alt_description || 'Imagen de Unsplash'}"
                        data-author="${img.user.name || 'Anónimo'}"
                        data-full="${img.urls.full}"
                    >
                </div>
            `)
            .join('');

        // Evento click para abrir galería
        document.querySelectorAll('.tarjeta img').forEach((img, index) => {
            img.addEventListener('click', () => {
                openGallery(images, index);
            });
        });
    }
});