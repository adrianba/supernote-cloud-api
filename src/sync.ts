/**
 * @module supernote-cloud-api
 */

import * as supernote from "./api.js";
import path from "node:path";
import fs from "node:fs/promises";
import fetch from "node-fetch";
import md5 from "js-md5";

/**
 * Sync files from cloud to local file system.
 * @async
 * @param {string} token Access token from login()
 * @param {string} localPath Local file path to sync to
 * @returns {Promise<void>}
 */
export async function syncFiles(token: string, localPath: string) {
  await syncSupernoteDirectory(token, localPath);
}

async function syncSupernoteDirectory(token: string, localPath: string, directoryId?: string) {
  const contents = await supernote.fileList(token, directoryId);
  for (const item of contents) {
    const itemPath = path.join(localPath, item.fileName);
    if (item.isFolder == "Y") {
      // Recurse folder
      console.log(`Recursing into ${itemPath}`);
      await syncSupernoteDirectory(token, itemPath, item.id);
    } else {
      await syncSupernoteFile(token, itemPath, item);
    }
  }
}

async function syncSupernoteFile(token: string, localPath: string, item: supernote.FileInfo) {
  console.log(`Checking: ${localPath}`);

  // Get details of localPath
  let localInfo;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  try { localInfo = await fs.stat(localPath); } catch (e: any) {
    /* c8 ignore next */
    if (e.code !== 'ENOENT') throw e;
    console.log(`  Not found: ${localPath}`);
  }

  // If newer than item, then do nothing
  if (localInfo) {
    if (!localInfo.isFile()) throw (`Not a file: ${localPath}`);
    const lastUpdated = new Date(item.updateTime);
    console.log(`  -- Local time:  ${localInfo.mtime}`);
    console.log(`  -- Remote time: ${lastUpdated}`);
    if (localInfo.mtime > lastUpdated) {
      console.log(`  Ignoring file (newer): ${localPath}`);
      return;
    }
    // Compute md5 of localPath
    console.log(`  Cloud MD5: ${item.md5}`);
    const localMd5 = await computeFileMd5(localPath);
    console.log(`  Local MD5: ${localMd5}`);
    if (localMd5 == item.md5) {
      console.log(`  Ignoring file (MD5 matches): ${localPath}`);
      return;
    }
  }

  // If different to item.md5 then download
  console.log(`  Downloading: ${localPath}`);
  const url = await supernote.fileUrl(token, item.id);
  await downloadFile(url, localPath, item.updateTime);
}

// Compute md5 of file
async function computeFileMd5(filePath: string) {
  const hash = md5.create();

  const fd = await fs.open(filePath, "r");
  try {
    let done = false;
    while (!done) {
      const data = await fd.read();
      done = !data || data.bytesRead === 0;
      if (!done) hash.update(data.buffer.subarray(0, data.bytesRead));
    }
  } finally {
    await fd.close();
  }

  return hash.hex();
}

async function downloadFile(url: string, filePath: string, updateTime: number) {
  // Make sure folder exists
  const folder = path.dirname(filePath);
  try { await fs.mkdir(folder, { recursive: true }) }
  /* c8 ignore next */
  catch { /* swallow error */ }

  const res = await fetch(url);
  if (!res.ok) {
    console.log(`Error downloading [${res.status}: ${res.statusText}]: ${url}`);
    return;
  }

  const fd = await fs.open(filePath, "w");
  try {
    const fileStream = fd.createWriteStream({ autoClose: true });
    await new Promise((resolve, reject) => {
      if (res.body) {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
        /* c8 ignore next 3 */
      } else {
        reject("Missing body");
      }
    });
  } finally {
    await fd.close();
  }

  const update = new Date(updateTime);
  console.log(`  Update time: ${update}`);
  await fs.utimes(filePath, update, update);
}

export default {
  syncFiles
};