
interface RoleProvider {

}

export function RoleProvider() {

}

export interface IRoleContext {
    // 整个游戏的所有角色（不仅仅是当前剧本中的角色，也包含其它剧本的）
    allRoles: Record<string, GameRoleInfo>
    //
}