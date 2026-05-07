const API_KEY = "aa51c454";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieGrid = document.getElementById("movieGrid");
const welcomeScreen = document.getElementById("welcomeScreen");

// Sayfa yüklendiğinde LocalStorage'dan son aramayı kontrol et
window.onload = () => {
    const last = localStorage.getItem("lastSearch");
    if (last) {
        searchInput.value = last;
        fetchMovies(last);
    }
};

// Butona tıklandığında arama yap
searchBtn.addEventListener("click", () => {
    const title = searchInput.value.trim();
    if (title) fetchMovies(title);
});

// Enter tuşu desteği
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

async function fetchMovies(title) {
    try {
        // 's' parametresi tüm eşleşmeleri getirir
        const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
            localStorage.setItem("lastSearch", title);
        } else {
            showError("Aradığınız kriterde sonuç bulunamadı.");
        }
    } catch (err) {
        showError("Sunucu bağlantısında hata oluştu!");
    }
}

function displayMovies(movies) {
    welcomeScreen.style.display = "none";
    movieGrid.innerHTML = ""; // Önceki sonuçları temizle

    movies.forEach(m => {
        // Her film için bir kart oluştur
        const movieCard = `
            <div class="movie-card-mini">
                <div class="poster-box">
                    <img src="${m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/300x450?text=Poster+Yok'}" alt="${m.Title}">
                </div>
                <div class="info-box-mini">
                    <div class="badge-container">
                        <span class="badge">${m.Year}</span>
                        <span class="badge type-badge">${m.Type.toUpperCase()}</span>
                    </div>
                    <h3>${m.Title}</h3>
                </div>
            </div>
        `;
        movieGrid.innerHTML += movieCard;
    });
}

function showError(msg) {
    welcomeScreen.style.display = "none";
    movieGrid.innerHTML = `
        <div class="status-msg" style="color:#ef4444">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h2>Hata!</h2>
            <p>${msg}</p>
        </div>
    `;
}