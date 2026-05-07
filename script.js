const API_KEY = "aa51c454";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieGrid = document.getElementById("movieGrid");
const welcomeScreen = document.getElementById("welcomeScreen");
const modal = document.getElementById("movieModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) fetchMovies(query);
});

async function fetchMovies(query) {
    movieGrid.innerHTML = `<h2 style="text-align:center; width:100%">Aranıyor...</h2>`;
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
        const data = await response.json();
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            movieGrid.innerHTML = `<h2 style="text-align:center; width:100%">Sonuç bulunamadı.</h2>`;
        }
    } catch (err) {
        console.error("Hata:", err);
    }
}

function displayMovies(movies) {
    welcomeScreen.style.display = "none";
    movieGrid.innerHTML = "";
    movies.forEach(m => {
        const div = document.createElement("div");
        div.className = "movie-card-mini";
        div.onclick = () => getMovieDetails(m.imdbID);
        div.innerHTML = `
            <img src="${m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/300x450'}" alt="${m.Title}">
            <div class="info-box-mini">
                <p style="font-size:12px; color:var(--primary)">${m.Year}</p>
                <h3 style="margin:5px 0">${m.Title}</h3>
            </div>
        `;
        movieGrid.appendChild(div);
    });
}

async function getMovieDetails(id) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`);
        const m = await res.json();

        modalBody.innerHTML = `
            <div class="modal-grid">
                <img class="modal-poster" src="${m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/300x450'}">
                <div class="modal-info">
                    <h1 style="margin-top:0">${m.Title}</h1>
                    <div class="detail-item"><strong>Yıl:</strong> ${m.Year}</div>
                    <div class="detail-item"><strong>Yönetmen:</strong> ${m.Director}</div>
                    <div class="detail-item"><strong>Oyuncular:</strong> ${m.Actors}</div>
                    <div class="detail-item"><strong>Puan:</strong> ⭐ ${m.imdbRating}</div>
                    <p style="margin-top:20px; line-height:1.6">${m.Plot}</p>
                </div>
            </div>
        `;
        modal.style.display = "block";
    } catch (err) {
        console.error("Detay hatası:", err);
    }
}

// Kapatma işlemleri
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };