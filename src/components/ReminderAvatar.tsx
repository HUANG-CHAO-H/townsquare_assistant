import {Avatar, Tooltip} from "@douyinfe/semi-ui";
import React, {useMemo} from "react";

interface ReminderAvatarProps {
    roleId: string
    name: string
    size?: "small" | "large"
    style?: React.CSSProperties
}

export function ReminderAvatar(props: ReminderAvatarProps) {
    const {roleId, name, size, style} = props;
    const url = `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${roleId}.png`;
    return <Tooltip content={name}><Avatar size={size} src={url} style={style}></Avatar></Tooltip>
}