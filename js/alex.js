document.addEventListener("DOMContentLoaded", () => {
  const sportNewsContainer = document.querySelector("#sport-news .news-block");

  const API_KEY = "e008f898cf954fc8af97a6aa06da6ab9";
  const URL = `https://newsapi.org/v2/top-headlines?category=sports&apiKey=${API_KEY}`;

  async function fetchSportNews() {
    try {
      const response = await fetch(URL);
      const data = await response.json();

      if (data.status === "ok") {
        displaySportNews(data.articles);
      } else {
        console.error("Ошибка загрузки данных: ", data.message);
      }
    } catch (error) {
      console.error("Ошибка API: ", error);
    }
  }

  function displaySportNews(articles) {
    sportNewsContainer.innerHTML = ""; 

    articles.forEach((article) => {
      const newsItem = document.createElement("div");
      newsItem.classList.add("news-img");

      newsItem.innerHTML = `
        <div class="img">
          <img src="${article.urlToImage || 'assets/img/placeholder.jpg'}" alt="${article.title}" />
        </div>
        <div class="text">
          <div class="title">
            <p>
              <a href="${article.url}" target="_blank">${article.title}</a>
            </p>
          </div>
        </div>
      `;

      sportNewsContainer.appendChild(newsItem);
    });
  }

  fetchSportNews();
});
