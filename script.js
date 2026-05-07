const API_KEY = "aa51c454";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieGrid = document.getElementById("movieGrid");
const welcomeScreen = document.getElementById("welcomeScreen");
const modal = document.getElementById("movieModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.querySelector(".close-modal");

// Giriş
window.onload = () => {
    const last = localStorage.getItem("lastSearch");
    if (last) {
        searchInput.value = last;
        fetchMovies(last);
    }
};

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) fetchMovies(query);
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

async function fetchMovies(query) {
    try {
        movieGrid.innerHTML = `<div class="status-msg"><h2>Aranıyor...</h2></div>`;
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
            localStorage.setItem("lastSearch", query);
        } else {
            suggestAlternative(query);
        }
    } catch (err) {
        showError("Hata oluştu!");
    }
}

function displayMovies(movies) {
    welcomeScreen.style.display = "none";
    movieGrid.innerHTML = "";

    movies.forEach(m => {
        const div = document.createElement("div");
        div.className = "movie-card-mini";

        // TIKLAMA OLAYI BURADA BAĞLANDI
        div.addEventListener('click', () => {
            getMovieDetails(m.imdbID);
        });

        div.innerHTML = `
            <img src="${m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/300x450?text=Afiş+Yok'}" alt="${m.Title}">
            <div class="info-box-mini">
                <div style="margin-bottom:8px">
                    <span class="badge">${m.Year}</span>
                    <span class="badge" style="background:var(--primary)">${m.Type.toUpperCase()}</span>
                </div>
                <h3 style="margin:0">${m.Title}</h3>
            </div>
        `;
        movieGrid.appendChild(div);
    });
}

async function getMovieDetails(id) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`);
        const m = await res.json();

        if (m.Response === "True") {
            modalBody.innerHTML = `
                <div class="modal-grid">
                    <img class="modal-poster" src="${m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/300x450?text=Afiş+Yok'}">
                    <div class="modal-info">
                        <h1 style="color:var(--primary); margin:0 0 15px 0">${m.Title}</h1>
                        <div class="detail-item"><strong>Yapım Yılı:</strong> ${m.Year}</div>
                        <div class="detail-item"><strong>Yönetmen:</strong> ${m.Director}</div>
                        <div class="detail-item"><strong>Oyuncular:</strong> ${m.Actors}</div>
                        <div class="detail-item"><strong>IMDb:</strong> ⭐ ${m.imdbRating}</div>
                        <div style="margin-top:20px; border-top:1px solid #334155; padding-top:15px">
                            <p style="line-height:1.6; color:#cbd5e1">${m.Plot}</p>
                        </div>
                    </div>
                </div>
            `;
            modal.style.display = "block";
        }
    } catch (err) {
        console.error("Detay hatası:", err);
    }
}

// Alternatif öneri (Bunu mu demek istediniz?)
async function suggestAlternative(query) {
    const simplified = query.substring(0, 3);
    const res = await fetch(`https://www.omdbapi.com/?s=${simplified}&apikey=${API_KEY}`);
    const data = await res.json();

    movieGrid.innerHTML = `
        <div class="status-msg">
            <h2>"${query}" bulunamadı.</h2>
            ${data.Response === "True" ? '<p>Şunları mı demek istediniz?</p>' : ''}
            <div id="suggestions" style="display:flex; gap:10px; justify-content:center; margin-top:15px"></div>
        </div>
    `;

    if (data.Response === "True") {
        data.Search.slice(0, 3).forEach(s => {
            const btn = document.createElement("button");
            btn.className = "badge";
            btn.style.cursor = "pointer";
            btn.innerText = s.Title;
            btn.onclick = () => { searchInput.value = s.Title; fetchMovies(s.Title); };
            document.getElementById("suggestions").appendChild(btn);
        });
    }
}

// Kapatma
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

function showError(msg) {
    movieGrid.innerHTML = `<div class="status-msg"><h2>${msg}</h2></div>`;
}