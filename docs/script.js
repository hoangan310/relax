const games = [
  {
    title: "Luyen tri nho 3x3",
    description:
      "Nhin nhanh vi tri cac so tu 1 den 9, doi bang bi up xuong roi lat tung o de nho lai.",
    href: "./games/memory.html",
    image: "./assets/images/memory-game.svg",
    cta: "Vao choi ngay",
  },
];

const gameList = document.querySelector("#game-list");

if (gameList) {
  gameList.innerHTML = games
    .map((game) => {
      return `
        <article class="game-card">
          <img src="${game.image}" alt="${game.title}" />
          <div class="game-card-body">
            <div>
              <h3>${game.title}</h3>
              <p>${game.description}</p>
            </div>
            <a class="button-link primary" href="${game.href}">${game.cta}</a>
          </div>
        </article>
      `;
    })
    .join("");
}
