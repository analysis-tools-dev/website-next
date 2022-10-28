import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';

const DEFAULT_TTL = 60 * 60 * 24; // 24 hours in seconds

export const getCacheManager = (ttl: number = DEFAULT_TTL) =>
    cacheManager.caching({
        store: fsStore,
        options: {
            path: 'diskcache', //path for cached files
            ttl: ttl, //time to life in seconds
            subdirs: false, //create subdirectories
            zip: false, //zip files to save diskspace (default: false)
        },
    });
