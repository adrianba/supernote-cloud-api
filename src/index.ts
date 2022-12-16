/**
 * @module supernote-cloud-api
 */

import { login, fileList, fileUrl } from "./api.js";
import { syncFiles } from "./sync.js";

/**
 * Details of a file or folder.
 * @property {string} id - Identifier
 * @property {string} directoryId - Folder identifier containing this item
 * @property {string} fileName - Name of the file
 * @property {number} size - Size of the file, or 0 for folder
 * @property {string} md5 - MD5 checksum of file, or "" for folder
 * @property {string} isFolder - "Y" for folder, or "N" for file
 * @property {number} createTime - Number representing create time
 * @property {number} updateTime - Number representing last updated time
 */
export type { FileInfo } from "./api";

export default {
  /**
   * Login to SuperNote Cloud API.
   * @async
   * @param {string} email User e-mail address
   * @param {string} password User password
   * @return {Promise<string>} Access token to access storage
   */
  login,

  /**
   * Return contents of folder.
   * @async
   * @param {string} token Access token from login()
   * @param {string?} directoryId Identifier of folder to list (default is root folder)
   * @return {Promise<FileInfo>} List of files and folders.
   */
  fileList,

  /**
   * Obtain URL to contents of file.
   * @async
   * @param {string} token Access token from login()
   * @param {string} id Identifier of file
   * @return {Promise<string>} URL of file
   */
  fileUrl,

  /**
   * Sync files from cloud to local file system.
   * @async
   * @param {string} token Access token from login()
   * @param {string} localPath Local file path to sync to
   * @returns {Promise<void>}
   */
  syncFiles
};