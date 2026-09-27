# 三种设计研究的类型

静态网页，无构建步骤。

## 判断练习（2026-09-26 更新）

练习位于“并排比较”和“分类争议”之间，导航中可直接进入。六道教学构造情境包括三个主要取向明确的例子、两个交叉案例和一个信息不足案例。第六题支持补充信息后重新判断。

- 在 `script.js` 的 `exercises` 数组中维护题目、参考判断、依据与边界说明；修改题目时同步更新 `index.html` 的 `noscript` 阅读版本。
- 进度保存在页面内存中，不上传、不写入浏览器存储；刷新或重置会清空。
- 图片使用等尺寸展示框和 `object-fit: contain`，保留原图比例，点击可查看大图。
- 新增交互使用原生按钮和单选项；争议取向还支持方向键、Home / End，图片弹窗支持 Escape 和关闭后返回焦点。

## 本地查看

直接打开 `index.html`，或在本目录运行：

```powershell
python -m http.server 8000
```

访问 `http://localhost:8000/`。

## Vercel 公开部署

生产网址：https://week02-design-research.vercel.app/

本项目使用静态文件部署，配置见 `vercel.json`，无需构建。
在本目录运行以下命令可更新已关联的 Vercel 项目：

```powershell
npx --cache ../.vercel-cli-cache --registry https://registry.npmjs.org vercel --global-config ../.vercel-cli-config --prod
```
`.vercel/` 是本机的项目关联信息，不应放入提交压缩包；账号凭据保存在网页目录之外。
`.vercelignore` 排除了本地工具记录和维护说明。

## 发布到 GitHub Pages（备用）

1. 将本目录内容推送到独立 GitHub 仓库。
2. 在仓库 `Settings → Pages` 中选择 `Deploy from a branch`。
3. 选择 `main` 分支和 `/ (root)`。
4. 等待 GitHub 生成公开网址。

## 提交前检查

- 补入独立的分类争议论文。
- 核对全部 DOI、卷期、页码和原文位置。
- 替换页面中的小组信息。
- 确认 `assets/` 中三张论文原图的使用符合课程提交与论文引用要求。
- 在 320、375、414、768 px 宽度检查页面。
- 确认 GitHub Pages 无需登录即可访问。
