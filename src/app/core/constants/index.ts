import Quill from 'quill';

export const SORT_DIRECTION = { ascend: 'asc', descend: 'desc' };


export const PHONE_REGEX_VALIDATE = /(0[3|5|7|8|9])+([0-9]{8})\b/ ; // validate phone format ở form
// export const PHONE_REGEX_VALIDATE = /(84|0[3|5|7|8|9])+([0-9]{8})\b/ ; // validate phone format ở form
export const NUMBER_REGEX = /^[0-9]+$|^$/;

export const PHONE_REGEX_TO_ALLOW_INPUT = /^[0-9]$/; //regex chặn, chỉ allow nhập
export const REGEX_USERNAME_ALLOW_INPUT = /^[A-Za-z0-9_]*$/; // regex chỉ cho nhập chữ hoa và só từ 0-9 và dấu _

export const REGEX_VALIDATE_PASSWORD = /^[A-Za-z0-9_$&+:;=?@#|'<>()"^*%!\-`\[\]]*$/;

export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const IDENTITY_CARD_REGEX =
  /(^[a-zA-Z0-9]{8}$)|(^[a-zA-Z0-9]{9}$)|(^[a-zA-Z0-9]{12}$)/;
export const DECIMAL_REGEX = /^\d*\.?\d*$/;
export const PERCENTAGE_REGEX =
  /^100(\.0{0,2})? *%?$|^\d{1,2}(\,\d{1,2})? *%?$/;
export const EXCLUDE_SPECIAL_CHARACTERS = /^[^$&+:;=?@#|'<>^*%!]*$/;
export const SPECIAL_CHARACTERS_REJECT = /[^\w\s]/;


export const SPECIAL_CHARACTERS = /[^A-Za-z 0-9]/g;
export const DATE_REGEX =
  /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

export const CODE_FORMAT=/^[a-zA-Z0-9_]*$/
//datetime regex
export const DATE_TIME_REGEX =
  /^([1-9]|([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d (20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/;
//datetime2 no second regex
export const DATE_TIME_NO_SECOND_REGEX =
  /^([1-9]|([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d\s([0-1]?[0-9]|2?[0-3]):([0-5]\d)$/;


export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const DATE_SQL_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_SQL_FORMAT = `yyyy-MM-dd'T'HH:mm:ss`;
export const DATE_TIME_SQL_FORMAT_TIMEZONE = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
export const DATE_TIME_FULL_FORMAT = 'dd/MM/yyyy HH:mm:ss';
export const MONTH_FORMAT = 'MM/yyyy';
export const YEAR_FORMAT = 'yyyy';
export const TIME_FORMAT = 'HH:mm';


const fontSizeArr = ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', '18px', '19px', '20px', '21px', '22px', '23px', '24px'];
let Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr
Quill.register(Size, true);

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
      [{ font: [] }],

      ['clean'], // remove formatting button

      ['link', 'image', 'video'], // link and image, video
      ['emoji'],
    ],
  },
};
