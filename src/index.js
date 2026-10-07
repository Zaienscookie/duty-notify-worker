// 宿舍值日通知 Worker
// 1) Cron 每天触发 -> 计算今天值日 -> 推送到 webhook（企业微信/Server酱/PushPlus）
// 2) GET 访问 -> 手动测试

export default {
  // 定时触发（wrangler.toml 里配置 cron）
  async scheduled(event, env, ctx) {
    const msg = dutyMessage();
    if (!msg) return;
    const webhook = env.WEBHOOK_URL;
    if (!webhook) return;
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'text',
        text: { content: msg }
      })
    });
  },

  // 手动测试: 浏览器访问 worker 域名 /?test=1 或 ?date=2026-10-08
  async fetch(request, env) {
    const url = new URL(request.url);
    const dateStr = url.searchParams.get('date');
    const msg = dateStr ? dutyMessageFor(dateStr) : dutyMessage();
    return new Response(msg || '今天休息', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
};

// ===== 配置（与日历页一致）=====
const NAMES = ["1号", "2号", "3号", "4号", "5号", "6号"];
const START_DATE = "2026-10-01";   // 排班起点(当天1号)
const HOLIDAYS = [];                // 法定节假日(可自行添加)

function iso(d) { return d.toISOString().slice(0, 10); }
function isHoliday(s) { return HOLIDAYS.includes(s); }

function dutyMessage() { return dutyMessageFor(iso(new Date())); }

function dutyMessageFor(dateStr) {
  const target = new Date(dateStr + "T00:00:00");
  const start = new Date(START_DATE + "T00:00:00");
  let count = 0;
  const cur = new Date(start);
  while (cur <= target) {
    const wd = cur.getDay();
    if (wd !== 0 && wd !== 6 && !isHoliday(iso(cur))) count++;
    cur.setDate(cur.getDate() + 1);
  }
  if (!count) return null;
  const who = NAMES[(count - 1) % NAMES.length];
  return `📢 今天(${target.getMonth() + 1}月${target.getDate()}日)轮到 ${who} 值日！\n记得打扫卫生哦～`;
}
