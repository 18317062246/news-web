FROM shharbor.centaline.com.cn/app/node:24.18.0-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmmirror.com

RUN npm ci

COPY . .

# Sentry 构建期参数（CI 通过 --build-arg 传入）：
#   SENTRY_AUTH_TOKEN  开启 sourcemap 生成并触发上传（仅 builder 阶段可见，不进最终镜像）
#   SENTRY_RELEASE     版本号（commit sha 或 tag），运行时报错按此关联到 release
# 两者都不传时行为与未接 Sentry 构建期完全一致，不影响构建产物
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_RELEASE

ENV SENTRY_RELEASE=$SENTRY_RELEASE

RUN npm run build && sh -c 'if [ -n "$SENTRY_AUTH_TOKEN" ]; then SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN" npm run sentry:sourcemaps; else echo "[docker] 未提供 SENTRY_AUTH_TOKEN，跳过 sourcemap 上传"; fi'

FROM shharbor.centaline.com.cn/app/node:24.18.0-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV HOST=0.0.0.0 \
    PORT=3000 \
    NUXT_PUBLIC_ENV=prd

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
