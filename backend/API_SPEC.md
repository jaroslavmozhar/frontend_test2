# Backend API Специфікація - Архів Кримінальних Серіалів

## Огляд
Backend API для синхронізації даних між пристроями. Використовує FastAPI + MongoDB.

## База даних: MongoDB

### Колекція: series_archive
```javascript
{
  _id: ObjectId,
  id: String (UUID для frontend),
  title: String,
  watched: Boolean,
  rating: Number (0-10),
  notes: [
    {
      author: String ("Maria" | "Yaroslav"),
      text: String,
      timestamp: ISODate
    }
  ],
  created_at: ISODate,
  updated_at: ISODate
}
```

### Колекція: series_wishlist
Така сама структура як series_archive

---

## API Endpoints

### 1. Архів серіалів

#### GET /api/series
Отримати всі серіали з архіву
- **Response 200:**
```json
[
  {
    "id": "uuid",
    "title": "Mindhunter",
    "watched": true,
    "rating": 9,
    "notes": [
      {
        "author": "Maria",
        "text": "Чудовий серіал...",
        "timestamp": "2025-02-01T10:00:00Z"
      }
    ]
  }
]
```

#### POST /api/series
Додати новий серіал до архіву
- **Request Body:**
```json
{
  "id": "uuid",
  "title": "New Series",
  "watched": false,
  "rating": 0,
  "notes": []
}
```
- **Response 201:** Створений серіал

#### PUT /api/series/{id}
Оновити серіал (нотатки, рейтинг, статус)
- **Request Body:** Повний об'єкт серіалу
- **Response 200:** Оновлений серіал

#### DELETE /api/series/{id}
Видалити серіал з архіву
- **Response 204:** No content

---

### 2. Список бажань

#### GET /api/wishlist
Отримати всі серіали зі списку бажань
- **Response 200:** Масив серіалів

#### POST /api/wishlist
Додати серіал до списку бажань
- **Request Body:** Об'єкт серіалу
- **Response 201:** Створений серіал

#### PUT /api/wishlist/{id}
Оновити серіал у списку бажань
- **Request Body:** Повний об'єкт серіалу
- **Response 200:** Оновлений серіал

#### DELETE /api/wishlist/{id}
Видалити серіал зі списку бажань
- **Response 204:** No content

---

## Frontend інтеграція

### Стратегія:
1. При завантаженні сторінки: спробувати завантажити з API
2. Якщо API недоступний: використати LocalStorage як fallback
3. При кожній зміні: зберігати і в API, і в LocalStorage
4. LocalStorage як кеш для офлайн режиму

### Файли для зміни:
- `/app/frontend/src/pages/LandingPage.jsx` - додати API виклики
- `/app/frontend/src/services/api.js` (НОВИЙ) - API клієнт

### Backend файли:
- `/app/backend/models/series.py` (НОВИЙ) - Pydantic моделі
- `/app/backend/routes/series.py` (НОВИЙ) - API endpoints
- `/app/backend/server.py` (ОНОВИТИ) - підключити роути

---

## План реалізації

### Етап 1: Backend
1. Створити Pydantic моделі для серіалів
2. Створити API endpoints (routes)
3. Підключити до server.py
4. Перевірити через curl

### Етап 2: Frontend інтеграція
1. Створити API клієнт service
2. Оновити LandingPage для використання API
3. Зберегти LocalStorage як fallback

### Етап 3: Тестування
1. Тестувати синхронізацію між браузерами
2. Тестувати офлайн режим
3. Тестувати міграцію даних з LocalStorage в MongoDB
