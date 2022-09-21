"use strict";(()=>{var M=Object.defineProperty,T=Object.defineProperties;var R=Object.getOwnPropertyDescriptors;var m=Object.getOwnPropertySymbols;var V=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var h=(r,t,e)=>t in r?M(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,w=(r,t)=>{for(var e in t||={})V.call(t,e)&&h(r,e,t[e]);if(m)for(var e of m(t))L.call(t,e)&&h(r,e,t[e]);return r},B=(r,t)=>T(r,R(t));var y=r=>r%2===1?"box1":r%4===2?"box2":r%8===4?"box3":r%16===8?"box4":r%32===16?"box5":r%64===32?"box6":"box7";var C=[{id:"01",front:"\u2801",back:"A",learningState:"ready"},{id:"02",front:"\u2803",back:"B",learningState:"ready"},{id:"03",front:"\u2809",back:"C",learningState:"ready"},{id:"04",front:"\u2819",back:"D",learningState:"ready"},{id:"05",front:"\u2811",back:"E",learningState:"ready"},{id:"06",front:"\u280B",back:"F",learningState:"ready"},{id:"07",front:"\u281B",back:"G",learningState:"ready"},{id:"08",front:"\u2813",back:"H",learningState:"ready"},{id:"09",front:"\u280A",back:"I",learningState:"ready"},{id:"10",front:"\u281A",back:"J",learningState:"ready"},{id:"11",front:"\u2805",back:"K",learningState:"ready"},{id:"12",front:"\u2807",back:"L",learningState:"ready"},{id:"13",front:"\u280D",back:"M",learningState:"ready"},{id:"14",front:"\u281D",back:"N",learningState:"ready"},{id:"15",front:"\u2815",back:"O",learningState:"ready"},{id:"16",front:"\u280F",back:"P",learningState:"ready"},{id:"17",front:"\u281F",back:"Q",learningState:"ready"},{id:"18",front:"\u2817",back:"R",learningState:"ready"},{id:"19",front:"\u280E",back:"S",learningState:"ready"},{id:"20",front:"\u281E",back:"T",learningState:"ready"},{id:"21",front:"\u2825",back:"U",learningState:"ready"},{id:"22",front:"\u2827",back:"V",learningState:"ready"},{id:"23",front:"\u283A",back:"W",learningState:"ready"},{id:"24",front:"\u282D",back:"X",learningState:"ready"},{id:"25",front:"\u283D",back:"Y",learningState:"ready"},{id:"26",front:"\u2835",back:"Z",learningState:"ready"}],N=r=>r!==null&&typeof r=="object",_=r=>N(r)&&typeof r.id=="string"&&typeof r.front=="string"&&typeof r.back=="string"&&["ready",...Array.from({length:7}).map((t,e)=>`box${e+1}`),"retired"].includes(r.learningState),q=r=>N(r)&&Array.isArray(r)&&r.every(t=>_(t)),P=r=>t=>{let e=r(t);if(e===null)return!1;try{let o=JSON.parse(e);return q(o)}catch(o){return!1}},$=r=>{var b;let t=parseInt((b=r("step"))!=null?b:"");if(Number.isNaN(t))return!1;let e=["ready",...Array.from({length:7}).map((l,n)=>`box${n+1}`),"retired"];return!(!e.every(P(r))||e.flatMap(l=>JSON.parse(r(l))).length<C.length)},F=r=>{r("step","1"),r("ready",JSON.stringify(C)),Array.from({length:7}).map((e,o)=>`box${o+1}`).forEach(e=>r(e,"[]")),r("retired","[]")},A=({getItem:r,setItem:t})=>{let e=()=>{var a;let n=parseInt((a=r("step"))!=null?a:"");return Number.isNaN(n)?(t("step","1"),1):n},o=n=>JSON.parse(r(n)),k=()=>{let n=e(),a=n;if(y(a)==="box1"){let S=o("box1"),J=o("box2"),p=o("ready");S.length===0&&J.length===0&&p.length>0&&p.map(i=>({card:i,rank:Math.random()})).sort((i,I)=>i.rank-I.rank).map(({card:i})=>i).slice(0,5).forEach(i=>l(i,"box1"))}let x=o("retired");if(x.length===C.length)return x;let s=o(y(a));for(;s.length===0;)a++,s=o(y(a));return a=(a-1)%64+1,n!==a&&t("step",a.toString()),s},b=()=>{$(r)||F(t);let n=k(),a=Math.floor(n.length*Math.random());return n[a]},l=(n,a)=>{let u=o(n.learningState);t(n.learningState,JSON.stringify(u.filter(({id:S})=>S!==n.id)));let x=o(a),s=B(w({},n),{learningState:a});t(a,JSON.stringify([...x,s]))};return{getStep:e,getCurrentCard:b,setCardTo:l}};var U={ready:"box1",box1:"box2",box2:"box3",box3:"box4",box4:"box5",box5:"box6",box6:"box7",box7:"retired",retired:"retired"},K=(r,t,e)=>(t(r,U[r.learningState]),e()),E=(r,t,e)=>(t(r,"box1"),e());var c=document.querySelector("button#check"),O=document.querySelector("button#wrong"),v=document.querySelector("button#right");if(!c)throw new Error("Could not find main element");if(!O)throw new Error("Could not find wrong element");if(!v)throw new Error("Could not find right element");var f=A({getItem:r=>window.localStorage.getItem(r),setItem:(r,t)=>window.localStorage.setItem(r,t)}),d=f.getCurrentCard(),g=!0;c.textContent=d.front;c.addEventListener("click",()=>{g=!g,c.textContent=g?d.front:d.back});O.addEventListener("click",()=>{g=!0,d=E(d,(t,e)=>f.setCardTo(t,e),()=>f.getCurrentCard()),c.textContent=d.front});v.addEventListener("click",()=>{g=!0,d=K(d,(t,e)=>f.setCardTo(t,e),()=>f.getCurrentCard()),c.textContent=d.front});})();
