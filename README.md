# Supernote Cloud Storage API

[![Build and test badge](https://github.com/adrianba/supernote-cloud-api/actions/workflows/build.yml/badge.svg)](https://github.com/adrianba/supernote-cloud-api/actions/workflows/build.yml) [![npm version badge](https://img.shields.io/npm/v/supernote-cloud-api)](https://www.npmjs.com/package/supernote-cloud-api) ![license badge](https://img.shields.io/github/license/adrianba/supernote-cloud-api)

(Unofficial) API for accessing the cloud storage for Supernote tablets. This library was created by
observing the network calls from the Supernote web app and may stop working if Supernote modifies
the cloud API.

## Modules

<dl>
<dt><a href="#module_supernote-cloud-api">supernote-cloud-api</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#login">login(email, password)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Login to SuperNote Cloud API.</p></dd>
<dt><a href="#fileList">fileList(token, directoryId)</a> ⇒ <code>Promise.&lt;FileInfo&gt;</code></dt>
<dd><p>Return contents of folder.</p></dd>
<dt><a href="#fileUrl">fileUrl(token, id)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Obtain URL to contents of file.</p></dd>
<dt><a href="#syncFiles">syncFiles(token, localPath)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Sync files from cloud to local file system.</p></dd>
</dl>

<a name="module_supernote-cloud-api"></a>

## supernote-cloud-api
<a name="login"></a>

## login(email, password) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Login to SuperNote Cloud API.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>Access token to access storage</p>  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | <p>User e-mail address</p> |
| password | <code>string</code> | <p>User password</p> |

<a name="fileList"></a>

## fileList(token, directoryId) ⇒ <code>Promise.&lt;FileInfo&gt;</code>
<p>Return contents of folder.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;FileInfo&gt;</code> - <p>List of files and folders.</p>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | <p>Access token from login()</p> |
| directoryId | <code>string</code> | <p>Identifier of folder to list (default is root folder)</p> |

<a name="fileUrl"></a>

## fileUrl(token, id) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Obtain URL to contents of file.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>URL of file</p>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | <p>Access token from login()</p> |
| id | <code>string</code> | <p>Identifier of file</p> |

<a name="syncFiles"></a>

## syncFiles(token, localPath) ⇒ <code>Promise.&lt;void&gt;</code>
<p>Sync files from cloud to local file system.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | <p>Access token from login()</p> |
| localPath | <code>string</code> | <p>Local file path to sync to</p> |

