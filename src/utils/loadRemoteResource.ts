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


const jsonResource = new Map<string, unknown>();
/**
 * 加载远程JSON资源
 * @param url
 */
export async function loadRemoteJson(url: string): Promise<any> {
    if (jsonResource.has(url)) return jsonResource.get(url);
    const response = await fetch(url);
    if (response.status !== 200) throw new Error('加载 roles.json 失败');
    const data = await response.json();
    jsonResource.set(url, data);
    return data;
}
