import React, {useCallback, useState} from "react";
import {Button, SideSheet} from "@douyinfe/semi-ui";
import {PageStateProvider} from "../components/PageStateProvider";
import {ChatPage} from "./ChatPage";

export function Home() {
    const [visible, setVisible] = useState(false);
    const changeVisible = useCallback(() => setVisible(v => !v), []);

    return (<>
        <Button theme='solid' type='secondary' onClick={changeVisible} style={buttonStyle}>助手</Button>
        <SideSheet closeOnEsc={true} placement='bottom' height='80%' headerStyle={headerStyle} visible={visible} onCancel={changeVisible} >
            <PageStateProvider assistantOpen={visible}>
                <p>This is the content of a basic sidesheet.</p>
                <p>Here is more content...</p>
                <ChatPage/>
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