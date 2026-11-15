/* ColorLab - script.js (JavaScript murni) */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1800)};
/* ---------- util warna ---------- */
const h2r=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const r2h=(r,g,b)=>'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
function hsl2hex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return r2h(f(0)*255,f(8)*255,f(4)*255)}
function hex2hsl(x){const[r,g,b]=h2r(x).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,l=(mx+mn)/2;let h=0;if(d){h=mx==r?((g-b)/d)%6:mx==g?(b-r)/d+2:(r-g)/d+4;h*=60}return[(h+360)%360,d?d/(1-Math.abs(2*l-1))*100:0,l*100]}
const lum=x=>{const[r,g,b]=h2r(x).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const ink=c=>ratio(c,'#111111')>ratio(c,'#ffffff')?'#111111':'#ffffff';
const okHex=v=>/^#[0-9a-f]{6}$/i.test(v);
const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ---------- ikon & data ---------- */
const icons={home:'<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>',m1:'<circle cx="9" cy="9" r="6"/><circle cx="15" cy="9" r="6"/><circle cx="12" cy="15" r="6"/>',m2:'<rect x="2" y="4" width="14" height="10" rx="1"/><path d="M6 18h6M9 14v4"/><rect x="14" y="12" width="8" height="8" rx="1"/>',m3:'<circle cx="12" cy="12" r="9"/><path d="M12 3v9l7 6M12 12l-7 6"/>',m4:'<path d="M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z"/>',m5:'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',quiz:'<circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 116 0c0 2-3 2-3 5M12 18h.01"/>'};
const ico=(k,s=22)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[k]}</svg>`;
const MODS=[
 {id:'m1',t:'Pengenalan Teori Warna',d:'Warna primer, sekunder, tersier, serta warna hangat dan dingin.',p:['#E3262B','#FFD60A','#2563EB','#22A34A']},
 {id:'m2',t:'Model Warna RGB dan CMYK',d:'Cahaya layar versus tinta cetak, lengkap dengan simulasi.',p:['#FF3B3B','#2EE56B','#3B6BFF','#22D3EE']},
 {id:'m3',t:'Harmoni dan Kombinasi Warna',d:'Monokromatik, analogus, komplementer, triadik, dan split.',p:['#7C5CFF','#22D3EE','#FF5CA8','#FFD166']},
 {id:'m4',t:'Psikologi Warna dalam Desain',d:'Makna dan kesan emosional warna pada audiens.',p:['#E11D48','#F59E0B','#10B981','#3B82F6']},
 {id:'m5',t:'Praktik Membuat Palet Warna',d:'Rancang poster dengan panduan komposisi 60-30-10.',p:['#1E3A8A','#F97316','#FDE68A','#0F172A']}];
const PAGES=[{id:'home',t:'Beranda'},...MODS.map((m,i)=>({id:m.id,t:`Modul ${i+1}: ${m.t}`})),{id:'quiz',t:'Lanjut ke Kuis'}];
const illust=(p,n)=>{const o=[[45,50,32],[80,42,26],[112,52,30]];return `<svg viewBox="0 0 160 90" aria-hidden="true"><rect x="6" y="70" width="148" height="12" rx="6" fill="${p[3]}" opacity=".9"/>${o.map((c,i)=>`<circle cx="${c[0]+(n%2)*8}" cy="${c[1]}" r="${c[2]}" fill="${p[i]}" opacity=".88"/>`).join('')}<circle cx="${130-n*4}" cy="20" r="9" fill="${p[3]}"/></svg>`};
const strip=p=>`<div class="strip">${p.map(c=>`<i style="background:${c}" title="${c}"></i>`).join('')}</div>`;
/* ---------- progres & navigasi ---------- */
let done=store.get('cl_done',[]),cur='home';
function updProg(){const n=done.length,pc=n/5*100+'%';$('#progFill').style.width=pc;$('#homeFill').style.width=pc;$('#progTxt').textContent=n+'/5 modul';$('#homeTxt').textContent=n?`${n} dari 5 modul selesai${n==5?'. Hebat! Lanjut ke kuis.':'.'}`:'Belum ada modul selesai.';
 $$('[data-tick]').forEach(e=>e.hidden=!done.includes(e.dataset.tick));
 $$('.done').forEach(b=>{const on=done.includes(b.dataset.done);b.classList.toggle('on',on);b.textContent=on?'✓ Modul selesai (klik untuk batal)':'Tandai modul selesai'})}
function show(id){cur=id;$$('.page').forEach(p=>p.hidden=p.id!==id);$$('#navList button').forEach(b=>b.dataset.go===id?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));
 const i=PAGES.findIndex(p=>p.id===id);$('#prevBtn').style.visibility=i?'visible':'hidden';$('#nextBtn').style.visibility=i<PAGES.length-1?'visible':'hidden';
 $('#sidebar').classList.remove('open');window.scrollTo(0,0);$('#main').focus({preventScroll:true})}
$('#navList').innerHTML=PAGES.map(p=>`<li data-q="${p.t.toLowerCase()}"><button data-go="${p.id}">${ico(p.id.startsWith('m')?p.id:p.id)}<span>${p.t}</span><span class="tick" data-tick="${p.id}" hidden>✓</span></button></li>`).join('');
$('#moduleCards').innerHTML=MODS.map((m,i)=>`<button class="mcard" data-go="${m.id}"><div class="mill">${illust(m.p,i)}</div><div class="mbody"><span class="mnum">${ico(m.id,20)}Modul ${i+1}<span class="tick" data-tick="${m.id}" hidden>✓ Selesai</span></span><h4>${m.t}</h4><p>${m.d}</p>${strip(m.p)}</div></button>`).join('');
MODS.forEach((m,i)=>{const s=$('#'+m.id);s.insertAdjacentHTML('afterbegin',`<div class="mhead">${ico(m.id,44)}${illust(m.p,i)}${strip(m.p)}</div>`);s.insertAdjacentHTML('beforeend',`<button class="btn done" data-done="${m.id}"></button>`)});
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)show(g.dataset.go);const d=e.target.closest('[data-done]');
 if(d){const id=d.dataset.done;done=done.includes(id)?done.filter(x=>x!==id):[...done,id];store.set('cl_done',done);updProg();if(done.includes(id))toast('Modul ditandai selesai')}});
$('#prevBtn').onclick=()=>show(PAGES[Math.max(0,PAGES.findIndex(p=>p.id===cur)-1)].id);
$('#nextBtn').onclick=()=>show(PAGES[Math.min(PAGES.length-1,PAGES.findIndex(p=>p.id===cur)+1)].id);
$('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');
$('#search').oninput=e=>{const q=e.target.value.trim().toLowerCase();let n=0;$$('#navList li').forEach(l=>{const v=!q||l.dataset.q.includes(q);l.hidden=!v;n+=v});$('#noResult').hidden=n>0};
function setTheme(t){document.documentElement.dataset.theme=t;store.set('cl_theme',t)}
setTheme(store.get('cl_theme','dark'));
$('#themeBtn').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
window.addEventListener('scroll',()=>$('#topBtn').hidden=scrollY<400);
$('#topBtn').onclick=()=>scrollTo({top:0,behavior:'smooth'});
$('#startBtn').onclick=()=>{$('#landing').hidden=true;$('#app').hidden=false;show('home')};
/* ---------- roda warna ---------- */
const pt=(r,a)=>[100+r*Math.cos(a*Math.PI/180),100+r*Math.sin(a*Math.PI/180)];
const seg=(r1,r2,a1,a2)=>{const[x1,y1]=pt(r2,a1),[x2,y2]=pt(r2,a2),[x3,y3]=pt(r1,a2),[x4,y4]=pt(r1,a1);return `M${x1} ${y1}A${r2} ${r2} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${r1} ${r1} 0 0 0 ${x4} ${y4}Z`};
$('#heroWheel').innerHTML=Array.from({length:12},(_,i)=>`<path d="${seg(28,96,i*30-105,i*30-75)}" fill="${hsl2hex(i*30,85,52)}"/>`).join('')+'<circle cx="100" cy="100" r="20" fill="#0E0B24"/>';
const rings=[[66,90,85,50],[42,66,85,72],[18,42,80,30]];
$('#wheel').innerHTML=rings.map(([a,b,s,l])=>Array.from({length:12},(_,i)=>{const c=hsl2hex(i*30,s,l);return `<path d="${seg(a,b,i*30-105,i*30-75)}" fill="${c}" data-c="${c}" role="button" tabindex="0" aria-label="Pilih warna ${c}"/>`}).join('')).join('')+'<g id="marks"></g>';
$('#wheel').addEventListener('click',e=>{const c=e.target.dataset&&e.target.dataset.c;if(c){$('#basePick').value=c;upd3()}});
$('#wheel').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.target.dispatchEvent(new Event('click',{bubbles:true}))}});
/* ---------- Modul 1: RYB ---------- */
const RYB=[['Merah','#E3262B','p'],['Kuning','#FFD60A','p'],['Biru','#2563EB','p'],['Oranye','#FF8A00','s','Merah + Kuning'],['Hijau','#22A34A','s','Kuning + Biru'],['Ungu','#7C3AED','s','Biru + Merah'],['Merah-oranye','#F4511E','t','Merah + Oranye'],['Kuning-oranye','#FFB000','t','Kuning + Oranye'],['Kuning-hijau','#A3D12B','t','Kuning + Hijau'],['Biru-hijau','#0E9F8E','t','Biru + Hijau'],['Biru-ungu','#4F46E5','t','Biru + Ungu'],['Merah-ungu','#C026D3','t','Merah + Ungu']];
$('#rybSw').innerHTML=RYB.map((c,i)=>`<button class="sw" data-i="${i}" aria-pressed="false"><i style="background:${c[1]}"></i><span>${c[0]}</span></button>`).join('');
$('#rybSw').onclick=e=>{const b=e.target.closest('.sw');if(!b)return;$$('.sw').forEach(x=>x.setAttribute('aria-pressed',x===b));const c=RYB[b.dataset.i];
 $('#rybInfo').innerHTML=c[2]=='p'?`<b>${c[0]}</b> (${c[1]}): warna primer. Tidak dapat dibuat dari campuran warna lain.`:`<b>${c[0]}</b> (${c[1]}): warna ${c[2]=='s'?'sekunder':'tersier'}, campuran ${c[3]}.`};
/* ---------- Modul 2: RGB/CMYK ---------- */
function updRGB(){const[r,g,b]=['R','G','B'].map(k=>+$('#r'+k).value);['R','G','B'].forEach((k,i)=>$('#o'+k).textContent=[r,g,b][i]);
 const x=r2h(r,g,b);$('#boxRGB').style.background=x;$('#txtRGB').textContent=`${r}, ${g}, ${b} (${x.toUpperCase()})`;
 const k=1-Math.max(r,g,b)/255,f=v=>k>=1?0:(1-v/255-k)/(1-k),[c,m,y]=[r,g,b].map(f);
 $('#boxCMYK').style.background=r2h(255*(1-c)*(1-k)*.93,255*(1-m)*(1-k)*.93,255*(1-y)*(1-k)*.93);
 $('#txtCMYK').textContent=`C${Math.round(c*100)} M${Math.round(m*100)} Y${Math.round(y*100)} K${Math.round(k*100)}`}
['R','G','B'].forEach(k=>$('#r'+k).oninput=updRGB);updRGB();
/* ---------- Modul 3: harmoni ---------- */
let myPal=store.get('cl_my',[]);
function harmony(x,t){const[h,s,l]=hex2hsl(x);const H=a=>hsl2hex(h+a,s,l);
 return t=='mono'?[20,35,50,70,88].map(L=>hsl2hex(h,s,L)):t=='analog'?[x,H(30),H(-30)]:t=='comp'?[x,hsl2hex(h,s,88),H(180)]:t=='triad'?[x,H(120),H(240)]:[x,H(150),H(210)]}
const chips=(a,rm)=>a.map((c,i)=>`<button class="cc" style="background:${c};color:${ink(c)}" data-hex="${c}" ${rm?`data-rm="${i}" title="Klik untuk hapus"`:'title="Klik untuk salin"'}>${c.toUpperCase()}${rm?' ×':''}</button>`).join('');
function upd3(){const x=$('#basePick').value,t=$('#harmSel').value,p=harmony(x,t);$('#palette').innerHTML=chips(p);
 const hs=t=='mono'?[hex2hsl(x)[0]]:p.map(c=>hex2hsl(c)[0]).filter((_,i)=>t!='comp'||i!=1);
 $('#marks').innerHTML=hs.map(h=>{const[a,b]=pt(90,h-90);return `<circle cx="${a}" cy="${b}" r="5" fill="#fff" stroke="#000" stroke-width="2"/>`}).join('');
 const o=t=='mono'?[p[4],p[2],p[0]]:p;$('#harmPrev').innerHTML=`<div style="flex:6;background:${o[0]};color:${ink(o[0])}">Judul poster (60%)</div><div style="flex:3;background:${o[1]};color:${ink(o[1])}">Pendukung (30%)</div><div style="flex:1;background:${o[2]};color:${ink(o[2])}">Aksen (10%)</div>`}
function renderMy(){$('#myPalette').innerHTML=myPal.length?chips(myPal,1):'<small>Belum ada warna tersimpan.</small>'}
function addMy(a){a.forEach(c=>{c=c.toLowerCase();if(!myPal.includes(c))myPal.push(c)});myPal=myPal.slice(-16);store.set('cl_my',myPal);renderMy();toast('Disimpan ke Palet Saya')}
$('#addBox3').innerHTML='<button class="btn small ghost" id="add3">+ Simpan palet ini</button>';
$('#add3').onclick=()=>addMy(harmony($('#basePick').value,$('#harmSel').value));
document.addEventListener('click',e=>{const b=e.target.closest('.cc');if(!b)return;if(b.dataset.rm!=null){myPal.splice(+b.dataset.rm,1);store.set('cl_my',myPal);renderMy()}else{navigator.clipboard&&navigator.clipboard.writeText(b.dataset.hex).then(()=>toast('Disalin: '+b.dataset.hex.toUpperCase()),()=>{})}});
$('#basePick').oninput=$('#harmSel').onchange=upd3;upd3();renderMy();
/* ---------- Modul 4: psikologi ---------- */
const PSY=[['Merah','#E11D48','Energi, gairah, urgensi.','Diskon, makanan, tanda berhenti.'],['Oranye','#F97316','Ramah, semangat, hangat.','Tombol ajakan, produk muda.'],['Kuning','#FFD166','Optimis, ceria, menarik perhatian.','Peringatan, produk anak.'],['Hijau','#10B981','Alam, sehat, tumbuh.','Lingkungan, kesehatan, finansial.'],['Biru','#3B82F6','Tepercaya, tenang, profesional.','Teknologi, bank, kesehatan.'],['Ungu','#7C5CFF','Kreatif, imajinatif, mewah.','Kecantikan, seni, kreativitas.'],['Hitam','#111827','Elegan, kuat, eksklusif.','Merek premium, fashion.'],['Putih','#F8FAFC','Bersih, sederhana, lapang.','Ruang kosong, kesehatan, minimalis.']];
$('#psyCards').innerHTML=PSY.map(c=>`<div class="card"><span class="dot" style="background:${c[1]}"></span><div><h4 style="margin:0;color:var(--tx)">${c[0]}</h4><p style="margin:.2em 0"><b>Kesan:</b> ${c[2]}</p><p style="margin:0"><b>Penerapan:</b> ${c[3]}</p></div></div>`).join('');
/* ---------- Modul 5: poster ---------- */
const TH=[['#FFF7E0','#7C3AED','#1F2937','#FF5CA8'],['#0F172A','#22D3EE','#E2E8F0','#3B82F6'],['#7C2D12','#FDE68A','#FFEDD5','#F97316'],['#0B0B1E','#FF5CA8','#E9E7FF','#7C5CFF']];
const CI=[['cBg','hBg'],['cTitle','hTitle'],['cText','hText'],['cAcc','hAcc']],DEF={pTitle:'Pameran Karya Kreatif DKV',pDesc:'Sabtu, 8 Agustus 2026. Aula SMK. Gratis dan terbuka untuk umum.',pBadge:'GRATIS',pFoot:'SMK · Jurusan DKV'};
const wrap=(t,n)=>{const L=[];let c='';t.split(/\s+/).filter(Boolean).forEach(w=>{if((c+' '+w).trim().length>n&&c){L.push(c);c=w}else c=(c+' '+w).trim()});if(c)L.push(c);return L};
const lines=(a,x,y,fs,lh,fill,wt)=>a.map((l,i)=>`<text x="${x}" y="${y+i*lh}" font-size="${fs}" font-weight="${wt}" fill="${fill}">${esc(l)}</text>`).join('');
function drawPoster(){const[bg,ti,tx,ac]=CI.map(p=>$('#'+p[0]).value),lay=$('#layout').value;
 let s=`<defs><linearGradient id="gA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${ac}"/><stop offset="1" stop-color="${ti}"/></linearGradient><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.4" fill="${ac}" opacity=".5"/></pattern></defs><rect width="600" height="800" fill="${bg}"/>`;
 if(lay=='geo')s+=`<rect x="40" y="125" width="170" height="110" fill="url(#dots)"/><circle cx="520" cy="110" r="160" fill="url(#gA)"/><circle cx="430" cy="235" r="62" fill="none" stroke="${ti}" stroke-width="9" opacity=".8"/><circle cx="560" cy="300" r="14" fill="${ac}"/>`;
 else if(lay=='wave')s+=`<path d="M0 0H600V210Q450 290 300 210T0 230Z" fill="url(#gA)"/><path d="M0 0H600V140Q450 220 300 140T0 160Z" fill="${ti}" opacity=".35"/>`;
 else s+=`<polygon points="0,0 600,0 600,170 0,260" fill="url(#gA)"/><polygon points="0,0 380,0 0,170" fill="${ti}" opacity=".35"/>`;
 const bd=($('#pBadge').value||'').toUpperCase(),w=bd.length*20+44;
 if(bd)s+=`<rect x="40" y="50" width="${w}" height="46" rx="23" fill="${ti}"/><text x="${40+w/2}" y="82" font-size="22" font-weight="800" text-anchor="middle" fill="${ink(ti)}">${esc(bd)}</text>`;
 const tl=wrap($('#pTitle').value,14).slice(0,4),fs=tl.length>3?46:58,lh=fs+8,ty=345,te=ty+(tl.length-1)*lh,cy=te+56,dl=wrap($('#pDesc').value,30).slice(0,tl.length>3?3:4),ch=dl.length*34+36;
 s+=lines(tl,40,ty,fs,lh,ti,800)+`<rect x="40" y="${te+22}" width="110" height="8" rx="4" fill="${ac}"/><rect x="40" y="${cy}" width="520" height="${ch}" rx="18" fill="${ac}" opacity=".16"/><rect x="40" y="${cy}" width="8" height="${ch}" rx="4" fill="${ac}"/>`+lines(dl,70,cy+42,24,34,tx,400)+`<rect y="722" width="600" height="78" fill="${ac}"/><text x="40" y="769" font-size="22" font-weight="800" fill="${ink(ac)}">${esc($('#pFoot').value)}</text>`;
 $('#poster').innerHTML=`<g font-family="Sora,Nunito,Arial,sans-serif">${s}</g>`;
 const r=(a,b)=>{const q=ratio(a,b);return `${q.toFixed(1)}:1 <span class="${q>=4.5?'ok':q>=3?'mid':'bad'}">${q>=4.5?'baik':q>=3?'cukup (hanya untuk teks besar)':'kurang terbaca'}</span>`};
 $('#contrast').innerHTML=`Kontras judul: ${r(ti,bg)}<br>Kontras teks: ${r(tx,bg)}`;
 [['cbD',bg,'lgD'],['cbS',ac,'lgS'],['cbA',ti,'lgA']].forEach(([a,c,l])=>{$('#'+a).style.background=c;$('#'+a).style.color=ink(c);$('#'+l).style.background=c})}
function applyTheme(i){CI.forEach((p,k)=>{$('#'+p[0]).value=TH[i][k];$('#'+p[1]).value=TH[i][k]})}
CI.forEach(([c,h])=>{$('#'+c).oninput=()=>{$('#'+h).value=$('#'+c).value;drawPoster()};$('#'+h).oninput=e=>{let v=e.target.value;if(v&&v[0]!='#')v='#'+v;if(okHex(v)){$('#'+c).value=v;drawPoster()}}});
['pTitle','pDesc','pBadge','pFoot'].forEach(i=>$('#'+i).oninput=drawPoster);$('#layout').onchange=drawPoster;
$('#theme').onchange=()=>{applyTheme(+$('#theme').value);drawPoster()};
$('#resetBtn').onclick=()=>{Object.keys(DEF).forEach(k=>$('#'+k).value=DEF[k]);$('#layout').value='geo';$('#theme').value='0';applyTheme(0);drawPoster();toast('Poster direset')};
$('#dlBtn').onclick=()=>{const x=new XMLSerializer().serializeToString($('#poster')),img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=1200;c.height=1600;c.getContext('2d').drawImage(img,0,0,1200,1600);c.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='poster-colorlab.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)})};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(x)};
applyTheme(0);drawPoster();updProg();
