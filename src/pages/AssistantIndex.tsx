import React, {useCallback, useEffect, useState} from "react";
import {Button, SideSheet, Row, Col} from "@douyinfe/semi-ui";
import {ChatWindow} from "./ChatWindow";
import {globalContext} from "../typescript";
import {GameStateProvider} from "../provider/GameStateProvider";
import {ChatProvider} from "../provider/ChatProvider";
import {SizeProvider} from "../provider/SizeProvider";
import {PlayerInfo} from "./PlayerInfo";

export function AssistantIndex() {
    const [visible, setVisible] = useState(false);
    const changeVisible = useCallback(() => setVisible(v => !v), []);

    useEffect(() => {
        if (visible) {
            globalContext.statePolling = true;
            globalContext.chatPolling = true;
        } else {
            globalContext.statePolling = false;
            globalContext.chatPolling = false;
        }
    }, [visible])

    return (<>
        <Button theme='solid' type='secondary' onClick={changeVisible} style={buttonStyle}>助手</Button>
        <GameStateProvider>
            <ChatProvider>
                <SideSheet closeOnEsc={true}
                           placement='bottom'
                           height='80%'
                           headerStyle={headerStyle}
                           bodyStyle={bodyStyle}
                           visible={visible}
                           onCancel={changeVisible}
                >
                    <Row gutter={16} style={fullHeight}>
                        <Col style={fullHeight} span={16}>
                            <SizeProvider><PlayerInfo/></SizeProvider>
                        </Col>
                        <Col style={fullHeight} span={8}>
                            <SizeProvider><ChatWindow/></SizeProvider>
                        </Col>
                    </Row>
                </SideSheet>
            </ChatProvider>
        </GameStateProvider>
    </>);
}

const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '70%',
}

const headerStyle: React.CSSProperties = {
    display: 'none'
}

const bodyStyle: React.CSSProperties = {
    padding: 0,
    overflow: "hidden",
}

const fullHeight: React.CSSProperties = {
    height: '100%',
}