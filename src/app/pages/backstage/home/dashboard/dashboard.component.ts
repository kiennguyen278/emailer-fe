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
  emailPerformance = { totalSent: 0, openRate: 0, clickRate: 0 };
  selectedRange: number = 30;

  emailPerformanceAnalysis: string = '';


  advancedStats = {
    bounceRate: 5,
    unsubscribeRate: 7,
    complaintRate: 3,
    activeRate: 90,
    topEmails: [],
    topSubscribers: []
  };

  advancedRange = 30; // mặc định là 30 ngày
  trendRange = 30; // mặc định là 30 ngày
  performanceRange: number = 30; // mặc định là 30 ngày

  analysisTexts: string[] = [];

  listQualityChartOptions: any;
  listQualityAnalysis: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {

    console.log('Default performanceRange selected:', this.performanceRange); // kiểm tra log

    this.loadSubscriberGrowth();
    this.loadEmailTrend(this.trendRange);
    this.loadEmailPerformance(this.performanceRange);
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

  onPerformanceRangeChange(days: number): void {
    this.performanceRange = days;
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

      // ✅ Phân tích tự động
      if (data.openRate >= 40 && data.clickRate >= 10) {
        this.emailPerformanceAnalysis = 'Chiến dịch hoạt động hiệu quả với tỷ lệ phản hồi cao.';
      } else if (data.openRate >= 20) {
        this.emailPerformanceAnalysis = 'Tỷ lệ mở khá, nhưng cần cải thiện lời kêu gọi hành động.';
      } else {
        this.emailPerformanceAnalysis = 'Tỷ lệ mở thấp. Nên kiểm tra lại tiêu đề, thời gian gửi và nội dung.';
      }
    });
  }


  loadEmailTrend( days: number) {
    this.trendRange = days;
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

  onTrendRangeChange(days: number) {
    this.trendRange = days;
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

        topSubscribers: [
          {
            name: 'Nguyễn Văn A',
            email: 'a@gmail.com',
            openCount: 15,
            clickCount: 7,
            score: 29
          },
          {
            name: 'Lê Thị B',
            email: 'b@yahoo.com',
            openCount: 10,
            clickCount: 8,
            score: 26
          },

          {
            name: 'Lê Thị C',
            email: 'c@yahoo.com',
            openCount: 9,
            clickCount: 11,
            score: 31
          }
        ]

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
        topSubscribers: [
          {
            name: 'Nguyễn Văn A',
            email: 'a@gmail.com',
            openCount: 15,
            clickCount: 7,
            score: 29
          },
          {
            name: 'Lê Thị B',
            email: 'b@yahoo.com',
            openCount: 10,
            clickCount: 8,
            score: 26
          },

          {
            name: 'Lê Thị C',
            email: 'c@yahoo.com',
            openCount: 9,
            clickCount: 11,
            score: 31
          }
        ]
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
        topSubscribers: [
          {
            name: 'Nguyễn Văn A',
            email: 'a@gmail.com',
            openCount: 15,
            clickCount: 7,
            score: 29
          },
          {
            name: 'Lê Thị B',
            email: 'b@yahoo.com',
            openCount: 10,
            clickCount: 8,
            score: 26
          },

          {
            name: 'Lê Thị C',
            email: 'c@yahoo.com',
            openCount: 9,
            clickCount: 11,
            score: 31
          }
        ]
      };
    }

    this.listQualityAnalysis = this.analyzeListQuality(this.advancedStats);
    this.updatePieChartOptions();
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
    const open = email.openRate;
    const click = email.clickRate;

    if (open >= 40 && click >= 10) {
      return '✅ Nội dung hiệu quả, tỷ lệ phản hồi tốt.';
    } else if (open >= 20 && click >= 5) {
      return '⚠️ Hiệu suất trung bình, có thể cải thiện.';
    } else {
      return '🚨 Nội dung yếu, nên điều chỉnh tiêu đề hoặc CTA.';
    }
  }

  getContentPerformanceClass(email: any): string {
    const open = email.openRate;
    const click = email.clickRate;

    if (open >= 40 && click >= 10) {
      return 'trend-up';
    } else if (open >= 20 && click >= 5) {
      return 'trend-stable';
    } else {
      return 'trend-down';
    }
  }


}
