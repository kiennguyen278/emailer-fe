import {Component} from '@angular/core';
import {DashboardService} from '../data/dashboard.service';

import { DatePipe } from '@angular/common';
import {EmailTrendItem} from "../data/dashboard.models";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent {

  engagementChartOptions: any;

  subscriberGrowthItems: any[] = [];

  performanceRange: string = '30d'; // mặc định là 30 ngày
  emailPerformance = { totalSent: 0, openRate: 0, clickRate: 0 };
  previousEmailPerformance = { totalSent: 0, openRate: 0, clickRate: 0 };
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


  openTexts: string[] = [];
  clickTexts: string[] = [];

  constructor(private dashboardService: DashboardService, private datePipe: DatePipe) {}

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
          { label: 'Total', count: data.total.count, trend: data.total.trend }
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

        const data = res.data;
        const current = data.current;
        const previous = data.previous;

        this.emailPerformance = {
          totalSent: current.totalSent,
          openRate: current.openRate,
          clickRate: current.clickRate
        };

        this.previousEmailPerformance = {
          totalSent: previous.totalSent,
          openRate: previous.openRate,
          clickRate: previous.clickRate
        };

        // ✅ Phân tích tự động
        if (data.current.openRate >= 40 && data.current.clickRate >= 10) {
          this.emailPerformanceAnalysis = 'Chiến dịch hoạt động hiệu quả với tỷ lệ phản hồi cao.';
        } else if (data.current.openRate >= 20) {
          this.emailPerformanceAnalysis = 'Tỷ lệ mở khá, nhưng cần cải thiện lời kêu gọi hành động.';
        } else {
          this.emailPerformanceAnalysis = 'Tỷ lệ mở thấp. Nên kiểm tra lại tiêu đề, thời gian gửi và nội dung.';
        }
      }

    });
  }

  onTrendRangeChange(range: string) {
    this.trendRange = range;
    this.loadEmailTrend(range);
  }

  loadEmailTrend( range: string) {
    const unit = range.endsWith('d') ? 'daily' : range.endsWith('w') ? 'weekly' : 'monthly';
    this.trendRange = range;
    this.dashboardService.getEmailTrend(range).subscribe((res) => {

      if (res.success) {
        const data = res.data;

        // const labels = data.map(item => 'Tuần ' + item.period);
        const labels = data.map(item => {
          if (unit === 'daily') {
            // item.period = '2025-04-04'
            const date = new Date(item.period);
            return this.datePipe.transform(date, 'dd/MM/yyyy');
          } else if (unit === 'weekly') {
            // item.period = '2025-13' → năm-tuần
            const [year, week] = item.period.split('-');
            return `Tuần ${week}/${year}`;
          } else if (unit === 'monthly') {
            // item.period = '2025-04'
            const [year, month] = item.period.split('-');
            return `${month}/${year}`;
          } else {
            return item.period; // fallback
          }
        });

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

        // Phân tích
        const { openTexts, clickTexts } = this.getOverallTrendAnalysis(data);
        this.openTexts = openTexts;
        this.clickTexts = clickTexts;
      }

    });
  }


  getOverallTrendAnalysis(data: EmailTrendItem[]): { openTexts: string[], clickTexts: string[] } {
    const openTexts: string[] = [];
    const clickTexts: string[] = [];

    const openRates = data.map(item => item.openRate ?? 0);
    const clickRates = data.map(item => item.clickRate ?? 0);
    const openStart = openRates[0];
    const openEnd = openRates[openRates.length - 1];
    const clickStart = clickRates[0];
    const clickEnd = clickRates[clickRates.length - 1];

    // Tổng thể
    if (openEnd > openStart) {
      openTexts.push(`Tỷ lệ mở có xu hướng tăng từ ${openStart}% lên ${openEnd}%.`);
    } else if (openEnd < openStart) {
      openTexts.push(`Tỷ lệ mở giảm từ ${openStart}% xuống còn ${openEnd}%.`);
    } else {
      openTexts.push(`Tỷ lệ mở ổn định quanh mức ${openStart}%.`);
    }

    if (clickEnd > clickStart) {
      clickTexts.push(`Tỷ lệ click có xu hướng tăng từ ${clickStart}% lên ${clickEnd}%.`);
    } else if (clickEnd < clickStart) {
      clickTexts.push(`Tỷ lệ click giảm từ ${clickStart}% xuống còn ${clickEnd}%.`);
    } else {
      clickTexts.push(`Tỷ lệ click ổn định ở mức ${clickStart}%.`);
    }

    // Đột biến Open
    for (let i = 1; i < openRates.length; i++) {
      const diff = Math.abs(openRates[i] - openRates[i - 1]);
      if (diff >= 20) {
        openTexts.push(`⚠️ Đột biến tỷ lệ mở: thay đổi ${diff}% vào <strong>${data[i].period}</strong>.`);
      }
    }

    // Đột biến Click
    for (let i = 1; i < clickRates.length; i++) {
      const diff = Math.abs(clickRates[i] - clickRates[i - 1]);
      if (diff >= 20) {
        clickTexts.push(`⚠️ Đột biến tỷ lệ click: thay đổi ${diff}% vào <strong>${data[i].period}</strong>.`);
      }
    }

    return { openTexts, clickTexts };
  }


  getPeriodText(range: string): string {
    if (!range) return '';
    const number = range.slice(0, -1);
    const unit = range.slice(-1);
    switch (unit) {
      case 'd':
        return `${number} ngày`;
      case 'w':
        return `${number} tuần`;
      case 'm':
        return `${number} tháng`;
      default:
        return range;
    }
  }

  onAdvancedRangeChange(range: string) {
    this.advancedRange = range;
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
            {
              value: s.bounceRate,
              name: 'Bounce',
              itemStyle: { color: '#f5222d' } // đỏ
            },
            {
              value: s.unsubscribeRate,
              name: 'Unsubscribe',
              itemStyle: { color: '#faad14' } // vàng cam
            },
            {
              value: s.complaintRate,
              name: 'Spam',
              itemStyle: { color: '#722ed1' } // tím
            },
            {
              value: s.activeRate,
              name: 'Active',
              itemStyle: { color: '#1890ff' } // ✅ xanh dương
            }
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

  getRateTrendIcon(current: number, previous: number): string {
    const diff = current - previous;
    if (diff > 0) return 'arrow-up';
    if (diff < 0) return 'arrow-down';
    return 'minus';
  }
  getRateTrendClass(current: number, previous: number): string {
    const diff = current - previous;
    if (diff > 0) return 'trend-up';
    if (diff < 0) return 'trend-down';
    return 'trend-stable';
  }

  getTrendIcon(trend: string): string {
    console.log('trend', trend)
    switch (trend) {
      case 'UP': return 'arrow-up';
      case 'DOWN': return 'arrow-down';
      default: return 'minus';
    }
  }

}
