import {Avatar, Tooltip} from "@douyinfe/semi-ui";
import React from "react";

interface RoleAvatarProps {
    roleId: string
    name: string
    size?: "small" | "large"
    style?: React.CSSProperties
}

export function RoleAvatar(props: RoleAvatarProps) {
    const {roleId, name, size, style} = props;
    if (!props.roleId) return null;
    const url = `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${roleId}.png`;
    return <Tooltip content={name}><Avatar size={size} src={url} style={style}></Avatar></Tooltip>
}