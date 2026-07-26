# Kanban Backend (dev)

Локальний «бекенд» для домашнього завдання Kanban. Тобі **не** треба знати, як він
влаштований усередині — це готовий сервер, який зберігає дані у файлі `db.json`
і віддає їх через звичайний REST API (GET / POST / PATCH / DELETE).

Твоє завдання — робити до нього запити з React-застосунку.

---

## 1. Як запустити (один раз перед роботою)

```bash
cd kanban-backend
npm install      # тільки першого разу
npm start        # запускає сервер
```

Після запуску побачиш:

```
Resources
http://localhost:4000/users
http://localhost:4000/columns
http://localhost:4000/cards
```

Сервер працює на **http://localhost:4000**. Залиш цей термінал відкритим,
поки працюєш. Щоб зупинити — `Ctrl + C`.

> 💡 Фронтенд (Vite) запускай в **окремому** терміналі. Один термінал — бекенд,
> другий — твій React-застосунок.

- `npm start` — із затримкою 400 мс (щоб було видно стан завантаження / спінери).
- `npm run start:fast` — без затримки, якщо хочеш швидше.

---

## 2. Які дані є (ресурси)

| Ресурс      | Що це                        | Поля                                                        |
| ----------- | ---------------------------- | ---------------------------------------------------------- |
| `users`     | користувачі (для логіну)     | `id`, `name`, `color`                                      |
| `columns`   | колонки дошки                | `id`, `title`, `order`, `limit` (WIP-ліміт, `null` = без ліміту) |
| `cards`     | картки                       | `id`, `title`, `description`, `columnId`, `order`, `assigneeId`, `checklist`, `createdAt` |

Звʼязки:
- у картки `columnId` → до якої колонки вона належить;
- у картки `assigneeId` → який користувач призначений (`null` = нікого);
- у картки `checklist` → масив підзадач `{ id, text, done }` (може бути порожнім `[]`);
- у колонки `limit` → максимум карток (WIP-ліміт), або `null`, якщо без обмеження.

---

## 3. Ендпоінти (усі перевірені й робочі)

### Отримати дані (GET)

```
GET  /users                         → усі користувачі
GET  /columns?_sort=order           → колонки, відсортовані по order
GET  /cards?_sort=order             → усі картки, відсортовані по order
GET  /cards?columnId=1              → картки лише однієї колонки
GET  /cards?columnId=1&_sort=order  → картки колонки, по порядку
GET  /cards/4                       → одна картка за id
```

### Створити картку (POST)

`id` генерується автоматично — не передавай його.

```
POST /cards
Content-Type: application/json

{
  "title": "Нова картка",
  "description": "Опис",
  "columnId": 1,
  "order": 5,
  "assigneeId": 2
}
```

### Оновити картку (PATCH) — головне для drag-and-drop

`PATCH` змінює **лише передані** поля. Саме так «переносиш» картку в іншу колонку
або міняєш порядок.

```
PATCH /cards/4
Content-Type: application/json

{ "columnId": 2, "order": 3 }
```

> ℹ️ Є ще `PUT` — він замінює картку **цілком**. Для завдання зручніший `PATCH`.

### Видалити картку (DELETE)

```
DELETE /cards/4
```

---

## 4. Приклад запиту з React (fetch)

```ts
const API = "http://localhost:4000";

// GET
const res = await fetch(`${API}/cards?_sort=order`);
const cards = await res.json();

// POST
await fetch(`${API}/cards`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, description, columnId, order, assigneeId }),
});

// PATCH (перенести картку)
await fetch(`${API}/cards/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ columnId: newColumnId, order: newOrder }),
});

// DELETE
await fetch(`${API}/cards/${id}`, { method: "DELETE" });
```

---

## 5. Корисне

- **Дані зберігаються реально** — усі зміни пишуться у `db.json`. Перезавантажиш
  сторінку — вони на місці.
- **Щось наплутала з даними?** Відкрий `db.json` і поверни руками, або попроси
  скинути до початкового стану.
- **Порт 4000 зайнятий?** Зміни порт у `package.json` (скрипт `start`) і в API-адресі
  свого застосунку.
- Перевірити швидко без React можна прямо в браузері: відкрий
  http://localhost:4000/cards
