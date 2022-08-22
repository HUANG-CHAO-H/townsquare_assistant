// ==UserScript==
// @name         血染钟楼（说书人）助手
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  向https://www.imdodo.com/tools/clocktower/页面注入一些JavaScript代码，来帮助说书人完成一些自动化操作，让说书人能够更加高效的工作
// @author       huangchao.hello
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://www.imdodo.com/tools/clocktower/
// @icon         <$ICON$>
// ==/UserScript==

/**
 * 向某个玩家发送聊天消息
 * @param userIndex 玩家座位号
 * @param message   消息内容
 * @param autoSend  是否自动发送（默认为false，需要说书人手动点击发送）
 */
async function sendMessage(
  userIndex: number,
  message: string = "",
  autoSend: boolean = false
): Promise<boolean> {
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
      const li = menuUl.lastChild as HTMLLIElement;
      if (!li.innerText.includes("私聊")) {
        console.error("未捕获到“私聊”按钮");
        return false;
      }
      dispatchClickEvent(li);
      await sleep(100);
      break;
    }
    dispatchClickEvent(seatDiv.querySelector("div.name"));
    await sleep(100);
  }
  const chatContainer = document.querySelector("div.df-chat-detail");
  if (!chatContainer) {
    console.error("打开聊天窗口失败");
    return false;
  }
  const chatInputDiv = chatContainer.querySelector(
    "div.input-wrap > div > div#content"
  );
  if (!chatInputDiv) {
    console.error("捕获聊天输入框元素失败");
    return false;
  }
  chatInputDiv.innerHTML = message;
  const event = new InputEvent("input");
  chatInputDiv.dispatchEvent(event);
  // 是否自动发送
  if (autoSend) {
    await sleep(100);
    const chatButton = chatContainer.querySelector(
      "div.input-wrap > div > div.btn"
    ) as HTMLButtonElement | null;
    if (!chatButton) {
      console.error("捕获聊天发送按钮失败");
      return false;
    }
    dispatchClickEvent(chatButton);
  }
  return true;
}

/**
 * 获取游戏状态
 */
async function getGameState(): Promise<GameStateJSON | null> {
  for (let i = 0; i < 3; i++) {
    const textarea = document.querySelector(
      "div.modal-backdrop.game-state div.slot > textarea"
    ) as HTMLTextAreaElement;
    if (textarea) {
      const value = JSON.parse(textarea.value);
      await GameStateJSONClick();
      return value;
    }
    await GameStateJSONClick();
    await sleep(100);
  }
  console.error("getGameState 执行失败！！！");
  return null;
}

/* ****************************** 游戏状态JSON按钮 ****************************** */
async function GameStateJSONClick() {
  for (let i = 0; i < 3; i++) {
    const liArray = document.querySelectorAll(
      "div.menu > ul > li"
    ) as NodeListOf<HTMLLIElement>;
    if (!liArray || !liArray.length) return console.error("未捕获到li数组");
    if (liArray.length === 9) {
      if (liArray[4].innerHTML.search("游戏状态JSON") > 0) {
        dispatchClickEvent(liArray[4]);
        return;
      }
    }
    // help 按钮
    const helpSvg = document.querySelector(
      "div.menu > ul > li.tabs > svg.fa-question"
    ) as HTMLElement;
    if (!helpSvg) return console.error("未捕获到help按钮");
    dispatchClickEvent(helpSvg);
    await sleep(100);
  }
  console.error("GameStateJSONClick 执行失败！！！");
}

// 休眠
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// 触发click事件
function dispatchClickEvent(element: HTMLElement | null): Promise<boolean> {
  if (!element) return Promise.resolve(false);
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

declare global {
  interface Window {
    GameAssistant?: {
      sendMessage: typeof sendMessage;
      getGameState: typeof getGameState;
    };
  }

  interface GameStateJSON {
    bluffs: Array<unknown>;
    fabled: [];
    edition: { id: "snv" | "custom" };
    roles: "" | Array<{ id: string }>;
    players: Array<{
      avatarUrl: string;
      countUnread: number;
      name: number | string;
      id: string;
      isDead: boolean;
      isMute: boolean;
      isOpenMic: boolean;
      isTalking: boolean;
      isVoteless: boolean;
      pronouns: string;
      reminders: [];
      role: {};
    }>;
  }
}

window.GameAssistant = {sendMessage, getGameState}
export {};