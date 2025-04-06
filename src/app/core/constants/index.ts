import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);


export const SORT_DIRECTION = { ascend: 'asc', descend: 'desc' };


export const PHONE_REGEX_VALIDATE = /(0[3|5|7|8|9])+([0-9]{8})\b/ ; // validate phone format ở form

export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const IDENTITY_CARD_REGEX =
  /(^[a-zA-Z0-9]{8}$)|(^[a-zA-Z0-9]{9}$)|(^[a-zA-Z0-9]{12}$)/;
  /^100(\.0{0,2})? *%?$|^\d{1,2}(\,\d{1,2})? *%?$/;
export const EXCLUDE_SPECIAL_CHARACTERS = /^[^$&+:;=?@#|'<>^*%!]*$/;


export const DATE_REGEX =
  /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

  /^([1-9]|([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d\s([0-1]?[0-9]|2?[0-3]):([0-5]\d)$/;


export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const DATE_SQL_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_SQL_FORMAT = `yyyy-MM-dd'T'HH:mm:ss`;
export const DATE_TIME_FULL_FORMAT = 'dd/MM/yyyy HH:mm:ss';
export const MONTH_FORMAT = 'MM/yyyy';
export const YEAR_FORMAT = 'yyyy';




// customize Quill editor
const Parchment = Quill.import('parchment');
const fontSizeArr = ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', '18px', '19px', '20px', '21px', '22px', '23px', '24px'];
let Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr
Quill.register(Size, true);

const FontArr = ['Arial', 'Tahoma', 'Segoe UI', 'Times New Roman'];
let Font = Quill.import('attributors/style/font');
Font.whitelist = FontArr;
Quill.register(Font, true);

const AlignStyle = new Parchment.Attributor.Style('align', 'text-align', {
  scope: Parchment.Scope.BLOCK,
});
Quill.register(AlignStyle, true);

export const ModuleQuill = {
  // 'emoji-shortname': true,
  // 'emoji-textarea': false,
  // 'emoji-toolbar': true,
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
      [{ size: fontSizeArr }],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: FontArr }],
      ['clean'], // remove formatting button

      ['link', 'image', 'video'], // link and image, video
      ['emoji'],
    ],
  },
  imageResize: {
    modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
  }
};
