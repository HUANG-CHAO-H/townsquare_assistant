import React from 'react'
import ReactDOM from 'react-dom/client'
import {Home} from "./pages/Home";

const rootDiv = document.createElement('div');
rootDiv.id = 'assist-root';
document.body.appendChild(rootDiv);

ReactDOM.createRoot(rootDiv).render(
  <React.StrictMode><Home/></React.StrictMode>
);

// 添加CSS样式文件
[
    'https://unpkg.com/@douyinfe/semi-ui@2.17.1/dist/css/semi.css',
    'https://unpkg.com/@douyinfe/semi-icons@latest/dist/css/semi-icons.css'
].forEach(url => {
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.type = 'text/css';
    styleLink.href = url;
    document.head.appendChild(styleLink);
})