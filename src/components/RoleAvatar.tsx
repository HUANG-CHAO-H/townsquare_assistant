import {Avatar} from "@douyinfe/semi-ui";
import React from "react";

interface RoleAvatarProps {
    roleId: string
    size?: "small" | "large"
    style?: React.CSSProperties
}

export function RoleAvatar(props: RoleAvatarProps) {
    const {roleId, size, style} = props;
    if (!props.roleId) return null;
    const url = `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${roleId}.png`;
    return <Avatar size={size} src={url} style={style}></Avatar>
}