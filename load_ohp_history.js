// ==UserScript==
// @name         jgdps load ohp history
// @namespace    http://tampermonkey.net/
// @version      2024-05-17
// @description  Load GITADORA play result to j-gitadora-psup.
// @author       julian Yamori
// @match        https://p.eagate.573.jp/game/gfdm/gitadora_galaxywave/p/playdata/stage_result.html?*gtype=dm*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

const urlPrefix = "http://localhost:3000";
const user = "USER";
const pw = "PASSWORD";

(async(t,r)=>{function e(t){let r=o(t.querySelector(".title")),e=o(t.querySelector(".sr_data_score_tb tr:nth-child(10) .score_data"));return{title:r,difficulty:function(t){let r=t=>`.score_data_diff.dm_${t}`;if(t.querySelector(r("bsc")))return 1;if(t.querySelector(r("adv")))return 2;if(t.querySelector(r("ext")))return 3;if(t.querySelector(r("mst")))return 4;throw Error("difficulty not found")}(t),achievement:function(t){let r=t.match(i);if(!r)throw Error("achievement format is invalid");let e=Number(r[1]);if(Number.isNaN(e))throw Error("achievement format is invalid");return e/100}(e)}}function o(t){if(null===t)throw Error("element is null");let r=t?.textContent;if(null===r)throw Error("text is null");return r.trim()}let i=/^([\d.]+)%$/;async function n(e){let o=new URL("api/load_ohp_history",t);if(!(await fetch(o,{method:"POST",body:JSON.stringify(e),headers:{Authorization:r}})).ok)throw Error("failed to post history.")}async function l(){let r="0";try{let t=function(){let t=document.querySelectorAll(".sr_list_tb");if(0===t.length)throw Error("history not found");return[...t.values()].map(e)}();await n(t),r="1"}finally{!function(r){let e=new URLSearchParams({success:r}),o=new URL(`load_ohp_history/result?${e.toString()}`,t);window.open(o)}(r)}}await l()})(urlPrefix, "Basic "+btoa(`${user}:${pw}`));
