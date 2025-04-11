import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/models/core/menuItem';
import {MENU_ITEMS} from "../../../models/core/menu.config";
import {UserInfo} from "@core/models/auth.models";
import {TokenStorageService} from "@core/services/token-storage.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() isCollapsed: boolean;
  @Output() isCollapsedChange = new EventEmitter<boolean>();
  user: UserInfo;


  menuResource: Array<MenuItem> = [];

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
  ) {
    this.user = this.tokenStorage.getUser();
  }

  ngOnInit() {
    this.menuResource = MENU_ITEMS;
    // this.platformCoreService.getMenuResource(this.menuResource);
  }

  isSelected(module: string): boolean {
    const u = this.router.url;
    return module === u;
  }

}
