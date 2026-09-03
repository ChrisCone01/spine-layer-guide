@echo off
echo ====================================
echo Photoshop Spine 图层整理工具
echo ====================================
echo.
echo 请选择运行方式：
echo.
echo 1. 直接在 Photoshop 中运行 JSX 脚本（推荐）
echo    - 打开 Photoshop
echo    - 文件 ^> 脚本 ^> 浏览
echo    - 选择: %~dp0spine_organizer.jsx
echo.
echo 2. 启动 MCP 服务器（高级用户）
echo    - 需要配置 Claude 客户端
echo    - 见 README.md 说明
echo.
pause

choice /c 12 /n /m "请输入选项 (1 或 2): "

if errorlevel 2 goto mcp
if errorlevel 1 goto jsx

:jsx
echo.
echo 正在打开 JSX 脚本所在文件夹...
explorer "%~dp0"
echo.
echo 请在 Photoshop 中：
echo 1. 打开你的 PSD 文件
echo 2. 文件 ^> 脚本 ^> 浏览
echo 3. 选择 spine_organizer.jsx
echo.
pause
exit

:mcp
echo.
echo 启动 MCP 服务器...
node index.js
pause
