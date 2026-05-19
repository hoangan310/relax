# Relax

Truy cap trang demo chi tiet tai: [https://hoangan310.github.io/relax](https://hoangan310.github.io/relax)

Bo suu tap game nho xinh cho be, duoc host bang GitHub Pages va khong can backend
hay database.

## Cau truc

```text
docs/
  index.html
  styles.css
  script.js
  assets/images/
  flashcards/
    images/
    audio/
    mapping.json
  games/
```

- `docs/index.html`: trang chu liet ke danh sach game.
- `docs/styles.css`: style chung cho toan bo website.
- `docs/script.js`: du lieu va giao dien danh sach game.
- `docs/games/`: moi game nam trong mot trang rieng.
- `docs/assets/images/`: anh minh hoa cho card game.

## Game demo hien tai

- `Luyen tri nho 3x3`
  - Random 9 so tu `1` den `9`
  - Hien so trong mot khoang thoi gian nguoi choi nhap
  - Tu dong up bang lai sau khi het thoi gian
  - Click tung o de lat so
  - Co nut `Bat dau`, `Bat dau lai`, va `Back ve trang chu`
- `Lap lai thu tu`
  - Xem chuoi mau sang theo thu tu
  - Cham lai dung thu tu vua thay
  - Moi lan dung, chuoi se dai hon
- `Lat the tim cap`
  - Lat tung the de tim 2 the giong nhau
  - Co 3 cap don gian de be nho vi tri
  - Xao lai moi lan bat dau
- `Nho vi tri`
  - Xem cac o sang len trong choc lat
  - Cham lai dung cac vi tri vua thay
  - Moi lan dung, so o can nho se tang len
- `Tim cap trai cay`
  - Dung bo anh trai cay that de choi game tim cap hinh
  - Chon 3 muc do kho: `De` 5 cap, `Trung binh` 10 cap, `Kho` 15 cap
  - Tim het cac cap la chien thang
- `English flashcards`
  - Chon chu de (Animals, House, Body, Food, Nature) va bo the
  - Cham hinh de nghe tu tieng Anh tu `docs/flashcards/audio/`
  - Dung `Tiep theo` / `Truoc` de xem the tiep theo

## Chay local

Mo truc tiep file `docs/index.html` trong trinh duyet, hoac chay server tinh:

```bash
cd /Users/bcm/projects/annguyen/relax
python3 -m http.server 8000
```

Sau do mo:

- `http://localhost:8000/docs/`

## Kiem tra logic game

```bash
cd /Users/bcm/projects/annguyen/relax
node tests/memory-game.test.js
node tests/sequence-game.test.js
node tests/pairs-game.test.js
node tests/spots-game.test.js
node tests/fruit-pairs.test.js
node tests/flashcards.test.js
```

## Them game moi

1. Tao trang moi trong `docs/games/`, vi du `docs/games/new-game.html`.
2. Dung chung `../styles.css` de co giao dien dong bo.
3. Them nut quay lai:

```html
<a class="button-link secondary" href="../index.html">Back ve trang chu</a>
```

4. Tao anh minh hoa moi trong `docs/assets/images/`.
5. Cap nhat mang `games` trong `docs/script.js` de hien card tren trang chu.
6. Neu game co logic random hoac setup, them test nho trong `tests/`.

## Cac trang game hien tai

- `docs/games/memory.html`
- `docs/games/sequence.html`
- `docs/games/pairs.html`
- `docs/games/spots.html`
- `docs/games/fruit-pairs.html`
- `docs/games/flashcards.html`

## Deploy len GitHub Pages

1. Day repo len GitHub.
2. Vao `Settings` -> `Pages`.
3. O phan `Build and deployment`, chon:
   - `Source`: `Deploy from a branch`
   - `Branch`: branch chinh cua repo
   - `Folder`: `/docs`
4. Luu lai va doi GitHub Pages publish.

Sau khi publish, trang chu se la file `docs/index.html`.
