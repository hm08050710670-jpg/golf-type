const $=x=>document.getElementById(x);
let S={mode:null,bi:0,basic:{},qi:0,ans:{},qs:[]};
const RO=[["全くあてはまらない","1",1],["あまりあてはまらない","2",2],["どちらともいえない","3",3],["ややあてはまる","4",4],["とてもあてはまる","5",5],["未経験・判断できない","得点に使用しません",null]];
function only(id){["home","mode","basic","quiz","result"].forEach(x=>$(x).classList.toggle("hidden",x!==id));scrollTo(0,0)}
function home(){only("home")} function showMode(){only("mode")}
function start(mode){S={mode,bi:0,basic:{},qi:0,ans:{},qs:[]};only("basic");renderBasic()}
function renderBasic(){let b=APP_DATA.basic[S.bi],sel=S.basic[b.id];$("basicContent").innerHTML=`<div class="pm"><span>基本情報</span><span>${S.bi+1} / ${APP_DATA.basic.length}</span></div><div class="progress"><div style="width:${(S.bi+1)/APP_DATA.basic.length*100}%"></div></div><div class="context">得点には直接使用しません</div><div class="question">${b.q}</div><div class="options">${b.options.map((o,i)=>`<button class="option ${sel===i?"sel":""}" onclick="selBasic(${i})">${o}</button>`).join("")}</div><div class="actions"><button class="secondary" onclick="basicBack()">戻る</button><button class="primary" onclick="basicNext()">次へ</button></div>`}
function selBasic(i){S.basic[APP_DATA.basic[S.bi].id]=i;renderBasic()}
function basicBack(){if(S.bi){S.bi--;renderBasic()}else showMode()}
function basicNext(){if(S.basic[APP_DATA.basic[S.bi].id]===undefined)return;if(S.bi<APP_DATA.basic.length-1){S.bi++;renderBasic()}else{prepare();only("quiz");renderQ()}}
function prepare(){if(S.mode==="detail")S.qs=[...APP_DATA.questions];else if(S.mode==="standard")S.qs=APP_DATA.questions.filter(q=>q.slot==="基本");else S.qs=APP_DATA.questions.filter(q=>["D01","D02","D03","D04"].includes(q.domain)&&q.slot==="基本")}
function renderQ(){let q=S.qs[S.qi];$("quizContent").innerHTML=`<div class="pm"><span>${q.domain} / ${q.facet}</span><span>${S.qi+1} / ${S.qs.length}</span></div><div class="progress"><div style="width:${(S.qi+1)/S.qs.length*100}%"></div></div><div class="context">${q.experience}</div><div class="question">${q.text}</div><div class="answers">${RO.map(r=>`<button class="answer" onclick="answer(${r[2]===null?"null":r[2]})"><strong>${r[0]}</strong><span>${r[1]}</span></button>`).join("")}</div>`}
function answer(v){S.ans[S.qs[S.qi].id]=v;if(S.qi<S.qs.length-1){S.qi++;renderQ()}else result()}
function prev(){if(S.qi){S.qi--;renderQ()}else{only("basic");S.bi=APP_DATA.basic.length-1;renderBasic()}}
function scores(){let z={};APP_DATA.domains.forEach(d=>z[d.id]=[]);S.qs.forEach(q=>{let a=S.ans[q.id];if(a==null)return;let v=(a-1)*25;if(q.direction<0)v=100-v;z[q.domain].push(v)});let o={};for(let k in z)o[k]=z[k].length?Math.round(z[k].reduce((a,b)=>a+b,0)/z[k].length):null;return o}
function typeFor(s){if(["D01","D02","D03","D04"].some(k=>s[k]==null))return null;let c=(s.D01>=50?"A":"S")+"-"+(s.D02>=50?"L":"F")+"-"+(s.D03>=50?"V":"P")+"-"+(s.D04>=50?"X":"K");return {code:c,...APP_DATA.types[c]}}
function condOK(txt,s){return txt.split(" AND ").every(p=>{let m=p.match(/(D\d+)\s*([<>])\s*(\d+)/);if(!m||s[m[1]]==null)return false;return m[2]===">"?s[m[1]]>+m[3]:s[m[1]]<+m[3]})}
function result(){let s=scores(),t=typeFor(s),near=["D01","D02","D03","D04"].some(k=>s[k]!=null&&s[k]>=45&&s[k]<=55),ins=APP_DATA.rules.filter(r=>condOK(r.condition,s)).sort((a,b)=>a.priority-b.priority).slice(0,3);
let th=t?`<div class="typecode">${near?"MIXED PROFILE / ":"TYPE "}${t.code}</div><div class="typename">${t.name}</div><div class="tagline">${t.tagline}</div>`:`<div class="typename">プロフィール集計</div>`;
let sh=APP_DATA.domains.filter(d=>s[d.id]!=null).map(d=>`<div class="score"><span>${d.name}</span><div class="track"><div class="fill" style="width:${s[d.id]}%"></div></div><b>${s[d.id]}</b></div>`).join("");
let ih=ins.length?`<div class="card"><h3>回答から見える確認ポイント</h3>${ins.map(x=>`<div class="insight"><h4>${x.id}</h4><p>${x.display}</p><p class="try"><b>次に試す：</b>${x.action}</p></div>`).join("")}</div>`:"";
$("resultContent").innerHTML=`<div class="resultHero">${th}</div>${t?`<div class="card"><b>このタイプの入口</b><p class="lead">${t.entry}</p><b>実際に確かめたいこと</b><p class="lead">${t.check}</p></div>`:""}<div class="card"><h3>10領域プロフィール</h3><div class="scores">${sh}</div></div>${ih}<p class="note">表示値は回答傾向を0〜100に換算したもので、能力・成功率・他者との順位ではありません。診断ロジックは今後の検証で変更する可能性があります。</p><div class="actions"><button class="primary" onclick="home()">トップへ戻る</button></div>`;only("result")}
