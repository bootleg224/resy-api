// @ts-nocheck

/**
 * Recreate isNullOrUndefined, which is a legacy function that is relied on in untold places,
 * but do so with our new type-checking methods.
 * - my
 */
function getFromBreadcrumbs(source, breadcrumbs) {
  const bc = breadcrumbs.split(".");
  let value: any = null;
  for (let i = 0; i < bc.length; i += 1) {
    const val = bc[i];
    if (i === 0) {
      if (val in source) {
        value = source[val];
      } else {
        // @if TARGET!='prod'
        // eslint-disable no-console
        // console.warn(`"${val}" not found in ${source}.`);
        // eslint-enable no-console
        // @endif
        break;
      }
    } else if (val in value) {
      value = value[val];
    } else {
      // @if TARGET!='prod'
      // console.warn(`"${val}" not found in value.`); // eslint-disable-line no-console
      // @endif
      break;
    }
  }
  return value;
}
// http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return false;
}

function isMobileWeb() {
  /* eslint-disable-next-line no-undef */
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

const types = [
  "Array",
  "Object",
  "String",
  "Date",
  "RegExp",
  "Function",
  "Boolean",
  "Number",
  "Null",
  "Undefined",
  "Window",
] as const;

type keyType = `${"is"}${types[number]}`;

interface UtilType {
  [key: keyType]: (obj: any) => boolean;
  isMobileWeb: (obj: any) => boolean;
  isNullOrUndefined: (obj: any) => boolean;
  getQueryVariable: (obj: any) => any;
  parsePhone: (obj: any) => any;
  getFromBreadcrumbs: (obj: any, bc: any) => any;
}
const Utils: UtilType = {
  getFromBreadcrumbs,
  getQueryVariable,
  isMobileWeb,
  isNullOrUndefined: (value) => Utils.isNull(value) || Utils.isUndefined(value),
  parsePhone: (obj: any) => undefined,
} as UtilType;
// shamelessly stolen from https://toddmotto.com/understanding-javascript-types-and-reliable-type-checking/

types.forEach((type) => {
  Utils["is".concat(type)] = (
    (self) => (elem) =>
      Object.prototype.toString.call(elem).slice(8, -1) === self
  )(type);
});

export default Utils;
