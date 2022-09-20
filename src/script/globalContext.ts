import {loadRemoteJson, ReactiveData} from "../utils";
import {formatGameEditionInfo, formatGameRoleInfo, formatGameStateJSON} from "./townsquare";

interface IGlobalContext {
    // roles.json文件地址
    rolesUrl: string,
    // 角色数据
    roles: Record<string, GameRoleInfo>,
    // editions.json文件地址
    editionsUrl: string,
    // editions剧本数据
    editions: Record<string, GameEditionInfo>

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
    roles: {},
    editionsUrl: 'https://raw.githubusercontent.com/HUANG-CHAO-H/townsquare_assistant/master/static/editions.json',
    editions: {},

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
function loadRoles(url: string): Promise<Record<string, GameRoleInfo>> {
    if (!url) return Promise.reject('url为空');
    return loadRemoteJson<GameRoleInfo[]>(url).then(data => {
        if (!(data instanceof Array)) return Promise.reject('加载roles数据失败');
        const roleRecord: Record<string, GameRoleInfo> = {};
        for (const role of data) roleRecord[role.id] = formatGameRoleInfo(role);
        return roleRecord;
    })
}
loadRoles(globalContext.rolesUrl).then(value => globalContext.roles = value);

// 关联更新editionsUrl和editions
globalContext.observe('editionsUrl', async url => {
    if (!url) return globalContext.editions = {};
    globalContext.editions = await loadEditions(url);
});
function loadEditions(url: string): Promise<Record<string, GameEditionInfo>> {
    if (!url) return Promise.reject('url为空');
    return loadRemoteJson<GameEditionInfo[]>(url).then(data => {
        if (!(data instanceof Array)) return Promise.reject('加载roles数据失败');
        const editionRecord: Record<string, GameEditionInfo> = {};
        for (const edition of data) editionRecord[edition.id] = formatGameEditionInfo(edition);
        return editionRecord;
    })
}
loadEditions(globalContext.editionsUrl).then(value => globalContext.editions = value);

// 关联更新 gameStateString 和 gameState
globalContext.observe('gameStateString', gameStateString => {
    if (!gameStateString) globalContext.gameState = undefined;
    globalContext.gameState = formatGameStateJSON(gameStateString);
});
