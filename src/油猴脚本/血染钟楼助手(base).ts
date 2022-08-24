// ==UserScript==
// @name         血染钟楼助手(base)
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  向https://www.imdodo.com/tools/clocktower/页面注入一些JavaScript代码，来帮助说书人完成一些自动化操作，让说书人能够更加高效的工作
// @author       huangchao.hello
// @match        https://www.imdodo.com/tools/clocktower/
// @icon         <$ICON$>
// ==/UserScript==


/* **************************************************************************** */
/* ****************************** 获取游戏状态JSON ****************************** */
/* **************************************************************************** */

async function readGameState(): Promise<GameStateJSON | null> {
  let textarea: HTMLTextAreaElement | null = null;
  for (let i = 0; i < 3; i++) {
    textarea = document.querySelector("div.modal-backdrop.game-state div.slot > textarea");
    if (textarea) break;
    await GameStateJSONClick();
    await sleep(100);
  }
  if (!textarea) {
    console.error("getGameState 执行失败！！！");
    return null;
  }
  const stateValue = JSON.parse(textarea.value);
  await GameStateJSONClick();
  return stateValue;
}
async function GameStateJSONClick() {
  for (let i = 0; i < 3; i++) {
    const liArray = document.querySelectorAll(
        "div.menu > ul > li"
    ) as NodeListOf<HTMLLIElement>;
    if (!liArray || !liArray.length) return console.error("未捕获到li数组");
    if (liArray.length === 9) {
      if (liArray[4].innerHTML.search("file-code") > 0) {
        await dispatchClickEvent(liArray[4]);
        return;
      }
    }
    // help 按钮
    const helpSvg = document.querySelector(
        "div.menu > ul > li.tabs > svg.fa-question"
    ) as HTMLElement;
    if (!helpSvg) return console.error("未捕获到help按钮");
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
async function openChatWindow(userIndex: number): Promise<boolean> {
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
async function sendMessage(
  userIndex: number,
  message: string = "",
  autoSend: boolean = false
): Promise<boolean> {
  if (!await openChatWindow(userIndex)) return false;
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
    const chatButton = chatContainer.querySelector(
      "div.input-wrap > div > div.btn"
    ) as HTMLButtonElement | null;
    if (!chatButton) {
      console.error("捕获聊天发送按钮失败");
      return false;
    }
    await dispatchClickEvent(chatButton);
  }
  return true;
}

declare global {
  interface Window {
    GameAssistant?: {
      openChatWindow: typeof openChatWindow;
      sendMessage: typeof sendMessage;
      readGameState: typeof readGameState;
    };
  }

  let unsafeWindow: Window

  interface GameStateJSON {
    bluffs: Array<unknown>;
    fabled: [];
    edition: { id: "snv" | "custom" };
    roles: "" | Array<{ id: string }>;
    players: Array<{
      // 玩家头像链接
      avatarUrl: string;
      // 未读消息数量
      countUnread: number;
      // 玩家name，如果座位上没有玩家则这里将填充座位号
      name: number | string;
      // 玩家ID
      id: string;
      // 玩家是否死亡
      isDead: boolean;
      // 玩家是否为静音状态
      isMute: boolean;
      // 是否是开放式麦克风
      isOpenMic: boolean;
      // 是否正在说话
      isTalking: boolean;
      // 是否还有投票权
      isVoteless: boolean;
      // 人称代词（自定义昵称）
      pronouns: string;
      // 标记与提示（自定义添加）
      reminders: [];
      // 玩家当前角色
      role: {};
    }>;
  }
}

if (unsafeWindow) {
  unsafeWindow.GameAssistant = {openChatWindow, sendMessage, readGameState}
} else {
  window.GameAssistant = {openChatWindow, sendMessage, readGameState}
}
export {};



// 休眠
function sleep(time: number) {
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
