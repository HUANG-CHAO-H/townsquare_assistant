import React, {useCallback, useEffect, useState} from "react";
import {SideSheet} from "@douyinfe/semi-ui";

import {onButtonClick} from "../utils";

export function Home() {
    const [visible, setVisible] = useState(false);
    const change = useCallback(() => setVisible(v => !v), []);
    useEffect(() => onButtonClick(change), [change])

    return (
        <SideSheet title="滑动侧边栏" visible={visible} onCancel={change} placement='bottom'>
            <p>This is the content of a basic sidesheet.</p>
            <p>Here is more content...</p>
        </SideSheet>
    );
}