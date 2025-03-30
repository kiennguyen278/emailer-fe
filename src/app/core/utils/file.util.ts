import saveAs from 'file-saver';

export class FileUtil {
  static saveAsExcel(res: any, fileName: string) {
    const blob = new Blob([res], { type: 'application/ms-excel' });
    saveAs(blob, `${fileName}.xlsx`);
  }
}
