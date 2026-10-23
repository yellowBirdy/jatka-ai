import {mkdir,copyFile,cp,readdir} from 'node:fs/promises';
await mkdir('site',{recursive:true});
for(const name of await readdir('.'))if(/\.(js|css|html)$/.test(name))await copyFile(name,`site/${name}`);
await cp('assets','site/assets',{recursive:true});
