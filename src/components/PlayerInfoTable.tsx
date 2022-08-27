import {usePageState} from "./PageStateProvider";
import {Avatar, Badge, Button, Table, Tooltip} from "@douyinfe/semi-ui";
import { IconCustomerSupport } from '@douyinfe/semi-icons';
import React from "react";
import {openChatWindow} from "../typescript/血染钟楼助手(base)";
import {PlayerAvatar} from "./PlayerAvatar";
import {RoleAvatar} from "./RoleAvatar";

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
            return <PlayerAvatar playerInfo={record} size='small'/>
        }
    },
    {
        title: '角色',
        width: 150,
        render(text: string, record: GamePlayerInfo) {
            const role = record.role;
            if (!role) return null;
            return <div><RoleAvatar roleId={role.id} style={{ marginRight: 12 }}/>{String(role.name)}</div>
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
                        return (
                            <Tooltip content={reminder.name}>
                                <RoleAvatar roleId={reminder.role}/>
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
