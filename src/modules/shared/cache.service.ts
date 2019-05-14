import { Injectable } from '@nestjs/common';
import * as cache from 'memory-cache';

import { CommonUtils } from '../../common/utils/common';

@Injectable()
export class CacheServie {
  constructor(){}

  public set(key: string, value: any, durationInSecond: number, timeoutCallback?: (...args: any[]) => void) {
    if(CommonUtils.isNullOrUndefined(key) || key == '') {
      throw new Error('Cache Key is require');
    }
    
    cache.put(key, value, durationInSecond*1000, timeoutCallback);
  }

  public get<T>(key: string): T {
    if(CommonUtils.isNullOrUndefined(key) || key == '') {
      throw new Error('Cache Key is require');
    }
    return cache.get(key) as T;
  }
}