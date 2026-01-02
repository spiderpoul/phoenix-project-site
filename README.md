# phoenix-project-site

## Запуск проекта

### Сайт

```bash
npm install
npm run dev
```

После запуска сайт доступен на `http://localhost:3000`.

### Админка (Decap CMS)

Единый скрипт поднимает сайт и CMS-сервер. Порт сайта можно менять через `ADMIN_PORT`,
порт CMS-сервера — через `ADMIN_CMS_PORT`.

```bash
npm run admin
```

По умолчанию:

- сайт: `http://localhost:3000`
- админка: `http://localhost:3000/admin`
- CMS-сервер: `http://localhost:8081`
