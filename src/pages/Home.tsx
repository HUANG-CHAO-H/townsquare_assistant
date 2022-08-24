import React, {useCallback, useEffect, useState} from "react";
import {SideSheet} from "@douyinfe/semi-ui";

export function Home() {
    const [visible, setVisible] = useState(false);
    const change = useCallback(() => setVisible(v => !v), []);
    useEffect(() => {
        let testTime = 0;
        const interval = setInterval(() => {
            if (testTime > 10) {
                clearInterval(interval);
                return;
            }
            try {
                if (window.GameAssistant) {
                    clearInterval(interval);
                    window.GameAssistant.onButtonClick(change);
                } else if (unsafeWindow.GameAssistant) {
                    clearInterval(interval);
                    unsafeWindow.GameAssistant.onButtonClick(change);
                } else testTime++;
            } catch (error) {console.warn(error)}
        }, 200)
    }, [change])

    return (
        <SideSheet title="滑动侧边栏" visible={visible} onCancel={change} placement='bottom'>
            <p>This is the content of a basic sidesheet.</p>
            <p>Here is more content...</p>
        </SideSheet>
    );
}