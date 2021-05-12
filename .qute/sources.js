import fs from 'fs';
import path from 'path';

export default function sourceModules() {
    const src = path.resolve(process.cwd(), './src');
    const result = fs.readdirSync(src).reduce((r,name)=> {
        const index = path.join(src, name, 'index.js');
        try {
            fs.accessSync(index, fs.constants.F_OK);
            r.push(index);
        } catch(e) {
            console.log('@@@', index);
        } // ignore
        return r;
    }, []);
    result.push(
        path.resolve(src, 'icon/md/index.js'),
        path.resolve(src, 'icons/check/index.js'),
        path.resolve(src, 'icons/dropdown/index.js'),
        path.resolve(src, 'icons/hamburger/index.js'),
        path.resolve(src, 'icons/times/index.js'),
        path.resolve(src, 'index.js')
    );
    return result;
}
