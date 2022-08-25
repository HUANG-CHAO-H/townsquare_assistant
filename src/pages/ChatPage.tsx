import {usePageState} from "../components/PageStateProvider";

export function ChatPage() {
    const pageState = usePageState();
    console.log('pageState =', pageState);
    return null;
}