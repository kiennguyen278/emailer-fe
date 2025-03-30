import { Injectable } from '@angular/core';
import { MenuItem } from 'src/app/models/core/menuItem';

import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../core/local-storage.service';
import { ServiceResult } from 'src/app/models/core/service-result';

@Injectable({
  providedIn: 'root'
})
export class PlatformCoreService {

  getDesktop(): { title: string, module: string, power: string, isSelect: boolean } {
    const tabItem = { title: 'Dashboard', module: '/home/dashboard', power: '', isSelect: true };
    return tabItem;
  }

}
