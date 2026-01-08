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

## Деплой на FTP

Скрипт деплоя находится в `scripts/deploy.js` и работает с уже собранной статикой в папке `out/`.

### Быстрый старт

1. Соберите статику:

```bash
npm run build
```

2. Подготовьте `.env` с настройками FTP:

```
FTP_HOST=example.com
FTP_USER=username
FTP_PASSWORD=secret
FTP_REMOTE_DIR=/path/on/server
```

3. Запустите деплой:

```bash
node scripts/deploy.js
```

### Инкрементальный деплой (по умолчанию)

Скрипт хранит `.deploy-manifest.json` в корне `FTP_REMOTE_DIR` и заливает только изменившиеся файлы
по `size` и `sha256` хэшу. При первом запуске все файлы будут загружены, а manifest создан.

### Полный деплой (очистка и загрузка всего)

Чтобы полностью пересоздать папку на сервере, используйте:

```bash
DEPLOY_FULL=true node scripts/deploy.js
```

### Dry-run режим

Показывает план загрузки/удаления без изменений на сервере:

```bash
DEPLOY_DRY_RUN=true node scripts/deploy.js
```

### Удаление лишних файлов на сервере

По умолчанию включено (деплой зеркалит билд): удаляет файлы, которые есть в remote manifest,
но отсутствуют локально. Чтобы отключить удаление:

```bash
DEPLOY_DELETE=false node scripts/deploy.js
```

### Дополнительные переменные окружения

- `DEPLOY_CONCURRENCY` — параллельность загрузки (по умолчанию `3`).
- `DEPLOY_MANIFEST_NAME` — имя манифеста (по умолчанию `.deploy-manifest.json`).
- `FTP_VERBOSE` — подробные логи клиента FTP (`true/false`).
