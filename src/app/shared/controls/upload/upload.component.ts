import {
  Component,
  forwardRef,
  Input, OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { IAlbum, Lightbox } from 'ngx-lightbox';
import { isEmpty } from 'lodash';
import { NotificationService } from '@core/services/notification.service';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadComponent),
      multi: true
    }
  ]
})
export class UploadComponent implements ControlValueAccessor, OnChanges {

  @Input() maxImages: number = 1;
  @Input() maxFileSize: number = 5; // max allow file size in MB
  @Input() disabled = false;
  @Input() fileType: string = 'image/png,image/jpeg';
  @Input() allowMulti: boolean = false;
  @Input() fileListInit: string | string[];

  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';

  value!: string;


  constructor(
    private lightbox: Lightbox,
    private notification: NotificationService,
  ) {
  }

  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;


  ngOnChanges(changes: SimpleChanges) {
    const fileListInit = changes.fileListInit;
    if (!isEmpty(fileListInit.currentValue)){
      if(this.allowMulti){
        if (typeof fileListInit.currentValue == 'string'){
          this.fileList = [{url: fileListInit.currentValue, uid: '0', name: '0'}]
        } else {
          this.fileList = fileListInit.currentValue.map((item: string, index: number) => {
            return {
              url: item,
              uid: `${index}`,
              name: `${index}`,
            }
          })
        }
      } else {
        this.fileList = [{url: fileListInit.currentValue, uid: '0', name: '0'}]
      }
      this.onChangeFileList(this.fileList);
      
    }
  }

  onChange(event: any): void {
    if (!event) {
      event = null;
      this.value = event;
    }
    if (this._onChange) {
      this._onChange(event);
    }
  }
  writeValue(obj: any): void {
    this.value = obj;
    if (!obj || isEmpty(obj)){
      this.fileList = []
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  beforeUpload = (file: NzUploadFile): boolean => {


    const isAllowFileType = file.type ? this.fileType.includes(file.type) : false;
    if (!isAllowFileType) {
      this.notification.open({
        type: 'error',
        content: 'File upload không đúng định dạng'
      });
    }

    const isLt2M = this.maxFileSize !== 0 ? file.size! / 1024 / 1024 < this.maxFileSize : true;
    if (!isLt2M) {
      this.notification.open({
        type: 'error',
        content: `File upload không vượt quá ${this.maxFileSize}MB`,
        duration: 4000
      });
    }

    if (!isAllowFileType || !isLt2M){
      return false
    }

    this.getBase64(file as any).then(x => {

      const imgLink = x?.toString() as any;
      this.fileList = this.fileList.concat({...file, url: imgLink }); //  url này để xem ảnh preview

      this.onChangeFileList(this.fileList);
    });

    return false;
  }

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      // new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = error => reject(error);
    });
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj!);
    }
    const imgUrl = file.url || file.preview;
    this.previewImage = imgUrl;

    const album: IAlbum[] = [
      {
        src: imgUrl,
        thumb: imgUrl
      }
    ]

    this.lightbox.open(album, 0,{
      centerVertically: true,
      disableScrolling: true,
    });
  };

  removeImageOnPreview = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.filter(item => item.uid !== file.uid);

    this.onChangeFileList(this.fileList);
    return false;
  }

  onChangeFileList(files: NzUploadFile[]){
    const fileListUrl = files.map(item => item.url) || [];
    if (this.allowMulti){
      this.onChange(fileListUrl);
    } else {
      this.onChange(isEmpty(fileListUrl) ? null : fileListUrl[0]);
    }
  }

}
