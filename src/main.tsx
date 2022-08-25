// ==UserScript==
// @name         血染钟楼(说书人)助手
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  向https://www.imdodo.com/tools/clocktower/页面注入一些JavaScript代码，来帮助说书人完成一些自动化操作，让说书人能够更加高效的工作
// @author       huangchao.hello
// @match        https://www.imdodo.com/tools/clocktower/
// @icon         <$ICON$>
// ==/UserScript==

import React from 'react'
import ReactDOM from 'react-dom/client'
import {Home} from "./pages/Home";
import {insertCssLink} from "./utils";

// 插入DOM元素(根节点)
const rootDiv = document.createElement('div');
rootDiv.id = 'assist-root';
rootDiv.style.position = 'absolute';
rootDiv.style.top = '0';
rootDiv.style.width = '100%';
document.body.appendChild(rootDiv);
// 添加CSS样式文件
insertCssLink('https://unpkg.com/@douyinfe/semi-ui@2.17.1/dist/css/semi.css');
insertCssLink('https://unpkg.com/@douyinfe/semi-icons@2.17.1/dist/css/semi-icons.css');

ReactDOM.createRoot(rootDiv).render(
    <React.StrictMode><Home/></React.StrictMode>
);