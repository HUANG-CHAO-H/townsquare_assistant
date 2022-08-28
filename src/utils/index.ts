export * from './ReactiveData';
export * from './loadRemoteResource';

// 休眠
export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// 触发click事件
export function dispatchClickEvent(element: HTMLElement | null): void {
    if (!element) {
        console.error('dispatchClickEvent Error: element 不存在');
        return;
    }
    element.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
    }));
}
