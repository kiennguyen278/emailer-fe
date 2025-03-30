import { NgModule } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IconModule } from '@ant-design/icons-angular';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import {NzAffixModule} from "ng-zorro-antd/affix";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzAnchorModule} from "ng-zorro-antd/anchor";
import {NzBackTopModule} from "ng-zorro-antd/back-top";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzCalendarModule} from "ng-zorro-antd/calendar";
import {NzCarouselModule} from "ng-zorro-antd/carousel";
import {NzCascaderModule} from "ng-zorro-antd/cascader";
import {NzCommentModule} from "ng-zorro-antd/comment";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzI18nModule} from "ng-zorro-antd/i18n";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzListModule} from "ng-zorro-antd/list";
import {NzNoAnimationModule} from "ng-zorro-antd/core/no-animation";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzRateModule} from "ng-zorro-antd/rate";
import {NzResultModule} from "ng-zorro-antd/result";
import {NzSliderModule} from "ng-zorro-antd/slider";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzTimelineModule} from "ng-zorro-antd/timeline";
import {NzTransButtonModule} from "ng-zorro-antd/core/trans-button";
import {NzTransferModule} from "ng-zorro-antd/transfer";
import {NzTreeViewModule} from "ng-zorro-antd/tree-view";
import {NzTreeSelectModule} from "ng-zorro-antd/tree-select";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzResizableModule} from "ng-zorro-antd/resizable";
import {NzPipesModule} from "ng-zorro-antd/pipes";
@NgModule({
  exports: [
    NzAffixModule,
    NzAlertModule,
    NzAnchorModule,
    NzAutocompleteModule,
    NzAvatarModule,
    NzBackTopModule,
    NzBadgeModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzCalendarModule,
    NzCardModule,
    NzCarouselModule,
    NzCascaderModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzCommentModule,
    NzDatePickerModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzDrawerModule,
    NzDropDownModule,
    NzEmptyModule,
    NzFormModule,
    NzGridModule,
    NzI18nModule,
    NzIconModule,
    NzImageModule,
    NzInputModule,
    NzInputNumberModule,
    NzLayoutModule,
    NzListModule,
    NzMentionModule,
    NzMenuModule,
    NzMessageModule,
    NzModalModule,
    NzNoAnimationModule,
    NzNotificationModule,
    NzPageHeaderModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzPopoverModule,
    NzProgressModule,
    NzRadioModule,
    NzRateModule,
    NzResultModule,
    NzSelectModule,
    NzSkeletonModule,
    NzSliderModule,
    NzSpinModule,
    NzStatisticModule,
    NzStepsModule,
    NzSwitchModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzTimePickerModule,
    NzTimelineModule,
    NzToolTipModule,
    NzTransButtonModule,
    NzTransferModule,
    NzTreeModule,
    NzTreeViewModule,
    NzTreeSelectModule,
    NzTypographyModule,
    NzUploadModule,
    NzWaveModule,
    NzResizableModule,
    NzPipesModule,
  ]
})
export class ZorroAntdModule {}
