import {Avatar, Badge} from "@douyinfe/semi-ui";
import React from "react";

interface PlayerAvatarProps {
    playerInfo: GamePlayerInfo
    size?: 'small' | 'large'
    avatarStyle?: React.CSSProperties
    containerStyle?: React.CSSProperties
}

export function PlayerAvatar(props: PlayerAvatarProps) {
    const {playerInfo: info, size, avatarStyle, containerStyle} = props;

    const baseAvatar = <Avatar size={size || "small"} src={info.avatarUrl} style={avatarStyle || { marginRight: 12 }}></Avatar>;
    let avatar: React.ReactNode = baseAvatar;
    let userName: React.ReactNode = info.name;
    // 头像调整
    if (info.countUnread) {
        avatar = <Badge count={info.countUnread} type='primary'>{baseAvatar}</Badge>
    } else if (info.isDead) {
        avatar = <Badge count='死亡' type='danger'>{baseAvatar}</Badge>
    }
    // 名字调整
    if (info.isDead) {
        userName = <span style={deadStyle}>{info.name}</span>
    }
    return <div style={containerStyle}>{avatar}{userName}</div>
}

const deadStyle: React.CSSProperties = {
    // 中划线
    textDecoration: "line-through",
    // 灰色字体
    color: 'gray'
}