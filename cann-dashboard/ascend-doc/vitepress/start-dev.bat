@echo off
cd /d "D:\HW\AscendCANN\cann-dashboard\ascend-doc\vitepress"
node node_modules\vitepress\bin\vitepress.js dev --port 5300 > dev.log 2>&1
