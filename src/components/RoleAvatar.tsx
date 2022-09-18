import {Avatar, Tooltip, Tag} from "@douyinfe/semi-ui";
import React, {useMemo} from "react";
import {translateRoleTeam} from "../typescript";

interface RoleAvatarProps {
    // 角色信息
    roleInfo: GameRoleInfo
    size?: "small" | "large"
    style?: React.CSSProperties
}

export function RoleAvatar(props: RoleAvatarProps) {
    const {roleInfo, size, style} = props;

    const [url, tooltipContent] = useMemo(() => {
        const url = `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${roleInfo.id}.png`;
        const tooltipContent = (
            <p>
                <span style={{fontSize: "large"}}>{roleInfo.name}</span>
                <Tag color="green" type="solid">
                    {translateRoleTeam(roleInfo.team)}
                </Tag>
                <br/><br/>
                {roleInfo.ability}
            </p>
        );
        return [url, tooltipContent];
    }, [roleInfo]);
    return (
        <Tooltip content={tooltipContent}>
            <Avatar size={size} src={url} style={style}/>
        </Tooltip>
    )
}