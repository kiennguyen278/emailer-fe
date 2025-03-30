import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/models/core/menuItem';
import {MENU_ITEMS} from "../../../models/core/menu.config";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() isCollapsed: boolean;
  @Output() isCollapsedChange = new EventEmitter<boolean>();

  isShow: boolean;

  menuResource: Array<MenuItem> = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.menuResource = MENU_ITEMS;
    // this.platformCoreService.getMenuResource(this.menuResource);
  }

  isSelected(module: string): boolean {
    const u = this.router.url;
    return module === u;
  }

  isOpen(menuItems: MenuItem[]): boolean {
    const u = this.router.url;
    const foucusMenu = menuItems.find(menuItem => menuItem.module === u);
    const isOpen = foucusMenu != null ? true : false;
    return isOpen;
  }
}
