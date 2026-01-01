# Debug выгорания — сайт книги

Лендинг и каталог героев книги **"Debug выгорания: 50 историй IT-фениксов"** на Next.js (SSG). Проект собирается как статический export в папку `out/` и подходит для деплоя на SprintHost по FTP.

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте: http://localhost:3000

## Контент и админка

- Контент хранится в репозитории:
  - `content/landing.json`
  - `content/heroes/*.md`
- Админка Decap CMS доступна по `/admin`.

Для локального редактирования:

```bash
npx decap-server
npm run dev
```

Откройте: http://localhost:3000/admin

> Примечание: используется режим `local_backend`, поэтому редактирование рассчитано на локальную работу и коммит в репозиторий.

## Сборка и статический export

```bash
npm run build
npm run export
```

Результат будет в `out/`.

## Деплой по FTP (SprintHost)

1. Создайте файл `.env` по примеру `.env.example`.
2. Выполните экспорт.
3. Запустите скрипт деплоя:

```bash
npm run deploy:ftp
```

## Структура проекта

- `src/app` — страницы (App Router)
- `src/components` — UI-компоненты
- `src/lib/content.ts` — чтение контента
- `content` — контент сайта
- `public/uploads` — изображения из админки
- `public/admin` — Decap CMS
- `scripts/deploy-ftp.mjs` — FTP-деплой
