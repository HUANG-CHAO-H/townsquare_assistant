import {loadRemoteJson, ReactiveData} from "../utils";

interface IGlobalContext {
    // roles.json文件地址
    rolesUrl: string,
    // editions.json文件地址
    editionsUrl: string,
    // 角色数据
    roles: Record<string, GameRoleInfo>,

    // 游戏状态JSON的字符串形式
    gameStateString: string
    // 游戏状态JSON
    gameState: GameStateJSON | undefined
    // 是否开启轮询,查询和更新JSON状态
    statePolling: boolean
    // 轮询游戏状态的时间间隔
    statePollTime: number

    // 聊天窗口的标题
    chatTitle: string
    // 聊天内容的DOM拷贝
    chatContent: NodeListOf<ChildNode> | null
    // 是否开启轮询,查询和更新JSON状态
    chatPolling: boolean
    // 轮询游戏状态的时间间隔
    chatPollTime: number
}

export const globalContext = ReactiveData<IGlobalContext>({
    rolesUrl: 'https://raw.githubusercontent.com/HUANG-CHAO-H/townsquare_assistant/master/static/roles.json',
    editionsUrl: 'https://raw.githubusercontent.com/HUANG-CHAO-H/townsquare_assistant/master/static/editions.json',
    roles: {},

    gameStateString: '',
    gameState: undefined,
    statePolling: false,
    statePollTime: 300,

    chatTitle: '',
    chatContent: null,
    chatPolling: false,
    chatPollTime: 300,
});
// 关联更新rolesUrl和roles
globalContext.observe('rolesUrl', async url => {
    if (!url) return globalContext.roles = {};
    globalContext.roles = await loadRoles(url);
});
// 关联更新 gameStateString 和 gameState
globalContext.observe('gameStateString', tranGameState);
// 关联更新 roles 和 gameState
globalContext.observe('roles', tranGameState);

function loadRoles(url: string): Promise<Record<string, GameRoleInfo>> {
    if (!url) return Promise.reject('url为空');
    return loadRemoteJson<GameRoleInfo[]>(url).then(data => {
        if (!(data instanceof Array)) return Promise.reject('加载roles数据失败');
        const roleRecord: Record<string, GameRoleInfo> = {};
        for (const role of data) roleRecord[role.id] = role;
        return roleRecord;
    })
}
loadRoles(globalContext.rolesUrl).then(value => globalContext.roles = value)

function tranGameState() {
    if (!globalContext.gameStateString) globalContext.gameState = undefined;
    const stateJson = JSON.parse(globalContext.gameStateString);
    stateJson.roles = stateJson.roles || [];
    const roleRecord = globalContext.roles || {};
    for (const player of stateJson.players) {
        const role: unknown = player.role;
        if (typeof role === 'string') {
            player.role = roleRecord[role] || null;
        } else player.role = null;
    }
    globalContext.gameState = stateJson;
}

window.globalContext = globalContext;

declare global {

    interface Window {
        globalContext?: typeof globalContext
    }

    interface GameStateJSON {
        bluffs: Array<unknown>;
        fabled: [];
        edition: { id: "snv" | "custom" };
        roles: Array<{ id: string }>;
        players: Array<GamePlayerInfo>;
    }

    interface GamePlayerInfo {
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
        // 是否已失去投票权
        isVoteless: boolean;
        // 人称代词（自定义昵称）
        pronouns: string;
        // 标记与提示（自定义添加）
        reminders: {role: string, name: string}[];
        // 玩家当前角色
        role: GameRoleInfo | null;
    }

    interface GameRoleInfo {
        // 角色ID
        id: string,
        // 角色名称
        name: string,
        // 所属阵营
        team: "townsfolk" | "outsider" | "minion" | "demon" | "traveler",
        // 能力
        ability: string

        // 适用游戏版本
        edition?: "tb" | "bmr" | "snv" | "luf",
        // 首夜顺序(默认为0，表示不参与排序)
        firstNight?: number,
        // 首夜唤醒并给予提醒
        firstNightReminder?: string,
        // 非首夜的顺序(默认为0，表示不参与排序)
        otherNight?: number,
        // 非首夜唤醒并给予提醒
        otherNightReminder: string,
        //  因为该角色的出现,而带来的额外自定义标记类型
        reminders: [],
        // global reminder tokens that will always be available, no matter if the character is assigned to a player or not
        remindersGlobal?: []
        // whether this token affects setup (orange leaf), like the Drunk or Baron
        setup: boolean,
    }
}