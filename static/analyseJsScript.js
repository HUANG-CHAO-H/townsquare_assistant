import fs from 'fs/promises';

// 文件读取
const textDecoder = new TextDecoder();
async function readFile(path) {
    if (!path) throw new Error('path is empty');
    const fileInfo = await fs.readFile(path);
    return textDecoder.decode(new Uint8Array(fileInfo));
}

async function pushRole() {
    const editions = JSON.parse(await readFile('./editions.json'));
    const roles = JSON.parse(await readFile('./roles.json'));
    for (const role of roles) {
        for (const edition of editions) {
            if (role.edition === edition.id) {
                edition.roles.push(role.id);
            }
        }
    }
    return editions;
}
pushRole().then(console.log);
