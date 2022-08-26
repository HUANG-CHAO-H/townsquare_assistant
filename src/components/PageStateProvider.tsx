import React, {useContext, useEffect, useMemo, useState} from "react";
import {getRoleRecord, readChatContent, readGameState} from "../typescript/血染钟楼助手(base)";

interface IPageStateContext {
    // 游戏状态
    gameState: GameStateJSON | undefined
    // 当前聊天框的用户
    chatUser: string
    // 当前聊天框中的内容(HTML片段)
    chatContent: string
    // 助手(页面)是否处于开启状态
    assistantOpen: boolean
}

const PageStateContext = React.createContext<IPageStateContext | undefined>(undefined)

interface PageStateProviderProps {
    assistantOpen: boolean
    children?: React.ReactNode
}

export function PageStateProvider(props: PageStateProviderProps) {
    const [gameState, setGameState] = useState<IPageStateContext['gameState']>(undefined);
    const [chatUser, setChatUser] = useState<string>('');
    const [chatContent, setChatContent] = useState<string>('');

    useEffect(() => {
        if (!props.assistantOpen) return;
        let gameStateString = '';
        const interval = setInterval(async () => {
            readChatContent().then(value => {
                setChatUser(value.userName);
                setChatContent(value.content);
            });
            const stateString = await readGameState();
            if (!stateString || stateString === gameStateString) return;
            const stateJson: GameStateJSON = JSON.parse(gameStateString = stateString);
            stateJson.roles = stateJson.roles || [];
            const roleRecord = (await getRoleRecord()) || {};
            for (const player of stateJson.players) {
                const role: unknown = player.role;
                if (typeof role === 'string') {
                    player.role = roleRecord[role] || null;
                } else player.role = null;
            }
            setGameState(stateJson);
        }, 500);
        return () => clearInterval(interval);
    }, [props.assistantOpen]);

    const contextValue = useMemo<IPageStateContext>(() => ({
        gameState, chatUser, chatContent,
        assistantOpen: props.assistantOpen
    }), [gameState, chatUser, chatContent, props.assistantOpen]);

    return <PageStateContext.Provider value={contextValue}>{props.children}</PageStateContext.Provider>
}

export function usePageState() {return useContext(PageStateContext)}