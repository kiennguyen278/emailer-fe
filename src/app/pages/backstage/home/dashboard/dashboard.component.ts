import {ChangeDetectorRef, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent {

  subscriberGrowthItems = [
    { label: 'Hôm nay', count: 0, trend: 'STABLE' },
    { label: '7 ngày', count: 0, trend: 'STABLE' },
    { label: '30 ngày', count: 3, trend: 'UP' },
    { label: 'Tổng cộng', count: 3, trend: 'STABLE' }
  ];

  emailPerformance = {
    totalSent: 18,
    openRate: 38.89,
    clickRate: 27.78
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {


  }

}
