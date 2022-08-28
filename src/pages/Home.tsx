import React, {useCallback, useEffect, useState} from "react";
import {Button, SideSheet, Row, Col} from "@douyinfe/semi-ui";
import {PlayerInfoTable} from "../components/PlayerInfoTable";
import {ChatWindow} from "../components/ChatWindow";
import {globalContext} from "../typescript";
import {GameStateProvider} from "../provider/GameStateProvider";
import {ChatProvider} from "../provider/ChatProvider";

export function Home() {
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
                        <Col style={fullHeight} span={16}><PlayerInfoTable/></Col>
                        <Col style={fullHeight} span={8}><ChatWindow/></Col>
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
    padding: '0'
}

const fullHeight: React.CSSProperties = {
    height: '100%',
}