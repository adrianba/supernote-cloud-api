# Supernote Cloud Storage API

[![Build and test badge](https://github.com/adrianba/supernote-cloud-api/actions/workflows/build.yml/badge.svg)](https://github.com/adrianba/supernote-cloud-api/actions/workflows/build.yml) [![npm version badge](https://img.shields.io/npm/v/supernote-cloud-api)](https://www.npmjs.com/package/supernote-cloud-api) ![license badge](https://img.shields.io/github/license/adrianba/supernote-cloud-api)

(Unofficial) API for accessing the cloud storage for Supernote tablets. This library was created by
observing the network calls from the Supernote web app and may stop working if Supernote modifies
the cloud API.

<a name="module_supernote-cloud-api"></a>

## supernote-cloud-api

* [supernote-cloud-api](#module_supernote-cloud-api)
    * [~login(email, password)](#module_supernote-cloud-api..login) ⇒ <code>Promise.&lt;string&gt;</code>
    * [~fileList(token, directoryId)](#module_supernote-cloud-api..fileList) ⇒ <code>Promise.&lt;FileInfo&gt;</code>
    * [~fileUrl(token, id)](#module_supernote-cloud-api..fileUrl) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="module_supernote-cloud-api..login"></a>

### supernote-cloud-api~login(email, password) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Login to SuperNote Cloud API.</p>

**Kind**: inner method of [<code>supernote-cloud-api</code>](#module_supernote-cloud-api)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>Access token to access storage</p>  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | <p>User e-mail address</p> |
| password | <code>string</code> | <p>User password</p> |

<a name="module_supernote-cloud-api..fileList"></a>

### supernote-cloud-api~fileList(token, directoryId) ⇒ <code>Promise.&lt;FileInfo&gt;</code>
<p>Return contents of folder.</p>

**Kind**: inner method of [<code>supernote-cloud-api</code>](#module_supernote-cloud-api)  
**Returns**: <code>Promise.&lt;FileInfo&gt;</code> - <p>List of files and folders.</p>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | <p>Access token from login()</p> |
| directoryId | <code>string</code> | <p>Identifier of folder to list (default is root folder)</p> |

<a name="module_supernote-cloud-api..fileUrl"></a>

### supernote-cloud-api~fileUrl(token, id) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Obtain URL to contents of file.</p>

**Kind**: inner method of [<code>supernote-cloud-api</code>](#module_supernote-cloud-api)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>URL of file</p>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | <p>Access token from login()</p> |
| id | <code>string</code> | <p>Identifier of file</p> |

