import { Component, OnInit } from '@angular/core';
import { ColumnConfig } from '@core/models';
import { BaseCrudListComponent } from '@core/components';
import { loadListRole } from '../state/actions';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
})
export class RoleManagerComponent{


  valSwitch = false;
  loadingChangeSwitch = false;

  onSwitchChange(val: boolean){
    // console.log(val)
    // this.valSwitch = !this.valSwitch;

    if (!this.loadingChangeSwitch) {
      this.loadingChangeSwitch = true;
      setTimeout(() => {
        this.valSwitch = !this.valSwitch;
        this.loadingChangeSwitch = false;
      }, 3000);
    }
  }


}
