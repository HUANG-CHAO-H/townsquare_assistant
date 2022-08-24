// ==UserScript==
// @name         血染钟楼助手(base)
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  向https://www.imdodo.com/tools/clocktower/页面注入一些JavaScript代码，来帮助说书人完成一些自动化操作，让说书人能够更加高效的工作
// @author       huangchao.hello
// @match        https://www.imdodo.com/tools/clocktower/
// @icon         <$ICON$>
// ==/UserScript==
const pageState = ReactiveData({
    gameState: undefined,
    chatHtml: '',
    isReadingState: false,
});
async function observeDom() {
    let app = null;
    for (let i = 0; i < 10; i++) {
        app = document.querySelector('#app');
        if (app)
            break;
        await sleep(200);
    }
    if (!app)
        throw new Error('找不到 #app 的 div');
    const appObserver = new MutationObserver(record => {
        console.log('record = ', record);
        readGameState();
    });
    appObserver.observe(app, { childList: true, subtree: true });
}
observeDom();
/* **************************************************************************** */
/* ****************************** 获取游戏状态JSON ****************************** */
/* **************************************************************************** */

let gameStateString = '';
async function readGameState() {
    if (pageState.isReadingState)
        return;
    pageState.isReadingState = true;
    await sleep(100);
    let textarea = null;
    for (let i = 0; i < 3; i++) {
        textarea = document.querySelector("div.modal-backdrop.game-state div.slot > textarea");
        if (textarea)
            break;
        await GameStateJSONClick();
        await sleep(100);
    }
    if (!textarea) {
        console.error("getGameState 执行失败！！！");
        return;
    }
    const str = textarea.value;
    await GameStateJSONClick();
    if (gameStateString !== str) {
        pageState.gameState = JSON.parse(textarea.value);
    }
    pageState.isReadingState = false;
}
async function GameStateJSONClick() {
    for (let i = 0; i < 3; i++) {
        const liArray = document.querySelectorAll("div.menu > ul > li");
        if (!liArray || !liArray.length)
            return console.error("未捕获到li数组");
        if (liArray.length === 9) {
            if (liArray[4].innerHTML.search("file-code") > 0) {
                await dispatchClickEvent(liArray[4]);
                return;
            }
        }
        // help 按钮
        const helpSvg = document.querySelector("div.menu > ul > li.tabs > svg.fa-question");
        if (!helpSvg)
            return console.error("未捕获到help按钮");
        await dispatchClickEvent(helpSvg);
        await sleep(100);
    }
    console.error("GameStateJSONClick 执行失败！！！");
}
/* **************************************************************************** */
/* *************************** 向某个玩家发送聊天消息 **************************** */
/* **************************************************************************** */
/**
 * 打开某个玩家的聊天窗口
 * @param userIndex
 */
async function openChatWindow(userIndex) {
    const allUser = document.querySelectorAll("#townsquare > ul.circle > li");
    if (userIndex < 1 || userIndex > allUser.length) {
        console.error("userIndex 超出了预定范围", userIndex);
        return false;
    }
    const seatDiv = allUser[userIndex - 1].querySelector("div.player");
    if (!seatDiv) {
        console.error("未捕捉到用户座位所在的div");
        return false;
    }
    for (let i = 0; i < 3; i++) {
        const menuUl = seatDiv.querySelector("ul.menu");
        if (menuUl) {
            const li = menuUl.lastChild;
            await dispatchClickEvent(li);
            await sleep(50);
            break;
        }
        await dispatchClickEvent(seatDiv.querySelector("div.name"));
        await sleep(50);
    }
    const chatContainer = document.querySelector("div.df-chat-detail");
    if (!chatContainer) {
        console.error("打开聊天窗口失败");
        return false;
    }
    return true;
}
/**
 * 向某个玩家发送聊天消息
 * @param userIndex 玩家座位号
 * @param message   消息内容
 * @param autoSend  是否自动发送（默认为false，需要说书人手动点击发送）
 */
async function sendMessage(userIndex, message = "", autoSend = false) {
    if (!await openChatWindow(userIndex))
        return false;
    const chatContainer = document.querySelector("div.df-chat-detail");
    if (!chatContainer) {
        console.error("打开聊天窗口失败");
        return false;
    }
    const chatInputDiv = chatContainer.querySelector("div.input-wrap > div > div#content");
    if (!chatInputDiv) {
        console.error("捕获聊天输入框元素失败");
        return false;
    }
    chatInputDiv.innerHTML = message;
    const event = new InputEvent("input");
    chatInputDiv.dispatchEvent(event);
    // 是否自动发送
    if (autoSend) {
        const chatButton = chatContainer.querySelector("div.input-wrap > div > div.btn");
        if (!chatButton) {
            console.error("捕获聊天发送按钮失败");
            return false;
        }
        await dispatchClickEvent(chatButton);
    }
    return true;
}
if (unsafeWindow) {
    unsafeWindow.GameAssistant = { openChatWindow, sendMessage, pageState };
}
else {
    window.GameAssistant = { openChatWindow, sendMessage, pageState };
}

// 休眠
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
// 触发click事件
function dispatchClickEvent(element) {
    if (!element)
        return Promise.resolve(false);
    const createEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
    });
    return new Promise((resolve) => {
        setTimeout(() => resolve(false), 50);
        element.addEventListener("click", () => resolve(true), { once: true });
        element.dispatchEvent(createEvent);
    });
}
function ReactiveData(record) {
    // 监听函数集合
    const listenerMap = new Map();
    for (const key of Object.keys(record)) {
        listenerMap.set(key, new Set());
    }
    // 浅拷贝 & 添加三个关键函数
    const result = Object.assign({}, record);
    result.observe = (key, callback) => {
        const set = listenerMap.get(key);
        if (set)
            set.add(callback);
        else
            throw new Error('key is unknown');
    };
    result.unobserve = (key, callback) => {
        const set = listenerMap.get(key);
        if (set)
            set.delete(callback);
        else
            throw new Error('key is unknown');
    };
    result.wait = (key, callback) => new Promise(resolve => {
        if (callback(result[key]))
            return resolve();
        const set = listenerMap.get(key);
        if (!set)
            throw new Error('key is unknown');
        const onceCallback = value => {
            if (callback(value)) {
                set.delete(onceCallback);
                resolve();
            }
        };
        set.add(onceCallback);
    });
    return new Proxy(result, {
        set(target, p, value) {
            if (target[p] === value)
                return true;
            if (p === 'observe' || p === 'unobserve' || p === 'wait')
                return false;
            const listeners = listenerMap.get(p);
            if (!listeners)
                return false;
            target[p] = value;
            for (let listener of listeners)
                listener(value);
            return true;
        }
    });
}
export {};
