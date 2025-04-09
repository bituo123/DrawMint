const { build } = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const path = require("path");

const dev = async () => {
  try {
    await build({
      entryPoints: ["index.tsx"], // 以 index.tsx 作为入口
      outfile: "dist/dev/app.js", // 输出到 dist/dev/app.js
      bundle: true, // 打包所有依赖
      format: "iife", // 使用 IIFE 格式，适合浏览器直接运行
      target: "es2020", // 目标浏览器环境
      sourcemap: true, // 生成源映射，便于调试
      define: {
        "process.env.NODE_ENV": '"development"', // 定义开发环境变量
      },
      loader: {
        ".tsx": "tsx", // 处理 TypeScript 和 JSX
        ".ts": "ts",
        ".woff2": "file", // 处理字体文件
      },
      plugins: [sassPlugin()], // 支持 Sass 文件
      watch: {
        onRebuild(error, result) {
          if (error) console.error("Rebuild failed:", error);
          else console.log("Rebuild succeeded:", result);
        },
      }, // 监听文件变化
      logLevel: "info", // 显示构建日志
    });
    console.log("Development server started. Watching for changes...");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

// 创建简单的 HTML 文件用于加载 app.js
const fs = require("fs");
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Excalidraw Dev</title>
  <link rel="stylesheet" href="app.css" />
</head>
<body>
  <div id="root"></div>
  <script src="app.js"></script>
</body>
</html>
`;
fs.mkdirSync("dist/dev", { recursive: true });
fs.writeFileSync("dist/dev/index.html", htmlContent);

dev();