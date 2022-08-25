import React, {useContext, useEffect, useMemo, useState} from "react";
import {gameStateJsonDiv, getGameStateJsonDiv, readGameState} from "../typescript/血染钟楼助手(base)";

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
        // 开启或关闭监听功能
        if (!props.assistantOpen) return;
        const stateObserver = new MutationObserver(() => {
            readGameState(false).then(value => setGameState(value));
            console.log('stateObserver 测试点');
        });
        // 打开游戏状态对话框
        readGameState(false).then(value => setGameState(value)).then(() => {
            const div = getGameStateJsonDiv();
            if (!div) throw new Error('未捕获到游戏状态对话框');
            stateObserver.observe(div, {childList: true, subtree: true})
        });
        return () => stateObserver.disconnect();
    }, [props.assistantOpen])

    const contextValue = useMemo<IPageStateContext>(() => ({
        gameState: gameState ? JSON.parse(gameState) : undefined,
        chatContent,
        assistantOpen: props.assistantOpen
    }), [gameState, props.assistantOpen]);

    return <PageStateContext.Provider value={contextValue}>{props.children}</PageStateContext.Provider>
}

export function usePageState() {return useContext(PageStateContext)}