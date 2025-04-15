import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { Injectable } from '@angular/core';

interface IRouteConfigData {
    reuse: boolean;
}

interface ICachedRoute {
    handle: DetachedRouteHandle;
    data: IRouteConfigData;
}

@Injectable()
export class AppReuseStrategy implements RouteReuseStrategy {
    private static routeCache = new Map<string, ICachedRoute>();
    private static waitDelete: string;
    private static currentDelete: string;

  public static readonly noReuseList: string[] = [
    '/login',
    '/home/dashboard',
    '/workflows',
  ];

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {

      return route?.data?.reuse;

      const path = this.getFullRoutePath(route);

      if (AppReuseStrategy.noReuseList.includes(path)){
        return false;
      }

      const data = this.getRouteData(route);

        if (data) {
            return true;
        }
        return false;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const url = this.getFullRouteUrl(route);
        const data = this.getRouteData(route);
        if (AppReuseStrategy.waitDelete && AppReuseStrategy.waitDelete === url) {
            AppReuseStrategy.waitDelete = null;
            return null;
        } else {
            if (AppReuseStrategy.currentDelete && AppReuseStrategy.currentDelete === url) {
                AppReuseStrategy.currentDelete = null;
                return null;
            } else {
                AppReuseStrategy.routeCache.set(url, { handle, data });
                this.addRedirectsRecursively(route);
            }
        }
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const url = this.getFullRouteUrl(route);
        return AppReuseStrategy.routeCache.has(url);
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        const url = this.getFullRouteUrl(route);
        const data = this.getRouteData(route);
        return data && AppReuseStrategy.routeCache.has(url)
            ? AppReuseStrategy.routeCache.get(url).handle
            : null;
    }

    private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
        const config = route.routeConfig;
        if (config) {
            if (!config.loadChildren) {
                const routeFirstChild = route.firstChild;
                const routeFirstChildUrl = routeFirstChild ? this.getRouteUrlPaths(routeFirstChild).join('/') : '';
                const childConfigs = config.children;
                if (childConfigs) {
                    const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
                    if (childConfigWithRedirect) {
                        childConfigWithRedirect.redirectTo = routeFirstChildUrl;
                    }
                }
            }
            route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
        }
    }

    private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
        return this.getFullRouteUrlPaths(route).filter(Boolean).join('/').replace('/', '_');
    }

    private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
        const paths = this.getRouteUrlPaths(route);
        return route.parent ? [...this.getFullRouteUrlPaths(route.parent), ...paths] : paths;
    }

    private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
        return route.url.map(urlSegment => urlSegment.path);
    }

    private getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
        return route.routeConfig && route.routeConfig.data as IRouteConfigData;
    }

    public static deleteRouteSnapshot(url: string): void {
        if (url[0] === '/') {
            url = url.substring(1);
        }
        url = url.replace('/', '_');
        if (AppReuseStrategy.routeCache.has(url)) {
            AppReuseStrategy.routeCache.delete(url);
            AppReuseStrategy.currentDelete = url;
        } else {
            AppReuseStrategy.waitDelete = url;
        }
    }

  private getFullRoutePath(route: ActivatedRouteSnapshot): string {
      console.log('route ActivatedRouteSnapshot', route)
    return '/' + route.pathFromRoot
      .map(r => r.routeConfig ? r.routeConfig.path : '')
      .filter(path => path.length > 0)
      .join('/');
  }
}
