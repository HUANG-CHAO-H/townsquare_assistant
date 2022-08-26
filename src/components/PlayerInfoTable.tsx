import {usePageState} from "./PageStateProvider";
import {Avatar, Table} from "@douyinfe/semi-ui";
// import type {ColumnProps} from "@douyinfe/semi-ui/table/interface";

export function PlayerInfoTable() {
    const pageState = usePageState();
    const playerData = pageState?.gameState?.players || []
    console.log(pageState);
    return <Table columns={tableColumns} dataSource={playerData} pagination={false} />;
}

const tableColumns: any[] = [
    {
        title: '座位号',
        dataIndex: 'seatIndex',
        render(text: string, record: GamePlayerInfo, index: number) {
            return String(index)
        }
    },
    {
        title: '玩家',
        dataIndex: 'name',
        render(text: string, record: GamePlayerInfo) {
            return (
                <div>
                    <Avatar size="small" src={record.avatarUrl} style={{ marginRight: 12 }}></Avatar>
                    {text}
                </div>
            )
        }
    },
    {
        title: '角色',
        dataIndex: 'role',
        render(text: string, record: GamePlayerInfo) {
            return (
                <div>
                    <Avatar size="small" src={record.avatarUrl} style={{ marginRight: 12 }}></Avatar>
                    {String(text)}
                </div>
            )
        }
    },
]