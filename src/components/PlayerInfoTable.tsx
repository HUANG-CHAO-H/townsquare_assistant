import {usePageState} from "./PageStateProvider";
import {Avatar, Badge, Button, Table, Tooltip} from "@douyinfe/semi-ui";
import { IconCustomerSupport } from '@douyinfe/semi-icons';
import React from "react";
import {openChatWindow} from "../typescript/血染钟楼助手(base)";

export function PlayerInfoTable() {
    const pageState = usePageState();
    const playerData = pageState?.gameState?.players || []
    console.log(pageState);
    return <Table bordered={true} columns={tableColumns} dataSource={playerData} pagination={false} />;
}

// import type {ColumnProps} from "@douyinfe/semi-ui/table/interface";
// const tableColumns: ColumnProps<GamePlayerInfo>[] = [
const tableColumns: any[] = [
    {
        title: '座位号',
        dataIndex: 'seatIndex',
        width: 50,
        render(text: string, record: GamePlayerInfo, index: number) {
            return String(index + 1)
        }
    },
    {
        title: '玩家',
        dataIndex: 'name',
        width: 150,
        render(text: string, record: GamePlayerInfo) {
            const baseAvatar = <Avatar size="small" src={record.avatarUrl} style={{ marginRight: 12 }}></Avatar>;
            let avatar: React.ReactNode = baseAvatar;
            let userName: React.ReactNode = text;
            // 头像调整
            if (record.countUnread) {
                avatar = <Badge count={record.countUnread} type='primary'>{baseAvatar}</Badge>
            } else if (record.isDead) {
                avatar = <Badge count='死亡' type='danger'>{baseAvatar}</Badge>
            }
            // 名字调整
            if (record.isDead) {
                userName = <span style={deadStyle}>{text}</span>
            }
            return <div>{avatar}{text}</div>
        }
    },
    {
        title: '角色',
        width: 150,
        render(text: string, record: GamePlayerInfo) {
            const role = record.role;
            if (!role) return null;
            const url = `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${role.id}.png`
            return (
                <div>
                    <Avatar size="small" src={url} style={{ marginRight: 12 }}></Avatar>
                    {String(role.name)}
                </div>
            )
        }
    },
    {
        title: '首夜',
        width: 50,
        render(text: string, record: GamePlayerInfo) {
            const role = record.role;
            if (role?.firstNight) {
                return <Tooltip content={role.firstNightReminder || ''}>
                    <Avatar size="small" color="red" shape="square" alt="0">{role.firstNight}</Avatar>
                </Tooltip>
            }
            return null;
        }
    },
    {
        title: '非首夜',
        width: 50,
        render(text: string, record: GamePlayerInfo) {
            const role = record.role;
            if (role?.otherNight) {
                return <Tooltip content={role.otherNightReminder || ''}>
                    <Avatar size="small" color="green" shape="square" alt="0">{role.otherNight}</Avatar>
                </Tooltip>
            }
            return null;
        }
    },
    {
        title: '自定义标记',
        width: 200,
        render(text: string, record: GamePlayerInfo) {
            const reminders = record.reminders;
            if (!reminders?.length) return null;
            return (<>{
                reminders.map(reminder => {
                    if (reminder.role === 'custom') {
                        return (
                            <Tooltip content={reminder.name}>
                                <Avatar size="small" color="green" alt="0">{reminder.name}</Avatar>
                            </Tooltip>
                        )
                    } else {
                        const url = `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${reminder.role}.png`
                        return (
                            <Tooltip content={reminder.name}>
                                <Avatar size="small" src={url} alt="0"/>
                            </Tooltip>
                        )
                    }
                })
            }</>)
        }
    },
    {
        title: '操作',
        width: 100,
        render(text: string, record: GamePlayerInfo, index: number) {
            return (
                <Button icon={<IconCustomerSupport style={{color:'#E91E63'}}/>} onClick={() => openChatWindow(index + 1)}/>
            )
        }
    },
]

const deadStyle: React.CSSProperties = {
    // 中划线
    textDecoration: "line-through",
    // 灰色字体
    color: 'gray'
}