```markdown
# 水墨风 竖向时间线（静态站 + Bilibili 缩略图抓取）

这个项目包含：
- index.html：水墨风竖向时间线静态页面（点击卡片在顶部播放 B 站视频 iframe）。
- data/timeline.json：时间线数据（包含你提供的 BV 示例）。
- download_thumbs.py：Python 脚本，从 B 站页面抓取缩略图并保存到静态目录（media/thumbs），会生成 data/timeline.withthumbs.json。
- requirements.txt：脚本依赖。

快速开始（本地预览）
1. 克隆或把文件保存到本地目录（保持目录结构）；
2. 创建并激活 Python 虚拟环境（可选）：
   ```
   python -m venv .venv
   source .venv/bin/activate   # macOS / Linux
   .venv\Scripts\activate      # Windows
   ```
3. 安装依赖：
   ```
   pip install -r requirements.txt
   ```
4. （可选）获取并保存缩略图（推荐）：
   ```
   python download_thumbs.py data/timeline.json media/thumbs
   ```
   - 脚本会读取 data/timeline.json，抓取每个 B 站页面的 og:image，保存到 media/thumbs/ 并生成 `data/timeline.withthumbs.json`（里面的 `media.thumbnail` 已指向本地文件路径）。
   - 请在能访问 bilibili.com 的环境运行脚本。
5. 本地启动一个 HTTP 服务器（必须，浏览器会阻止直接 file:// 的 fetch）：
   ```
   # Python 3 内置
   python -m http.server 8000
   # 然后在浏览器打开 http://localhost:8000
   ```
6. 打开页面并测试：点击卡片应在顶部播放器区域以 B 站官方播放器播放对应视频。若你运行了 `download_thumbs.py`，页面会显示本地缩略图（来自 media/thumbs/）。

部署到 GitHub Pages
- 把项目推到 GitHub（仓库），在仓库设置 -> Pages，选择 `main` 分支和根目录（或 /docs），启用 Pages。  
- 注意：如果你希望缩略图也被包含在仓库，请把 media/thumbs/ 目录加入并 commit（注意图片版权与仓库大小）。

注意事项与建议
- 抓取频率：脚本内带有短暂延迟以避免短时间大量请求。不要并发大量抓取以免触发对方限制。
- Autoplay：浏览器对自动播放有策略，用户点击触发播放通常允许；如果无法自动播放，请在播放器中手动点击播放或使用“打开原页”按钮。
- 合规/版权：请确保爬取并缓存缩略图用于展示不违反 B 站或作者的使用条款（尤其商业用途）。
- 如果你希望自动在 CI（GitHub Actions）中运行抓缩略图并提交到仓库，我可以为你生成一个 workflow 文件（需要你授权向仓库推送 CI 提交）。

如果你需要我把这个项目打包为一个 zip 文件或帮你直接建立 GitHub 仓库并推送（你提供仓库权限），我也可以继续帮你处理。
```