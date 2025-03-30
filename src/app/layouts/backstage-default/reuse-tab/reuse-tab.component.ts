import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap, take } from 'rxjs/operators';
import { PlatformCoreService } from 'src/app/services/platform/platform-core.service';
import { AppReuseStrategy } from 'src/app/services/core/app-reuse-strategy';

@Component({
  selector: 'app-reuse-tab',
  templateUrl: './reuse-tab.component.html',
  styleUrls: ['./reuse-tab.component.less']
})
export class ReuseTabComponent {

  currentIndex = -1;

  currentOverIndex = -1;

  tabRealWidth: any;

  sidebarWidth: 256;

  @Output() changeTabSize: EventEmitter<number> = new EventEmitter();

  tabItemList: Array<{ title: string, module: string, power: string, isSelect: boolean }> = [];

  tabItemShowList: Array<{ title: string, module: string, power: string, isSelect: boolean }> = [];

  tabItemCollapsedList: Array<{ title: string, module: string, power: string, isSelect: boolean }> = [];

  isCollapsedTab: boolean;

  constructor(
    private hst: ElementRef,
    private platformCoreService: PlatformCoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title) {

    const firstUrl: { title: string, module: string, power: string, isSelect: boolean } = this.platformCoreService.getDesktop();
    this.tabItemList.push(firstUrl);

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(filter(route => route.outlet === 'primary'))
      .pipe(mergeMap(route => route.data))
      .subscribe(routeData => {

        const url = this.router.url;
        this.titleService.setTitle(routeData['title']);
        const exitMenu = this.tabItemList.find(p => p.module === url);
        if (!exitMenu) {
          this.tabItemList.push({ title: routeData['title'], module: url, power: '', isSelect: true });
          this.tabResize(this.sidebarWidth);
        }
        this.tabItemList.forEach(p => p.isSelect = p.module === url);
        this.currentIndex = this.tabItemList.findIndex(p => p.module === url);
      });
  }

  closeTab(module: string, isSelect: boolean, event: Event): void {
    event.preventDefault();
    const index = this.tabItemList.findIndex(p => p.module === module);
    if (this.tabItemList.length === 1) { return; }
    delete AppReuseStrategy.deleteRouteSnapshot[module];
    if (!isSelect) { return; }
    let menu = this.tabItemList[index + 1];
    if (!menu) {
      menu = this.tabItemList[index - 1];
    }
    this.tabItemList.forEach(p => p.isSelect = p.module === menu.module);
    this.tabItemList = this.tabItemList.filter(p => p.module !== module);
    this.router.navigate(['/' + menu.module]);
    this.tabResize(this.sidebarWidth);
  }

  tabResize(sw?: any): void {

    const winWidth = document.body.offsetWidth;
    this.sidebarWidth = sw !== undefined ? sw : 256;
    const sidebarCollapsedWidth = 68;
    const headerWidth = 270; //
    const menuDrapDownWidth = 38; //
    const tabItemWidth = 96;
    const tabMaxWidth = winWidth - this.sidebarWidth - sidebarCollapsedWidth - headerWidth - 2; // 这里扣多2像素，貌似有些浏览器有问题
    this.tabRealWidth = tabMaxWidth - menuDrapDownWidth; //
    // this.hst.nativeElement.style.width = tabMaxWidth + 'px'; //
    this.changeTabSize.emit(tabMaxWidth); //
    // 重新显示tab
    const tabMaxNum = Math.floor(this.tabRealWidth / tabItemWidth);
    let tabNum = this.tabItemList.length > tabMaxNum ? tabMaxNum : this.tabItemList.length;
    if (tabNum < 0) {
      tabNum = 0;
    }

    this.tabItemShowList = this.tabItemList.slice(0, tabNum);
    this.tabItemCollapsedList = this.tabItemList.slice(tabNum);
    if (this.tabItemList.length > tabNum) {
      this.isCollapsedTab = true;
    } else {
      this.isCollapsedTab = false;
    }
  }

  tabItemShowSelect(ev: any, index: number): void {
    this.currentIndex = index;
    const menu = this.tabItemShowList[this.currentIndex];
    // 跳转路由
    this.router.navigate([menu.module]);
  }

  tabItemCollapsedSelect(ev: any, index: number): void {
    this.currentIndex = index;
    const menu = this.tabItemCollapsedList[this.currentIndex];
    // 跳转路由
    this.router.navigate([menu.module]);
  }

  showClose(tabItem: string, i: number): void {
    if (i === 0 && tabItem === '__tabItemShow') { return; }
    this.currentOverIndex = i;
    document.getElementById(tabItem + i).style.display = 'inline-block';
  }

  hideClose(tabItem: string, i: number): void {
    this.currentOverIndex = i;
    document.getElementById(tabItem + i).style.display = 'none';
  }


}
