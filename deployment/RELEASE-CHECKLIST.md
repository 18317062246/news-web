# ccdata 发布检查清单

## 发布前

- 确认现有虚拟主机的 `/api/` 路由仍指向内容 API，且不进入 SPA 回退。
- 将 `nginx-ccdata.conf` 合并到现有虚拟主机，确认更具体的既有 location 不会覆盖 `/ccdata/`、`/m/ccdata/` 或 `/_ccdata_assets/`。
- 配置 `NUXT_PUBLIC_API_BASE` 指向浏览器可访问的同源 API 前缀，或使用明确开放 CORS 的 HTTPS API 域名；不得在前端放置服务密钥。
- 在可访问目标 API 和 OSS 的预发布浏览器中检查首页、栏目、文章详情、`platform=pc|wap`、图片和富文本资源。
- 运行 `npm ci`、`npm run typecheck` 和 `npm run generate`，确认 `.output/public/index.html` 与 `.output/public/_ccdata_assets/` 构建资源存在。

## 灰度

- 将 `.output/public/` 上传到新的版本化目录，例如 `/var/www/ccdata/releases/<build-id>/`，不要覆盖当前线上目录。
- 检查新目录包含 `index.html` 和 `_ccdata_assets/` 中所有构建文件。
- 修正部署配置的静态 root，使 `/var/www/ccdata-current` 指向该版本目录，再执行 `nginx -t` 并平滑 reload。
- 对灰度域名或小流量入口验证 `/ccdata/`、首页深链、旧栏目链接、文章 `.html` 链接、`/m/ccdata/` 跳转、`/api/` 返回 JSON 和静态资源缓存头。
- 检查浏览器控制台、网络面板、图片加载、桌面/移动视口和刷新/分享深链行为。

## 全量与回滚

- 灰度通过后扩大流量；继续观察 API 错误率、页面资源 404、前端异常和跳转行为。
- 回滚时把 `/var/www/ccdata-current` 指回上一个版本，执行 `nginx -t` 和平滑 reload。
- 只有新站运行稳定且数据 API 持续服务后，才安排旧 JSP 展示职责下线；保留旧版本和旧路由回滚窗口。

## 当前构建注意

Nuxt 生成入口位于 `.output/public/index.html`，构建资源目录为 `.output/public/_ccdata_assets/`。示例 Nginx root `/var/www/ccdata-current` 必须指向这两个条目的父目录。当前配置为客户端渲染 SPA；HTML 不包含预渲染的文章内容，搜索引擎和首屏内容要求需在发布前单独确认。
