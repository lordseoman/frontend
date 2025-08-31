
import { notify }        from './notifications';
import { customDecoder } from './customEncoderDecoder';
import { API_URL }       from '../config';

export function formatUrl(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (!(key in vars)) {
      throw new Error(`Missing URL variable: ${key}`);
    }
    return encodeURIComponent(vars[key]);
  });
}

export async function fetchAPI(endpoint, options = {}) {
  // 1) Fetch raw text so we can attach our reviver
  const res  = await fetch(`${API_URL}${endpoint}`, options);
  if (!res.ok) {
    notify.critical(`HTTP ${res.status} fetching ${endpoint}`);
    throw new Error(`HTTP ${res.status}`);
  }

  // 2) JSON.parse with reviver to decode all nested __type__ markers
  let data, text;
  try {
    text = await res.text();
    data = JSON.parse(text, customDecoder);
  } catch (e) {
    notify.critical(`Error parsing JSON from ${endpoint}: ${e.message}`);
    console.error("Response was:", text);
    throw e;
  }

  // 3) Check metadata
  const status = data.metadata?.status;
  const msg    = data.metadata?.message || 'Unknown error';
  if (status >= 300 && status < 500) {
    notify.error(msg);
    throw new Error(msg);
  }
  if (status >= 500) {
    notify.critical(msg);
    throw new Error(msg);
  }

  // 4) Return the result *object* directly
  return data.result;
}
