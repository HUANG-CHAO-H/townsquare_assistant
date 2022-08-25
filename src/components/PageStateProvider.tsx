import React, {useContext, useEffect, useMemo, useState} from "react";
import {readChatContent, readGameState} from "../typescript/血染钟楼助手(base)";

interface IPageStateContext {
    // 游戏状态
    gameState: GameStateJSON | undefined
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
    const [gameState, setGameState] = useState<string>('');
    const [chatContent, setChatContent] = useState<string>('');

    useEffect(() => {
        if (!props.assistantOpen) return;
        const interval = setInterval(() => {
            readGameState(false).then(setGameState);
            readChatContent().then(setChatContent);
        }, 500);
        return () => clearInterval(interval);
    }, [props.assistantOpen]);

    const contextValue = useMemo<IPageStateContext>(() => ({
        gameState: gameState ? JSON.parse(gameState) : undefined,
        chatContent,
        assistantOpen: props.assistantOpen
    }), [gameState, props.assistantOpen]);

    return <PageStateContext.Provider value={contextValue}>{props.children}</PageStateContext.Provider>
}

export function usePageState() {return useContext(PageStateContext)}