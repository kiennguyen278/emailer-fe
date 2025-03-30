import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import {ResponseModel} from "@core/models/response.model";
import {SaveSettingColRequest, SaveUserStickTablePatientInRoomRequest} from "../../state/settings/settings.model";

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseApiService {

  getColsDisplaySettings(keySetting: string) {
    return this.http.get<ResponseModel<any>>(
      this.buildUrl(`/setting`),
      {params: {keySetting}}
    );
  }

  saveColsDisplaySettings(params: SaveSettingColRequest) {
    const body = {
      settingName: params.settingName,
      jsonSetting: JSON.stringify(params.jsonSetting),
      status: 0 // fix status = 0 theo yêu cầu của BE (Minh Cường)
    };

    return this.http.post<ResponseModel<any>>(
      this.buildUrl(`/setting`),
      body
    );
  }


  getSettingsByUser(keySetting: string) {
    return this.http.get<ResponseModel<any>>(
      this.buildUrl(`/setting`),
      {params: {keySetting}}
    );
  }
  saveSettingsByUser(params: SaveUserStickTablePatientInRoomRequest) {
    const body = {
      settingName: params.settingName,
      jsonSetting: JSON.stringify(params.jsonSetting),
      status: 0 // fix status = 0 theo yêu cầu của BE (Minh Cường)
    };

    return this.http.post<ResponseModel<any>>(
      this.buildUrl(`/setting`),
      body
    );
  }


}
