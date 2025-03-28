import {ChangeDetectorRef, Component} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent {

  loading = true;
  loading2 = true;

  chartLoading = {
    saleTrendDelay: 0
  };

  visitData: any = {};

  saleTrendData: any = {};

  totalSalePrecent = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this.http.post('charts/visitdata', null).pipe(delay(2000)).subscribe(res => {
      this.visitData = res['data'];
      this.loading = false;
    });

    this.http.post<number>('charts/totalSalePrecent', null).subscribe(res => {
      this.totalSalePrecent = res;
    });

    this.http.post('charts/saleTrend', null).pipe(delay(2000)).subscribe(res => {
      this.saleTrendData = res['data'];
      this.loading2 = false;
    });

  }

  saleTabChange(event: any) {
    let index = event.nzSelectedIndex;
    let tab = event.tab;
    this.chartLoading.saleTrendDelay = index;
    // g2的bug
    const e = document.createEvent('Event');
    e.initEvent('resize', true, true);
    window.dispatchEvent(e);
  }
}
