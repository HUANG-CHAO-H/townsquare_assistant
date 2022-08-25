import {sleep, dispatchClickEvent} from "../utils";

/**
 * 获取当前游戏状态弹窗所在的div
 */
export function getGameStateJsonDiv(): HTMLDivElement | null {
  return document.querySelector("div.modal-backdrop.game-state");
}

/**
 * 控制gameStateJsonDiv的开启关闭状态
 * @param isOpen 是开启还是关闭
 */
export async function gameStateJsonDiv(isOpen: boolean = true): Promise<void> {
  // 先判断状态与预期是否一致
  let dialogDiv: HTMLDivElement | null = getGameStateJsonDiv();
  if (isOpen) {
    if (dialogDiv) return;
  } else {
    if (!dialogDiv) return;
  }
  // 第一步,获取游戏状态JSON按钮
  let gameStateButton: HTMLLIElement | null = null;
  for (let i = 0; i < 3; i++) {
    const liArray = document.querySelectorAll("div.menu > ul > li") as NodeListOf<HTMLLIElement>;
    if (!liArray || !liArray.length) throw new Error('未捕获到li数组');
    if (liArray.length === 9 && liArray[4].innerText.includes('JSON')) {
      gameStateButton = liArray[4];
      break;
    }
    // help 按钮
    const helpSvg = document.querySelector("div.menu > ul > li.tabs > svg.fa-question") as HTMLElement;
    if (!helpSvg) throw new Error('未捕获到help按钮');
    await dispatchClickEvent(helpSvg);
    await sleep(100);
  }
  // 第二步,点击切换状态
  if (!gameStateButton) throw new Error('未捕捉到JSON按钮');
  await dispatchClickEvent(gameStateButton);
  // 第三步,检查弹窗是否符合预期
  for (let i = 0; i < 3; i++) {
    dialogDiv = getGameStateJsonDiv();
    if (isOpen) {
      if (dialogDiv) return;
    } else {
      if (!dialogDiv) return;
    }
    await sleep(50);
  }
  throw new Error('JSON状态弹窗切换失败');
}

export async function readGameState(parse: false): Promise<string>;
export async function readGameState(parse: true): Promise<GameStateJSON>;
export async function readGameState(parse = true): Promise<GameStateJSON | string> {
  await gameStateJsonDiv(true);
  const textarea: HTMLTextAreaElement | null = document.querySelector("div.modal-backdrop.game-state div.slot > textarea");
  if (!textarea) throw new Error('捕获JSON展示区 textarea 元素失败');
  if (parse) {
    return JSON.parse(textarea.value);
  } else {
    return textarea.value;
  }
}

/**
 * 打开某个玩家的聊天窗口
 * @param userIndex 玩家座位号
 */
export async function openChatWindow(userIndex: number): Promise<boolean> {
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
 * 读取聊天窗口所在的div
 */
export function getChatDetailDiv(): HTMLDivElement | null {
  return document.querySelector("div.df-chat-detail");
}


/**
 * 读取聊天框中的内容
 */
export async function readChatContent(): Promise<string> {
  return '聊天框内容 逻辑待完善';
}

/**
 * 向某个玩家发送聊天消息
 * @param userIndex 玩家座位号
 * @param message   消息内容
 * @param autoSend  是否自动发送（默认为false，需要说书人手动点击发送）
 */
export async function sendMessage(
  userIndex: number,
  message: string = "",
  autoSend: boolean = false
): Promise<boolean> {
  if (!await openChatWindow(userIndex)) return false;
  const chatContainer = getChatDetailDiv();
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
