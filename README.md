# 宿舍值日通知 Worker

Cloudflare Workers 定时任务：每天 07:30（北京时间）推送「今天谁值日」到微信。

## 部署（面板方式，无需 wrangler）

1. **Cloudflare 面板** → Workers & Pages → 创建 Worker
2. 粘贴 `src/index.js` 内容 → 保存并部署
3. **设置** → **触发器** → **Cron 触发器** → 添加：`30 23 * * *`（= 北京 07:30）
4. **设置** → **变量和机密** → 添加 Secret：`WEBHOOK_URL` = 你的 webhook 地址
5. 访问 worker 域名 `/?date=2026-10-08` 可手动测试

## webhook 出口（任选其一）

- **企业微信群机器人**：POST 消息全员可见（推荐）
- **Server酱**：sctapi.ftqq.com/{key}.send（推个人微信）
- **PushPlus**：pushplus.plus/send（推个人微信）
