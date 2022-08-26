import {Layout, Row, Col, TextArea, Button, Avatar} from "@douyinfe/semi-ui";
import {usePageState} from "./PageStateProvider";
import React, {useRef, useState} from "react";
import {sendMessage} from "../typescript/血染钟楼助手(base)";

export function ChatWindow() {
    const pageState = usePageState();
    const [inputValue, setInputValue] = useState<string>('');
    const divRef = useRef<HTMLDivElement | null>(null);

    const onButtonClick = () => {
        if (!inputValue) return;
        sendMessage(playerSeat + 1, inputValue, true)
            .then(() => {
                setInputValue('');
                setTimeout(() => {
                    const div = divRef.current;
                    if (div) div.scrollTop = div.scrollHeight;
                }, 500);
            });
    }

    if (!pageState?.gameState?.players) return null;
    const playerSeat = pageState.gameState.players.findIndex(value => value.name === pageState.chatUser);
    if (playerSeat < 0) return null;
    const playerInfo = pageState.gameState.players[playerSeat];

    return (
        <Layout style={{color: 'black', padding: '10px', height: '100%'}}>
            <div>
                <Avatar color="red" shape="square" alt="0">
                    <span style={{fontSize: 'large'}}>{playerSeat + 1}</span>
                </Avatar>
                <Avatar src={playerInfo.avatarUrl} style={{ marginRight: 12 }}></Avatar>
                {playerInfo.name}
            </div>
            <br/>
            <div>自定义功能列表</div>
            <br/>
            <div ref={divRef} style={contentStyle} dangerouslySetInnerHTML={{__html: pageState?.chatContent || ''}} />
            <br/>
            <Row gutter={16} type="flex" align="middle">
                <Col span={20}><TextArea value={inputValue} onChange={setInputValue} onEnterPress={onButtonClick}/></Col>
                <Col span={4}><Button block={true} onClick={onButtonClick}>发送</Button></Col>
            </Row>
        </Layout>
    )
}

const contentStyle: React.CSSProperties = {
    height: '60%',
    overflowX: 'auto',
    overflowY: 'scroll',
    borderStyle: "inset",
    borderWidth: '2px',
}