import { OptionModel } from '@core/models';



export enum ValueOptionStatus {
  HieuLuc = 1,
  HetHieuLuc = 0,
}

export const OptionStatus: OptionModel<number>[] = [
  {label: 'Hiệu lực', value: ValueOptionStatus.HieuLuc},
  {label: 'Hết hiệu lực', value: ValueOptionStatus.HetHieuLuc},
]



export enum OptionSourceTypeArticleValue {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export const OptionSourceTypeArticle: OptionModel<string>[] = [
  {label: 'Nội bộ', value: OptionSourceTypeArticleValue.INTERNAL}, // bài viết tự tạo
  {label: 'Thu thập', value: OptionSourceTypeArticleValue.EXTERNAL}, // bài viết lấy từ nguồn khác, chỉ paste link vào thôi
]




export enum OptionStatusArticleValue {
  HieuLuc = 1,
  HetHieuLuc = 0,
  ChoDuyet = 2,
  TuChoi = 3,
}
export const OptionStatuseArticle: OptionModel<number>[] = [
  {label: 'Hiệu lực', value: OptionStatusArticleValue.HieuLuc}, // bài viết tự tạo
  {label: 'Hết hiệu lực', value: OptionStatusArticleValue.HetHieuLuc}, // bài viết tự tạo
  {label: 'Chờ duyệt', value: OptionStatusArticleValue.ChoDuyet}, // bài viết lấy từ nguồn khác, chỉ paste link vào thôi
  {label: 'Từ chối', value: OptionStatusArticleValue.TuChoi}, // bài viết lấy từ nguồn khác, chỉ paste link vào thôi
]


export enum ValueOptionDisplayType {
  TatCa = 1,
  NhapDsKhachHang = 2
}

export const OptionDisplayType: OptionModel<number>[] = [
  { value: ValueOptionDisplayType.TatCa, label: 'Tất cả' },
  { value: ValueOptionDisplayType.NhapDsKhachHang, label: 'Danh sách khách hàng' },
];