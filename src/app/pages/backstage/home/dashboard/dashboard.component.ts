import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../data/dashboard.service';
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent {

  engagementChartOptions: any;
  lastOpenTrend = 'STABLE';
  lastClickTrend = 'STABLE';

  subscriberGrowthItems: any[] = [];
  emailPerformance = { totalSent: 0, openRate: 0, clickRate: 0 };
  selectedRange: number = 30;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadSubscriberGrowth();
    this.loadEmailTrend();
    this.loadEmailPerformance(this.selectedRange);
  }

  loadSubscriberGrowth() {
    this.dashboardService.getSubscriberGrowth().subscribe((res) => {
      const data = res.data;
      this.subscriberGrowthItems = [
        { label: 'Hôm nay', count: data.today.count, trend: data.today.trend },
        { label: '7 ngày', count: data.last7Days.count, trend: data.last7Days.trend },
        { label: '30 ngày', count: data.last30Days.count, trend: data.last30Days.trend },
        { label: 'Tổng cộng', count: data.total.count, trend: data.total.trend }
      ];
    });
  }


  onRangeChange(days: number) {
    this.selectedRange = days;
    this.loadEmailPerformance(days);
  }

  loadEmailPerformance(days: number) {
    this.dashboardService.getEmailPerformance().subscribe((res) => {
      const data = res.data.current;
      this.emailPerformance = {
        totalSent: data.totalSent,
        openRate: data.openRate,
        clickRate: data.clickRate
      };
    });
  }

  loadEmailTrend() {
    this.dashboardService.getEmailTrend().subscribe((response) => {
      const data = response.data; // ✅ lấy mảng ra trước

      const labels = data.map(item => 'Tuần ' + item.period);
      const openRates = data.map(item => item.openRate);
      const clickRates = data.map(item => item.clickRate);

      this.engagementChartOptions = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Open Rate', 'Click Rate'] },
        xAxis: {
          type: 'category',
          data: labels
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: { formatter: '{value}%' }
        },
        series: [
          {
            name: 'Open Rate',
            type: 'line',
            data: openRates,
            smooth: true
          },
          {
            name: 'Click Rate',
            type: 'line',
            data: clickRates,
            smooth: true
          }
        ]
      };

      // ✅ Lấy xu hướng từ tuần cuối để hiển thị mũi tên
      const last = data[data.length - 1];
      this.lastOpenTrend = last.openTrend;
      this.lastClickTrend = last.clickTrend;
    });
  }

}
