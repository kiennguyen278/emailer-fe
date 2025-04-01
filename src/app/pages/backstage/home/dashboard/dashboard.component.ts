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

  advancedRange = 30;
  advancedStats = {
    bounceRate: 0,
    unsubscribeRate: 0,
    complaintRate: 0,
    activeRate: 92,
    topEmails: [],
    bestDay: '',
    bestHour: ''
  };

  analysisTexts: string[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadSubscriberGrowth();
    this.loadEmailTrend();
    this.loadEmailPerformance(this.selectedRange);
    this.loadAdvancedStats(this.advancedRange);
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
      this.analysisTexts = this.getTrendAnalysisText(last);

      console.log('lastClickTrend =', this.lastClickTrend); // phải là "DOWN" đúng chữ in hoa
    });
  }

  getTrendAnalysisText(last: any): string[] {
    const result: string[] = [];

    // Phân tích open rate
    if (last.openTrend === 'UP') {
      result.push(`Tỷ lệ mở tăng lên ${last.openRate}%. Chủ đề email có vẻ đang thu hút tốt hơn.`);
    } else if (last.openTrend === 'DOWN') {
      result.push(`Tỷ lệ mở giảm còn ${last.openRate}%. Cần xem lại tiêu đề hoặc thời điểm gửi.`);
    } else {
      result.push(`Tỷ lệ mở ổn định ở mức ${last.openRate}%.`);
    }

    // Phân tích click rate
    if (last.clickTrend === 'UP') {
      result.push(`Tỷ lệ click tăng lên ${last.clickRate}%. Nội dung có thể đang hấp dẫn hơn.`);
    } else if (last.clickTrend === 'DOWN') {
      result.push(`Tỷ lệ click giảm còn ${last.clickRate}%. Cần cải thiện lời kêu gọi hành động.`);
    } else {
      result.push(`Tỷ lệ click không thay đổi (${last.clickRate}%).`);
    }
    return result;
  }

  getTrendEmoji(trend: string): string {
    switch (trend) {
      case 'UP': return '🔼';
      case 'DOWN': return '🔽';
      default: return '➖';
    }
  }

  getTrendColorClass(trend: string): string {
    switch (trend) {
      case 'UP':
        return 'trend-up';
      case 'DOWN':
        return 'trend-down';
      default:
        return 'trend-stable';
    }
  }

  onAdvancedRangeChange(days: number) {
    this.advancedRange = days;
    this.loadAdvancedStats(days);
  }

  loadAdvancedStats(days: number) {
    // Tạm mock cứng dữ liệu cho từng mốc thời gian
    if (days === 7) {
      this.advancedStats = {
        bounceRate: 0.3,
        unsubscribeRate: 0.8,
        complaintRate: 0.1,
        activeRate: 88,
        topEmails: [
          { subject: 'Chào mừng bạn mới', openRate: 58, clickRate: 22 },
          { subject: 'Ưu đãi đặc biệt 7 ngày', openRate: 52, clickRate: 19 }
        ],
        bestDay: 'Thứ 3',
        bestHour: '9h sáng'
      };
    } else if (days === 90) {
      this.advancedStats = {
        bounceRate: 1.1,
        unsubscribeRate: 1.5,
        complaintRate: 0.5,
        activeRate: 76,
        topEmails: [
          { subject: 'Tổng hợp quý I', openRate: 48, clickRate: 18 },
          { subject: 'Chào năm mới 2025', openRate: 60, clickRate: 25 }
        ],
        bestDay: 'Thứ 5',
        bestHour: '10h sáng'
      };
    } else {
      this.advancedStats = {
        bounceRate: 0.7,
        unsubscribeRate: 1.0,
        complaintRate: 0.3,
        activeRate: 84,
        topEmails: [
          { subject: 'Ưu đãi tháng 3', openRate: 44, clickRate: 29 },
          { subject: 'Tin tức sản phẩm', openRate: 39, clickRate: 17 }
        ],
        bestDay: 'Thứ 4',
        bestHour: '8h sáng'
      };
    }
  }

}
