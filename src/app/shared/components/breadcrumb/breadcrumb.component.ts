import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit{

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {
  }
  headerClasses: any;

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        return this.getHeaderClasses();
      }),
    )
      .subscribe((headerClasses: string | null) => {
        this.headerClasses = headerClasses;
        console.log('this.headerClasses', this.headerClasses)
      });
    this.headerClasses = this.getHeaderClasses();
  }


  getHeaderClasses(): any | null {
    let child = this.activeRoute.firstChild;
    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
      } else if (child.snapshot.data) {
        return child.snapshot.data;
      } else {
        return null;
      }
    }
    return null;
  }



}
