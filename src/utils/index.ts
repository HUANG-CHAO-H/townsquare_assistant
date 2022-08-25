export * from './ReactiveData';

// 休眠
export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// 触发click事件
export function dispatchClickEvent(element: HTMLElement | null): Promise<boolean> {
    if (!element) return Promise.resolve(false);
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



const linkUrlSet = new Set<string>();
/**
 * 向页面中插入css链接文件
 * @param url   css文件的URL链接
 */
export function insertCssLink(url: string) {
    if (linkUrlSet.has(url)) return;
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.type = 'text/css';
    styleLink.href = url;
    document.head.appendChild(styleLink);
    linkUrlSet.add(url);
}

const scriptUrlSet = new Set<string>();

/**
 * 向页面中插入JavaScript文件
 * @param url   url连接
 * @param type  script的type属性
 */
export function insertJsScript(url: string, type: string = "") {
    if (scriptUrlSet.has(url)) return;
    const script = document.createElement('script');
    if (type) script.type = type;
    script.src = url;
    document.head.appendChild(script);
    linkUrlSet.add(url);
}
