import _ from 'lodash';

export const trimHtmlTags = (text: string) => {
  return text?.replace(/<[^>]*>?/gm, '');
};

export const safeParseJson = (jsonValue: string | any) => {
  let objParsed = {};
  if (jsonValue && jsonValue !== '' && typeof jsonValue === 'string' && jsonValue !== null) {
    objParsed = JSON.parse(jsonValue);
  }
  return _.isObject(objParsed) ? objParsed : {};
};



export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
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


export const getValueImageBase64 = (image: string) => {

  return image?.split(';base64,')[1];
}


export const isValidHttpUrl = (urlString: string) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}


export const deepEqualObj = (obj1: Object, obj2: Object) => {
  if (obj1 === obj2) {
    return true; // Check for strict equality
  }

  if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false; // Check for null and type
  }

  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false; // Check for different number of keys
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqualObj(obj1[key], obj2[key])) {
      return false; // Check for mismatched keys or values
    }
  }

  return true;
}





