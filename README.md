# Relax

Bo suu tap game nho xinh cho be, duoc host bang GitHub Pages va khong can backend
hay database.

## Cau truc

```text
docs/
  index.html
  styles.css
  script.js
  assets/images/
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

## Deploy len GitHub Pages

1. Day repo len GitHub.
2. Vao `Settings` -> `Pages`.
3. O phan `Build and deployment`, chon:
   - `Source`: `Deploy from a branch`
   - `Branch`: branch chinh cua repo
   - `Folder`: `/docs`
4. Luu lai va doi GitHub Pages publish.

Sau khi publish, trang chu se la file `docs/index.html`.
