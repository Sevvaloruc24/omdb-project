// Arama fonksiyonu güncellemesi
async function fetchMovies(query) {
    try {
        movieGrid.innerHTML = `<div class="status-msg"><h2>Aranıyor...</h2></div>`;
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
            localStorage.setItem("lastSearch", query);
        } else {
            // Eğer sonuç yoksa öneri sistemini çalıştır
            suggestAlternative(query);
        }
    } catch (err) {
        showError("Bağlantı hatası oluştu!");
    }
}

// "Bunu mu demek istediniz?" Mantığı
async function suggestAlternative(query) {
    // Kelimenin ilk 3-4 harfini alarak daha genel bir arama yapmayı dene
    const simplifiedQuery = query.substring(0, 4);
    const res = await fetch(`https://www.omdbapi.com/?s=${simplifiedQuery}&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === "True") {
        // İlk 3 öneriyi alalım
        const suggestions = data.Search.slice(0, 3).map(m => m.Title);

        movieGrid.innerHTML = `
            <div class="status-msg" style="color:#f59e0b">
                <i class="fa-solid fa-lightbulb"></i>
                <h2>"${query}" için sonuç bulamadık.</h2>
                <p>Acaba şunlardan birini mi demek istediniz?</p>
                <div class="suggestion-chips">
                    ${suggestions.map(s => `<span class="chip" onclick="autoSearch('${s}')">${s}</span>`).join('')}
                </div>
            </div>
        `;
    } else {
        showError("Hiçbir benzer sonuç bulunamadı.");
    }
}

// Öneriye tıklandığında otomatik arama yapması için
function autoSearch(title) {
    searchInput.value = title;
    fetchMovies(title);
}