# ccdata-web

当前代码版本：`keio1`（见 `VERSION`）。

Nuxt 4 / Vue 3 client rendered frontend for ccdata. The first release allows only the `ccdata` site; site metadata and optional sidebar modules are configuration driven so later sites can share the same pages.

## Local development

```sh
npm install
npm run dev
```

By default the browser requests the existing production API at `https://news.centanet.com/api/`. Set `NUXT_PUBLIC_API_BASE` when using a different API base, such as the test API `https://testnews.centanet.com/api/`. The API must allow browser requests and must not require a secret embedded in frontend code.

本地只验收页面布局时，可以复制 `.env.example` 为 `.env` 并将 `NUXT_PUBLIC_MOCK_API` 改为 `true`。演示数据只用于开发环境；联调真实资讯前必须改回 `false`，并确保 `/api/` 已由内容 API 提供服务。

## Static output

```sh
npm run generate
```

Publish the generated `.output/public` files to the existing static hosting/CDN. The host must return the SPA entry for `/ccdata/`, its list routes, and article deep links, while serving `/_ccdata_assets/` files normally. Existing article media and shared assets may continue to use their approved OSS/CDN URLs.

An Nginx location example is in `deployment/nginx-ccdata.conf`. It is a deployment template, not a drop-in replacement for the existing virtual host: review location precedence and keep `/api/` outside the SPA fallback. The old `/m/ccdata/` paths are redirected to the responsive `/ccdata/` routes.

The generated site reads article data at runtime from the existing API. Publishing new articles does not require rebuilding this frontend. Changes to page code or styles do.

The API platform follows the responsive breakpoint: widths up to 767px request `platform=wap`; wider screens request `platform=pc`. Crossing the breakpoint reloads the current columns and content so the API can apply its existing platform-specific filters.

The build currently creates `.output/public/index.html`, not `ccdata/index.html`. The Nginx template uses a named fallback to serve that entry without sending internal redirects into the existing site's root handler. Legacy `/ccdata/list/c{id}/`, `/ccdata/list/c{id}/p{page}/` and `/ccdata/list/p{page}/` links redirect in the browser to the new list query route; the mobile prefix is removed by Nginx first. Unknown paths still show a page-not-found error.
