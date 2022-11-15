import fetch from "node-fetch";
import md5 from "js-md5";
import shajs from "sha.js";

function sha256(s: string) {
  return shajs('sha256').update(s).digest('hex');
}

export async function login(email: string, password: string) {
  const { randomCode, timestamp } = await getRandomCode(email);
  return await getAccessToken(email, password, randomCode, timestamp);
}

export async function fileList(token: string, directoryId?: string): Promise<any> {
  const payload: any = {
    directoryId: directoryId || 0,
    pageNo: 1,
    pageSize: 100,
    order: "time",
    sequence: "desc",
  };
  const data = await postJson("https://cloud.supernote.com/api/file/list/query", payload, token);
  return data.userFileVOList;
}

export async function fileUrl(token: string, id: string): Promise<string> {
  const payload = {
    id,
    type: 0,
  };
  const data = await postJson("https://cloud.supernote.com/api/file/download/url", payload, token);
  return data.url;
}

async function getRandomCode(email: string): Promise<{ randomCode: string; timestamp: number }> {
  const payload = { countryCode: "93", account: email };
  const data = await postJson(
    "https://cloud.supernote.com/api/official/user/query/random/code",
    payload
  );
  return { randomCode: data.randomCode, timestamp: data.timestamp };
}

async function getAccessToken(
  email: string,
  password: string,
  randomCode: string,
  timestamp: number
): Promise<string> {
  const pd = sha256(md5(password) + randomCode);
  const payload = {
    countryCode: "93",
    account: email,
    password: pd,
    browser: "Chrome107",
    equipment: "1",
    loginMethod: "1",
    timestamp: timestamp,
    language: "en",
  };

  const data = await postJson(
    "https://cloud.supernote.com/api/official/user/account/login/new",
    payload
  );
  return data.token;
}

async function postJson(url: string, payload: any, token?: string): Promise<any> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
  };
  if (token) {
    headers["x-access-token"] = token;
  }
  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify(payload),
    headers,
  });
  return await response.json();
}
