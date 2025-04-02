import {Component} from '@angular/core';
import {DashboardService} from '../data/dashboard.service';

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

  performanceRange: string = '30d'; // mặc định là 30 ngày
  emailPerformance = { totalSent: 0, openRate: 0, clickRate: 0 };
  emailPerformanceAnalysis: string = '';

  trendRange = '30d'; // mặc định là 30 ngày


  advancedRange = '30d'; // mặc định là 30 ngày
  listQualityChartOptions: any;
  listQualityAnalysis: string = '';
  isAdvancedLoading = false;
  advancedStats = {
    bounceRate: 0,
    unsubscribeRate: 0,
    complaintRate: 0,
    activeRate: 0,
    topEmails: [],
    topSubscribers: []
  };


  analysisTexts: string[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadSubscriberGrowth();
    this.loadEmailTrend(this.trendRange);
    this.loadEmailPerformance(this.performanceRange);
    this.loadAdvancedStats(this.advancedRange);
  }

  loadSubscriberGrowth() {
    this.dashboardService.getSubscriberGrowth().subscribe((res) => {
      if (res.success) {
        const data = res.data;
        this.subscriberGrowthItems = [
          { label: 'Hôm nay', count: data.today.count, trend: data.today.trend },
          { label: '7 ngày', count: data.last7Days.count, trend: data.last7Days.trend },
          { label: '30 ngày', count: data.last30Days.count, trend: data.last30Days.trend },
          { label: 'Tổng cộng', count: data.total.count, trend: data.total.trend }
        ];
      }
    });
  }

  onPerformanceRangeChange(range: string): void {
    this.performanceRange = range;
    this.loadEmailPerformance(range);
  }
  loadEmailPerformance(range: string) {
    this.dashboardService.getEmailPerformance(range).subscribe((res) => {
      this.emailPerformanceAnalysis = "Chưa có kết quả phân tích";
      if (res.success) {
        const data = res.data.current;
        this.emailPerformance = {
          totalSent: data.totalSent,
          openRate: data.openRate,
          clickRate: data.clickRate
        };

        // ✅ Phân tích tự động
        if (data.openRate >= 40 && data.clickRate >= 10) {
          this.emailPerformanceAnalysis = 'Chiến dịch hoạt động hiệu quả với tỷ lệ phản hồi cao.';
        } else if (data.openRate >= 20) {
          this.emailPerformanceAnalysis = 'Tỷ lệ mở khá, nhưng cần cải thiện lời kêu gọi hành động.';
        } else {
          this.emailPerformanceAnalysis = 'Tỷ lệ mở thấp. Nên kiểm tra lại tiêu đề, thời gian gửi và nội dung.';
        }
      }

    });
  }

  loadEmailTrend( range: string) {
    this.trendRange = range;
    this.dashboardService.getEmailTrend(range).subscribe((res) => {

      if (res.success) {

        const data = res.data;

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
      }

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

  onAdvancedRangeChange(range: string) {
    this.advancedRange = range;
    this.loadAdvancedStats(range);
  }

  onTrendRangeChange(range: string) {
    this.trendRange = range;
    this.loadAdvancedStats(range);
  }

  loadAdvancedStats(period: string) {

    this.isAdvancedLoading = true;
    // 1. Subscriber Quality
    this.dashboardService.getSubscriberQuality(period).subscribe(res => {
      if (res.success) {
        const s = res.data;
        this.advancedStats.bounceRate = s.bouncedSubscribers;
        this.advancedStats.unsubscribeRate = s.unsubscribedSubscribers;
        this.advancedStats.complaintRate = s.complainedSubscribers;

        this.advancedStats.activeRate = Math.max(0, 100 - (s.bouncedSubscribers + s.unsubscribedSubscribers + s.complainedSubscribers)
        );

        this.listQualityAnalysis = this.analyzeListQuality(this.advancedStats);
        this.updatePieChartOptions();
      }
    });

    // 2. Top email theo tương tác
    this.dashboardService.getEmailEngagementReport(period).subscribe(res => {
      if (res.success) {
        // @ts-ignore
        this.advancedStats.topEmails = res.data.map(e => ({
          subject: e.subject,
          openCount: e.openCount,
          clickCount: e.clickCount,
          engagementScore: e.engagementScore
        }));
      }
    });
  }

  updatePieChartOptions() {
    const s = this.advancedStats;
    this.listQualityChartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Chất lượng danh sách',
          type: 'pie',
          radius: '70%',
          data: [
            { value: s.bounceRate, name: 'Bounce' },
            { value: s.unsubscribeRate, name: 'Unsubscribe' },
            { value: s.complaintRate, name: 'Spam' },
            { value: s.activeRate, name: 'Active' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  analyzeListQuality(stats: any): string {
    const totalBadRate = stats.bounceRate + stats.unsubscribeRate + stats.complaintRate;

    if (totalBadRate < 5) {
      return '✅ Danh sách rất tốt, tỷ lệ lỗi rất thấp.';
    } else if (totalBadRate < 15) {
      return '⚠️ Danh sách ổn định, cần tiếp tục lọc người nhận không tương tác.';
    } else {
      return '🚨 Danh sách có nhiều lỗi, nên kiểm tra lại nguồn dữ liệu và lọc lại subscriber.';
    }
  }

  getContentPerformanceAnalysis(email: any): string {
    const score = email.engagementScore ?? email.score ?? 0;
    if (score >= 30) {
      return '✅ Nội dung hiệu quả, tỷ lệ phản hồi tốt.';
    } else if (score >= 15) {
      return '⚠️ Hiệu suất trung bình, có thể cải thiện.';
    } else {
      return '🚨 Nội dung yếu, nên điều chỉnh tiêu đề hoặc CTA.';
    }
  }

  /**
   * Vì sao dùng ngưỡng 30 và 15?
   * ≥ 30: tương đương khoảng 6 click (×3) hoặc 15 open, hoặc kết hợp → rất tốt
   *
   * 15–29: mức trung bình → mở ổn, click còn thấp
   *
   * < 15: hầu như không mở hoặc không click → cần cải thiện
   * @param email
   */
  getContentPerformanceClass(email: any): string {
    const score = email.engagementScore ?? email.score ?? 0;
    if (score >= 30) {
      return 'trend-up';
    } else if (score >= 15) {
      return 'trend-stable';
    } else {
      return 'trend-down';
    }
  }

}
