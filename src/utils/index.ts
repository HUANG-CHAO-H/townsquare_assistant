export * from './ReactiveData';
export * from './loadRemoteResource';

// 休眠
export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// 触发click事件
export function dispatchClickEvent(element: HTMLElement | null): Promise<boolean> {
    if (!element) {
        console.error('dispatchClickEvent Error: element 不存在');
        return Promise.resolve(false);
    }
    const createEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
    });
    return new Promise((resolve) => {
        setTimeout(() => resolve(false), 50);
        element.addEventListener("click", () => resolve(true), { once: true });
        element.dispatchEvent(createEvent);
    });
}
