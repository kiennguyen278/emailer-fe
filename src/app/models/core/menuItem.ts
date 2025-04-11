export class MenuItem {
  module: string;
  children: Array<MenuItem> = [];
  label: string;
  isGroup?: boolean;
  icon: string;
  isOpen = false;
  allowRole?: string[]; // nếu trong MenuItem config có option này = true thì phải là admin mới hiển thị menu
}
