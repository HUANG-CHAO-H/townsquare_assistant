import {Avatar, Button, Table, Tooltip} from "@douyinfe/semi-ui";
import { IconComment } from '@douyinfe/semi-icons';
import React from "react";
import {openChatWindow} from "../typescript";
import {PlayerAvatar} from "./PlayerAvatar";
import {RoleAvatar} from "./RoleAvatar";
import {useGameState} from "../provider/GameStateProvider";

export function PlayerInfoTable() {
    const gameState = useGameState();
    const playerData = gameState?.players || []
    return <Table bordered={true} columns={tableColumns} dataSource={playerData} pagination={false} />;
}

// import type {ColumnProps} from "@douyinfe/semi-ui/table/interface";
// const tableColumns: ColumnProps<GamePlayerInfo>[] = [
const tableColumns: any[] = [
    {
        title: '座位号',
        dataIndex: 'seatIndex',
        width: 50,
        align: 'center',
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
            const {id, name = ''} = role;
            return <div><RoleAvatar roleId={id} name={name} style={{ marginRight: 12 }}/>{name}</div>
        }
    },
    {
        title: '首夜',
        width: 50,
        align: 'center',
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
        align: 'center',
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
        align: 'center',
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
                        console.log('reminder =', reminder);
                        return <RoleAvatar roleId={reminder.role} name={reminder.name}/>
                    }
                })
            }</>)
        }
    },
    {
        title: '操作',
        width: 100,
        align: 'center',
        render(text: string, record: GamePlayerInfo, index: number) {
            return (
                <Button icon={<IconComment style={{color:'#1abc9c'}}/>} onClick={() => openChatWindow(index + 1)}/>
            )
        }
    },
]
