// ==UserScript==
// @name         MetaBot for VK (DEEP ALPHA)
// @namespace    vk-metabot-user-js
// @description  More information about users on VK.
// @version      190330
// @homepageURL  https://vk.com/public159378864
// @include      https://*vk.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// ==/UserScript==

var listqueue = 0;
var arrayVKB = [];
const VKBurl = 'https://raw.githubusercontent.com/YTObserver/MetaBot-for-VK/master/test_db';
const VKBcolor = '255,50,50';

listqueue++;
getlist(filllist, 0, VKBurl);
waitforlists();

function filllist(numArr, response, code, url) {
  if (code !== 200) {
    console.log("[MetaBot for VK (DEEP ALPHA)] List load error. URL " + url + " Code " + code);
  } else {
    switch (numArr) {
      case 0:
        arrayVKB = response.match(/[^\r\n]+/g);
        var dbname = "VKB-db";
    }
    if (code === 200) {
      console.log("[MetaBot for VK (DEEP ALPHA)] " + dbname + " loaded. Code " + code);
    } else {
      console.log("[MetaBot for VK (DEEP ALPHA)] " + dbname + " load error. Code " + code);
    }
  }
  listqueue--;
}

function waitforlists() {
  if (listqueue === 0) {
    waitForKeyElements('a.author', foundAuthor);
  } else {
    setTimeout(waitforlists, 500);
  }
}

function foundAuthor(jNode) {
  var userID = jNode.attr('data-from-id');
  var foundID = arrayVKB.indexOf(userID);
  if (foundID > -1) {
    console.log("[******* for VK] User found in VKB-db: " + userID);
    var pNode = $(jNode).parent();
    if (pNode[0].classList.contains('reply_author')) {
      console.log("[******* for VK] This is comment.");
      $(pNode).parent().css({
          "background": "rgba(" + VKBcolor + ",.3)",
          "border-left": "3px solid rgba(" + VKBcolor + ",.3)",
          "padding-left": "3px"
      });
    } else if (pNode[0].classList.contains('post_author')) {
      console.log("[******* for VK] This is post.");
      $(pNode).parent().parent().css({
          "background": "rgba(" + VKBcolor + ",.3)",
          "border-left": "3px solid rgba(" + VKBcolor + ",.3)",
          "padding-left": "3px"
      });
    }
  }
}

function getlist(callback, numArr, url) {
  if (typeof GM_xmlhttpRequest !== 'undefined') {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        callback(numArr, response.responseText, response.status, url);
      }
    });
  } else if (typeof GM !== 'undefined') {
    GM.xmlHttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        callback(numArr, response.responseText, response.status, url);
      }
    });
  } else {
    console.log("[******* for VK] Unable to get supported cross-origin XMLHttpRequest function.");
  }
}

function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
  var targetNodes, btargetsFound;
  if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
  else targetNodes = $(iframeSelector).contents().find(selectorTxt);
  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    targetNodes.each(function() {
      var jThis = $(this);
      var alreadyFound = jThis.data('alreadyFound') || false;
      if (!alreadyFound) {
        var cancelFound = actionFunction(jThis);
        if (cancelFound) btargetsFound = false;
        else jThis.data('alreadyFound', true);
      }
    });
  } else {
    btargetsFound = false;
  }
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];
  if (btargetsFound && bWaitOnce && timeControl) {
    clearInterval(timeControl);
    delete controlObj[controlKey];
  } else {
    if (!timeControl) {
      timeControl = setInterval(function() {
        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}
