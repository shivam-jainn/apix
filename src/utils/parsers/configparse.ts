import fs from 'fs';
import path from 'path';

const rootPath = process.cwd();

function loadApixConfig(){
    const ApixConfigPath = path.join(rootPath, 'src', 'tests', 'apix.config.json');
    const ApixConfig = fs.readFileSync(ApixConfigPath, 'utf8');
    return JSON.parse(ApixConfig);
}