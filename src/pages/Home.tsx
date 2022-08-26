import React, {useCallback, useState} from "react";
import {Button, SideSheet, Row, Col} from "@douyinfe/semi-ui";
import {PageStateProvider} from "../components/PageStateProvider";
import {PlayerInfoTable} from "../components/PlayerInfoTable";
import {ChatWindow} from "../components/ChatWindow";

export function Home() {
    const [visible, setVisible] = useState(false);
    const changeVisible = useCallback(() => setVisible(v => !v), []);

    return (<>
        <Button theme='solid' type='secondary' onClick={changeVisible} style={buttonStyle}>助手</Button>
        <SideSheet closeOnEsc={true} placement='bottom' height='80%'
                   headerStyle={headerStyle} bodyStyle={bodyStyle} visible={visible} onCancel={changeVisible} >
            <PageStateProvider assistantOpen={visible}>
                <Row gutter={16} style={fullHeight}>
                    <Col style={fullHeight} span={16}><PlayerInfoTable/></Col>
                    <Col style={fullHeight} span={8}><ChatWindow/></Col>
                </Row>
            </PageStateProvider>
        </SideSheet>
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