import React, {useContext, useEffect, useMemo, useState} from "react";
import {globalContext} from "../script";
import {useEditionState} from "./EditionProvider";

export interface IRoleContext {
    // 整个游戏的所有角色（不仅仅是当前剧本中的角色，也包含其它剧本的）
    allRoles: Record<string, GameRoleInfo>
    // 当前剧本中的角色
    currentUsers: Record<string, GameRoleInfo>
}

const GameRoleContext = React.createContext<IRoleContext | undefined>(undefined)
export function useRoleState() {return useContext(GameRoleContext)}

export function RoleProvider(props: {children?: React.ReactNode}) {
    const[allRoles, setAllRoles] = useState<IRoleContext['allRoles']>({});
    const [currentUsers, setCurrentUsers] = useState<IRoleContext['currentUsers']>({});
    useEffect(() => {
        setAllRoles(globalContext.roles);
        globalContext.observe('roles', setAllRoles);
        return () => globalContext.unobserve('roles', setAllRoles);
    }, []);

    const editionState = useEditionState();
    useEffect(() => {
        if (!editionState?.currentEdition) return;
        const roles = editionState.currentEdition.roles;
        const _currentUsers: IRoleContext['currentUsers'] = {};
        for (const role of roles) {
            if (allRoles[role]) _currentUsers[role] = allRoles[role];
        }
        setCurrentUsers(_currentUsers);
    }, [allRoles, editionState?.currentEdition])

    const contextValue = useMemo(() => ({
        allRoles,
        currentUsers
    }), [allRoles, currentUsers])
    return <GameRoleContext.Provider value={contextValue}>{props.children}</GameRoleContext.Provider>
}