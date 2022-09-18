import React, {useEffect, useRef} from "react";
import {Row, Col, TextArea, Button, Avatar} from "@douyinfe/semi-ui";
import {globalContext} from "../typescript";
import {RoleAvatar} from "../components/RoleAvatar";
import {PlayerAvatar} from "../components/PlayerAvatar";
import {useChatContext} from "../provider/ChatProvider";

export function ChatWindow() {
    const chatContext = useChatContext();
    // 聊天内容展示
    const divRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const callback = (nodes: NodeListOf<ChildNode> | null) => {
            const div = divRef.current;
            if (!div || !nodes) return;
            const container: HTMLDivElement = div.firstChild as HTMLDivElement;
            const oldLength = container.childNodes.length;
            container.innerHTML = '';
            container.append(...nodes);
            if (oldLength !== container.childNodes.length) {   // 滚动轴修正
                div.scrollTop = div.scrollHeight;
            }
        }
        globalContext.observe('chatContent', callback);
        return () => globalContext.unobserve('chatContent', callback);
    }, [])

    if (!chatContext) return null;
    const {chatPlayer, chatPlayerSeat} = chatContext;
    if (!chatPlayer) return null;
    return (
        <div style={containerStyle}>
            <div>
                <Avatar color="light-blue" shape="square" alt="0">
                    <span style={{fontSize: 'x-large'}}>{chatPlayerSeat}</span>
                </Avatar>
                {chatPlayer.role ? <RoleAvatar roleInfo={chatPlayer.role}/> : null}
                <PlayerAvatar playerInfo={chatPlayer} containerStyle={{ display: 'inline-block' }}/>
            </div>
            <div style={{margin: '5px 0'}}>{customFunctions.map(Comp => <Comp size='small'/>)}</div>
            <div ref={divRef} style={contentStyle}><div/></div>
            <br/>
            <Row gutter={16} type="flex" align="middle">
                <Col span={20}>
                    <TextArea value={chatContext.chatContent} onChange={chatContext.setChatContent} onEnterPress={chatContext.dispatchSendMsg}/>
                </Col>
                <Col span={4}><Button block={true} onClick={chatContext.dispatchSendMsg}>发送</Button></Col>
            </Row>
        </div>
    )
}

const containerStyle: React.CSSProperties = {
    color: 'black',
    padding: '10px',
    height: '100%',
    overflow: 'hidden'
}

const contentStyle: React.CSSProperties = {
    height: '400px',
    overflowX: 'auto',
    overflowY: 'scroll',
    borderStyle: "inset",
    borderWidth: '2px',
}

interface IButtonProps {
    // 按钮尺寸
    size?: 'large' | 'default' | 'small'
    // 按钮style
    style?: React.CSSProperties
    // 按钮class样式
    className?: string
}

// 自定义功能列表
const customFunctions: Array<(props: IButtonProps) => JSX.Element> = [];
// 生成首夜信息按钮
customFunctions.push((props: IButtonProps) => {
    const chatContext = useChatContext();
    const onClick = () => {
        if (!chatContext) return;
        const content = chatContext.chatPlayer?.role?.firstNightReminder || '';
        chatContext.setChatContent(content);
    }
    return (
        <Button size={props.size} style={props.style} className={props.className} onClick={onClick}>
            生成首夜信息
        </Button>
    );
})
// 生成非首夜信息按钮
customFunctions.push((props: IButtonProps) => {
    const chatContext = useChatContext();
    const onClick = () => {
        if (!chatContext) return;
        const content = chatContext.chatPlayer?.role?.otherNightReminder || '';
        chatContext.setChatContent(content);
    }
    return (
        <Button size={props.size} style={props.style} className={props.className} onClick={onClick}>
            生成非首夜信息
        </Button>
    );
})
