import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../data/dashboard.service';

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
  engagementChartLabels: string[] = [];
  engagementChartData: any[] = [];


  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadSubscriberGrowth();
    this.loadEmailPerformance();
    this.loadEmailTrend();
  }

  loadSubscriberGrowth() {
    this.dashboardService.getSubscriberGrowth().subscribe(data => {
      this.subscriberGrowthItems = [
        { label: 'Hôm nay', count: data.today.count, trend: data.today.trend },
        { label: '7 ngày', count: data.last7Days.count, trend: data.last7Days.trend },
        { label: '30 ngày', count: data.last30Days.count, trend: data.last30Days.trend },
        { label: 'Tổng cộng', count: data.total.count, trend: data.total.trend }
      ];
    });
  }

  loadEmailPerformance() {
    this.dashboardService.getEmailPerformance().subscribe(data => {
      this.emailPerformance = {
        totalSent: data.totalSent,
        openRate: data.openRate,
        clickRate: data.clickRate
      };
    });
  }


  loadEmailTrend() {
    this.dashboardService.getEmailTrend().subscribe(data => {
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

      // Lưu lại trend cho phần hiển thị icon/text nếu cần
      const last = data[data.length - 1];
      this.lastOpenTrend = last.openTrend;
      this.lastClickTrend = last.clickTrend;

      // Gỡ lỗi nếu cần
      console.log('Chart data:', this.engagementChartOptions);
    });
  }



}
