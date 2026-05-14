const games = [
  {
    title: "Luyen tri nho 3x3",
    description:
      "Nhin nhanh vi tri cac so tu 1 den 9, doi bang bi up xuong roi lat tung o de nho lai.",
    href: "./games/memory.html",
    image: "./assets/images/memory-game.svg",
    cta: "Vao choi ngay",
  },
  {
    title: "Lap lai thu tu",
    description:
      "Nhin cac mau sang theo thu tu, roi cham lai dung tung buoc mot.",
    href: "./games/sequence.html",
    image: "./assets/images/sequence-game.svg",
    cta: "Thu nho thu tu",
  },
  {
    title: "Lat the tim cap",
    description:
      "Lat tung the de tim 2 the giong nhau va nho vi tri cua tung cap.",
    href: "./games/pairs.html",
    image: "./assets/images/pairs-game.svg",
    cta: "Tim cac cap",
  },
  {
    title: "Nho vi tri",
    description:
      "Nhin cac o sang len trong choc lat, roi cham lai dung cac vi tri vua thay.",
    href: "./games/spots.html",
    image: "./assets/images/spots-game.svg",
    cta: "Thu nho vi tri",
  },
  {
    title: "Tim cap trai cay",
    description:
      "Dung bo anh trai cay that de lat the va tim cac cap hinh giong nhau theo 3 muc do kho.",
    href: "./games/fruit-pairs.html",
    image: "./assets/images/fruit-collection.png",
    cta: "Tim cap hinh",
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
