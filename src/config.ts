import * as readMetadata from 'read-metadata';
import * as path from 'path';

export default {
  load() : ICONFIG {
    let config: ICONFIG = readMetadata.sync(path.join(__dirname, "../config.yml"));
    config['COOKIES_SAVE_PATH_DEFAULT'] = path.join(__dirname, config['COOKIES_SAVE_PATH_DEFAULT']);
    global.CONFIG = config;
    return config;
  }
}
