/* ColorLab: script (tanpa penyimpanan progres; hanya preferensi tema) */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const PAGES=[
 {id:'home',t:'Beranda',k:'beranda tujuan modul'},
 {id:'m1',t:'Modul 1: Pengenalan Teori Warna',k:'primer sekunder tersier hangat dingin'},
 {id:'m2',t:'Modul 2: Model Warna RGB dan CMYK',k:'rgb cmyk aditif subtraktif simulasi'},
 {id:'m3',t:'Modul 3: Harmoni dan Kombinasi Warna',k:'monokromatik analogus komplementer triadik roda palet'},
 {id:'m4',t:'Modul 4: Psikologi Warna',k:'psikologi makna audiens'},
 {id:'m5',t:'Modul 5: Praktik Palet Warna',k:'poster praktik palet unduh png kontras'},
 {id:'quiz',t:'Lanjut ke Kuis',k:'kuis wordwall wayground evaluasi'}
];
let cur=0;

/* ---------- util warna ---------- */
const hex2rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const rgb2hex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;let h=0,s=0,l=(M+m)/2;
  if(d){s=d/(1-Math.abs(2*l-1));h=M===r?((g-b)/d)%6:M===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360}return[h,s*100,l*100]}
function hsl2hex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
  const[r,g,b]=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return rgb2hex((r+m)*255,(g+m)*255,(b+m)*255)}
const lum=h=>{const[r,g,b]=hex2rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
const ratio=(a,b)=>{const A=lum(a),B=lum(b);return(Math.max(A,B)+.05)/(Math.min(A,B)+.05)};
const inkOn=h=>lum(h)>.45?'#111':'#fff';
const hueOf=h=>rgb2hsl(...hex2rgb(h))[0];
const mix=(a,b,t)=>{const A=hex2rgb(a),B=hex2rgb(b);return rgb2hex(...A.map((v,i)=>v+(B[i]-v)*t))};
const shift=(h,d)=>{const[H,S,L]=rgb2hsl(...hex2rgb(h));return hsl2hex(H+d,S,L)};
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function normHex(v){v=v.trim().replace(/^#/,'');if(/^[0-9a-f]{3}$/i.test(v))v=v.split('').map(c=>c+c).join('');return/^[0-9a-f]{6}$/i.test(v)?'#'+v.toLowerCase():null}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.id);toast.id=setTimeout(()=>t.classList.remove('show'),2400)}

/* ---------- tema terang/gelap (satu-satunya yang disimpan) ---------- */
function setTheme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem('colorlab-theme',t)}catch(e){}}
(function(){let t=null;try{t=localStorage.getItem('colorlab-theme')}catch(e){}
  if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t})();
$('#themeBtn').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');

/* ---------- roda hias (landing) ---------- */
(function(){const n=12;let o='';
  for(let i=0;i<n;i++){const a0=(i/n)*2*Math.PI-Math.PI/2,a1=((i+1)/n)*2*Math.PI-Math.PI/2,P=(r,a)=>`${100+r*Math.cos(a)},${100+r*Math.sin(a)}`;
    o+=`<path d="M${P(34,a0)} L${P(96,a0)} A96,96 0 0 1 ${P(96,a1)} L${P(34,a1)} A34,34 0 0 0 ${P(34,a0)}Z" fill="${hsl2hex(i*30,80,52)}" stroke="rgba(255,255,255,.5)"/>`}
  $('#heroWheel').innerHTML=o})();

/* ---------- navigasi ---------- */
function buildNav(){const ul=$('#navList');ul.innerHTML='';
  PAGES.forEach((p,i)=>{const li=document.createElement('li'),b=document.createElement('button');
    b.textContent=p.t;b.dataset.i=i;b.onclick=()=>go(i);li.appendChild(b);ul.appendChild(li)})}
function go(i){cur=Math.max(0,Math.min(PAGES.length-1,i));
  $$('.page').forEach(s=>s.hidden=s.id!==PAGES[cur].id);
  $$('#navList button').forEach(b=>{const on=+b.dataset.i===cur;b.classList.toggle('active',on);on?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')});
  $('#prevBtn').hidden=cur===0;$('#nextBtn').hidden=cur===PAGES.length-1;
  $('#sidebar').classList.remove('open');window.scrollTo(0,0);$('#main').focus({preventScroll:true})}
$('#prevBtn').onclick=()=>go(cur-1);$('#nextBtn').onclick=()=>go(cur+1);
$('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');
$('#search').oninput=e=>{const q=e.target.value.trim().toLowerCase();let n=0;
  $$('#navList li').forEach((li,i)=>{const p=PAGES[i],hit=!q||(p.t+' '+p.k).toLowerCase().includes(q);li.hidden=!hit;if(hit)n++});
  $('#noResult').hidden=n>0};
addEventListener('scroll',()=>{$('#topBtn').hidden=scrollY<400});
$('#topBtn').onclick=()=>scrollTo({top:0});
$('#startBtn').onclick=()=>{$('#landing').hidden=true;$('#app').hidden=false;go(0)};
PAGES.slice(1,6).forEach((p,i)=>{const b=document.createElement('button');b.className='modcard';
  b.innerHTML=`<b>Modul ${i+1}</b>${p.t.split(': ')[1]}`;b.onclick=()=>go(i+1);$('#moduleCards').appendChild(b)});

/* ---------- Modul 1 ---------- */
const RYB=[
 ['Merah','#e11d48','Primer. Warna dasar yang tidak dapat dibuat dari campuran lain; kuat dan menarik perhatian.'],
 ['Kuning','#facc15','Primer. Warna paling terang; cocok untuk penekanan dan kesan ceria.'],
 ['Biru','#2563eb','Primer. Kesan tenang dan tepercaya; sering dipakai untuk teknologi.'],
 ['Oranye','#f97316','Sekunder. Campuran merah dan kuning; hangat dan enerjik.'],
 ['Hijau','#16a34a','Sekunder. Campuran kuning dan biru; kesan alami dan segar.'],
 ['Ungu','#7c3aed','Sekunder. Campuran merah dan biru; kesan kreatif dan misterius.'],
 ['Merah-oranye','#ef4444','Tersier. Campuran merah dan oranye.'],
 ['Kuning-oranye','#fbbf24','Tersier. Campuran kuning dan oranye.'],
 ['Kuning-hijau','#a3e635','Tersier. Campuran kuning dan hijau.'],
 ['Biru-hijau','#0d9488','Tersier. Campuran biru dan hijau.'],
 ['Biru-ungu','#4f46e5','Tersier. Campuran biru dan ungu.'],
 ['Merah-ungu','#c026d3','Tersier. Campuran merah dan ungu.']];
RYB.forEach(([n,c,d])=>{const b=document.createElement('button');b.className='sw';b.style.background=c;b.style.color=inkOn(c);b.textContent=n;b.setAttribute('aria-pressed','false');
  b.onclick=()=>{$$('.sw').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');$('#rybInfo').innerHTML=`<b>${n}</b> (${c}). ${d}`};
  $('#rybSw').appendChild(b)});

/* ---------- Modul 2: simulasi ---------- */
function simRGB(){const r=+$('#rR').value,g=+$('#rG').value,b=+$('#rB').value;
  $('#oR').value=r;$('#oG').value=g;$('#oB').value=b;
  $('#boxRGB').style.background=`rgb(${r},${g},${b})`;$('#txtRGB').textContent=`${r}, ${g}, ${b}`;
  const R=r/255,G=g/255,B=b/255,k=1-Math.max(R,G,B);
  const c=k>=1?0:(1-R-k)/(1-k),m=k>=1?0:(1-G-k)/(1-k),y=k>=1?0:(1-B-k)/(1-k);
  const dull=v=>v*.82+112*.18;
  $('#boxCMYK').style.background=`rgb(${dull(r)|0},${dull(g)|0},${dull(b)|0})`;
  $('#txtCMYK').textContent=[c,m,y,k].map(v=>Math.round(v*100)+'%').join(', ')}
['#rR','#rG','#rB'].forEach(s=>$(s).oninput=simRGB);simRGB();

/* ---------- palet "saya" (hanya di memori, hilang saat halaman ditutup) ---------- */
let mine=[],curPal=[];
function addBox(sel){const el=$(sel);
  el.innerHTML='<input class="hex" placeholder="#RRGGBB" maxlength="7" aria-label="Kode warna"><input type="color" value="#14b8a6" aria-label="Pilih warna"><button class="btn small">Tambah ke palet</button>';
  const[t,c,b]=el.children;c.oninput=()=>t.value=c.value;
  const add=()=>{const h=normHex(t.value);
    if(!h)return toast('Kode warna tidak valid. Contoh: #1e90ff');
    if(mine.includes(h))return toast('Warna itu sudah ada di palet saya');
    if(mine.length>=12)return toast('Palet penuh (maksimal 12 warna)');
    mine.push(h);t.value='';renderPalettes();toast('Ditambahkan: '+h)};
  b.onclick=add;t.onkeydown=e=>{if(e.key==='Enter')add()}}
const swatch=(c,x)=>`<div class="pc" style="background:${c};color:${inkOn(c)}">${c}${x?`<button class="x" data-rm="${c}" aria-label="Hapus ${c}" style="color:${inkOn(c)}">×</button>`:''}</div>`;
function renderPalettes(){
  $('#palette').innerHTML=curPal.map(c=>swatch(c)).join('');
  $('#myPalette').innerHTML=mine.length?mine.map(c=>swatch(c,1)).join(''):'<p class="hint">Belum ada warna tambahan. Ketik kode warna di atas.</p>';
  const all=[...new Set([...curPal,...mine])];
  $('#chips').innerHTML=all.map(c=>`<button class="chip-c" style="background:${c};color:${inkOn(c)}" data-c="${c}" aria-label="Pakai ${c}">${c}</button>`).join('')}
document.addEventListener('click',e=>{
  const r=e.target.closest('[data-rm]');if(r){mine=mine.filter(c=>c!==r.dataset.rm);renderPalettes();return}
  const ch=e.target.closest('[data-c]');if(ch){setRole($('#applyTo').value,ch.dataset.c);toast('Warna dipakai: '+ch.dataset.c)}});
addBox('#addBox3');addBox('#addBox5');

/* ---------- Modul 3: roda warna klik + harmoni ---------- */
function harmony(hex,type){const[h,s,l]=rgb2hsl(...hex2rgb(hex));
  switch(type){
   case'mono':return[[h,s,Math.max(15,l-30)],[h,s,Math.max(15,l-15)],[h,s,l],[h,s*.8,Math.min(90,l+18)],[h,s*.6,Math.min(95,l+34)]].map(a=>hsl2hex(...a));
   case'analog':return[-30,0,30].map(d=>hsl2hex(h+d,s,l));
   case'comp':return[hsl2hex(h,s,l),hsl2hex(h+180,s,l),hsl2hex(h,s*.5,Math.min(92,l+30))];
   case'triad':return[0,120,240].map(d=>hsl2hex(h+d,s,l));
   default:return[0,150,210].map(d=>hsl2hex(h+d,s,l))}}
const RINGS=[[62,88,52,85],[43,62,76,85],[26,43,32,70]]; // [r dalam, r luar, lightness, saturation]
function drawWheel(base,pal){const n=12;let o='';
  const P=(r,a)=>`${(100+r*Math.cos(a)).toFixed(2)},${(100+r*Math.sin(a)).toFixed(2)}`;
  RINGS.forEach(([r0,r1,l,s])=>{for(let i=0;i<n;i++){
    const hx=hsl2hex(i*30,s,l),a0=(i/n)*2*Math.PI-Math.PI/2,a1=((i+1)/n)*2*Math.PI-Math.PI/2;
    o+=`<path class="seg${hx===base?' sel':''}" tabindex="0" role="button" data-hex="${hx}" aria-label="Pilih warna ${hx}" fill="${hx}" d="M${P(r0,a0)} L${P(r1,a0)} A${r1},${r1} 0 0 1 ${P(r1,a1)} L${P(r0,a1)} A${r0},${r0} 0 0 0 ${P(r0,a0)}Z"><title>${hx}</title></path>`}});
  o+=`<circle cx="100" cy="100" r="22" fill="${base}" stroke="#fff" stroke-width="3"/>`;
  pal.forEach(c=>{const a=((Math.round(hueOf(c)/30)%12)*30+15-90)*Math.PI/180,x=100+94*Math.cos(a),y=100+94*Math.sin(a);
    o+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${c}" stroke="#fff" stroke-width="2.5"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="none" stroke="#000" stroke-width="1"/>`});
  $('#wheel').innerHTML=o}
function drawHarm(){const base=$('#basePick').value,pal=harmony(base,$('#harmSel').value);curPal=pal;
  drawWheel(base,pal);renderPalettes();
  const[d,m,a]=[pal[0],pal[1]||pal[0],pal[2]||pal[1]||pal[0]];
  $('#harmPrev').innerHTML=`<div style="flex:6;background:${d};color:${inkOn(d)}">60% dominan<br>Judul Poster</div><div style="flex:3;background:${m};color:${inkOn(m)}">30% pendukung</div><div style="flex:1;background:${a};color:${inkOn(a)}">10%</div>`}
const pickWheel=h=>{$('#basePick').value=h;drawHarm()};
$('#wheel').addEventListener('click',e=>{const p=e.target.closest('path[data-hex]');if(p)pickWheel(p.dataset.hex)});
$('#wheel').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const p=e.target.closest('path[data-hex]');if(p){e.preventDefault();pickWheel(p.dataset.hex);$('#wheel path.sel')?.focus()}}});
$('#basePick').oninput=drawHarm;$('#harmSel').onchange=drawHarm;

/* ---------- Modul 4: psikologi ---------- */
[['Merah','#e11d48','Energi, urgensi, cinta. Cocok untuk diskon dan peringatan.'],
 ['Biru','#2563eb','Tenang, tepercaya, profesional. Cocok untuk teknologi dan perbankan.'],
 ['Hijau','#16a34a','Alam, sehat, tumbuh. Cocok untuk lingkungan dan kesehatan.'],
 ['Kuning','#facc15','Ceria, optimis, perhatian. Cocok untuk anak dan penekanan.'],
 ['Ungu','#7c3aed','Kreatif, imajinatif, mewah. Cocok untuk seni dan kecantikan.'],
 ['Hitam','#111827','Elegan, tegas, formal. Cocok untuk produk premium.']
].forEach(([n,c,d])=>$('#psyCards').insertAdjacentHTML('beforeend',`<div class="card" style="border-top:6px solid ${c}"><b>${n}</b><br>${d}</div>`));

/* ---------- Modul 5: poster ---------- */
const ROLES=['Bg','Title','Text','Acc'];
const THEMES=[['#fff7ed','#be123c','#1f2937','#f59e0b'],['#0f172a','#38bdf8','#e2e8f0','#6366f1'],['#7c2d12','#fde047','#fff7ed','#fb923c'],['#0b1026','#f472b6','#e5e7ff','#22d3ee']];
function setRole(r,h,draw=true){$('#c'+r).value=h;$('#h'+r).value=h;if(draw)drawPoster()}
function applyTheme(){THEMES[+$('#theme').value].forEach((h,i)=>setRole(ROLES[i],h,false));drawPoster()}
ROLES.forEach(r=>{
  $('#c'+r).oninput=e=>setRole(r,e.target.value);
  $('#h'+r).oninput=e=>{const h=normHex(e.target.value);if(h){$('#c'+r).value=h;drawPoster()}};
  $('#h'+r).onblur=e=>{e.target.value=$('#c'+r).value}});
function wrap(txt,max){const w=txt.split(/\s+/).filter(Boolean),L=[];let c='';w.forEach(x=>{if((c+' '+x).trim().length>max&&c){L.push(c);c=x}else c=(c+' '+x).trim()});if(c)L.push(c);return L.length?L:[' ']}
function fit(txt,W,sizes,maxLines,k){for(const fs of sizes){const L=wrap(txt,Math.max(4,Math.floor(W/(k*fs))));if(L.length<=maxLines)return{fs,L}}
  const fs=sizes[sizes.length-1];return{fs,L:wrap(txt,Math.max(4,Math.floor(W/(k*fs)))).slice(0,maxLines)}}
const FT='font-family="Sora,Arial,sans-serif"',FN='font-family="Nunito,Arial,sans-serif"';
const lines=(L,x,y0,fs,lh,fill,fam,wt,anc,ex='')=>L.map((l,i)=>`<text x="${x}" y="${y0+i*lh}" ${fam} font-weight="${wt}" font-size="${fs}" fill="${fill}" text-anchor="${anc}" ${ex}>${esc(l)}</text>`).join('');
const bfs=(t,max,box)=>Math.max(12,Math.min(max,Math.floor(box/(Math.max(t.length,1)*.64))));

function drawPoster(){
  const[bg,ti,tx,ac]=ROLES.map(r=>$('#c'+r).value),ac2=shift(ac,-35),lay=$('#layout').value;
  const title=$('#pTitle').value.trim()||' ',desc=$('#pDesc').value.trim(),badge=$('#pBadge').value.trim(),foot=$('#pFoot').value.trim();
  let s='';
  if(lay==='geo'){
    const t=fit(title,470,[64,54,46,38],4,.64),d=fit(desc,470,[26,24,22],3,.52),lh=Math.round(t.fs*1.12),yT=340,yD=yT+(t.L.length-1)*lh+54;
    s=`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${mix(bg,ac,.25)}"/></linearGradient>
      <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="3" fill="${ac}" opacity=".6"/></pattern></defs>
      <rect width="600" height="800" fill="url(#g)"/>
      <circle cx="520" cy="120" r="170" fill="${ac}"/><circle cx="410" cy="215" r="70" fill="${ac2}" opacity=".92"/>
      <circle cx="40" cy="660" r="150" fill="${ac2}" opacity=".35"/><rect x="330" y="560" width="250" height="150" fill="url(#dots)"/>
      <rect x="56" y="96" width="60" height="8" rx="4" fill="${ac}"/>
      <text x="56" y="140" ${FT} font-weight="600" font-size="18" letter-spacing="4" fill="${ti}">KEGIATAN KREATIF</text>
      ${lines(t.L,56,yT,t.fs,lh,ti,FT,800,'start')}${lines(d.L,56,yD,d.fs,34,tx,FN,600,'start')}
      ${badge?`<g transform="rotate(-12 480 650)"><circle cx="480" cy="650" r="64" fill="${ac2}" stroke="${bg}" stroke-width="6"/><text x="480" y="${650+bfs(badge,26,100)*.35}" text-anchor="middle" ${FT} font-weight="800" font-size="${bfs(badge,26,100)}" fill="${inkOn(ac2)}">${esc(badge)}</text></g>`:''}
      <rect y="736" width="600" height="64" fill="${ti}"/><text x="56" y="776" ${FN} font-weight="700" font-size="20" fill="${inkOn(ti)}">${esc(foot)}</text>`;
  }else if(lay==='wave'){
    const t=fit(title,480,[60,52,44,38],3,.64),d=fit(desc,460,[24,22],3,.52),lh=Math.round(t.fs*1.12),yT=385,yD=yT+(t.L.length-1)*lh+50,dEnd=yD+(d.L.length-1)*32,yB=Math.min(Math.max(dEnd+50,570),625),bw=Math.max(120,badge.length*20*.7+50);
    s=`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(bg,ac,.12)}"/><stop offset="1" stop-color="${bg}"/></linearGradient></defs>
      <rect width="600" height="800" fill="url(#g)"/>
      <circle cx="300" cy="120" r="148" fill="none" stroke="${ac}" stroke-width="5" opacity=".25"/><circle cx="300" cy="120" r="112" fill="none" stroke="${ac}" stroke-width="6" opacity=".45"/><circle cx="300" cy="120" r="80" fill="${ac}"/>
      <circle cx="80" cy="90" r="22" fill="${ac2}"/><circle cx="530" cy="210" r="14" fill="${ac2}"/><circle cx="520" cy="60" r="8" fill="${ac}"/><circle cx="60" cy="230" r="9" fill="${ac}" opacity=".7"/>
      <text x="300" y="320" text-anchor="middle" ${FT} font-weight="600" font-size="18" letter-spacing="4" fill="${ti}">KEGIATAN KREATIF</text>
      ${lines(t.L,300,yT,t.fs,lh,ti,FT,800,'middle')}${lines(d.L,300,yD,d.fs,32,tx,FN,600,'middle')}
      ${badge?`<rect x="${300-bw/2}" y="${yB-26}" width="${bw}" height="48" rx="24" fill="${ti}"/><text x="300" y="${yB+7}" text-anchor="middle" ${FT} font-weight="800" font-size="20" fill="${inkOn(ti)}">${esc(badge)}</text>`:''}
      <path d="M0 690 C120 650 220 740 330 700 S520 650 600 690 V800 H0Z" fill="${ac2}" opacity=".85"/><path d="M0 730 C140 690 240 780 360 740 S540 700 600 735 V800 H0Z" fill="${ac}"/>
      <text x="300" y="782" text-anchor="middle" ${FN} font-weight="700" font-size="20" fill="${inkOn(ac)}">${esc(foot)}</text>`;
  }else{
    const t=fit(title,470,[68,58,48,40],4,.64),d=fit(desc,450,[26,24,22],3,.52),lh=Math.round(t.fs*1.1),yT=210,yD=yT+(t.L.length-1)*lh+56;
    s=`<rect width="600" height="800" fill="${bg}"/><rect width="26" height="800" fill="${ac2}"/><rect x="26" width="10" height="800" fill="${ac}"/>
      <circle cx="500" cy="130" r="130" fill="none" stroke="${ac}" stroke-width="34" opacity=".55"/><circle cx="560" cy="290" r="38" fill="${ac2}"/>
      <rect x="64" y="84" width="16" height="16" fill="${ac2}"/><text x="92" y="99" ${FT} font-weight="600" font-size="18" letter-spacing="4" fill="${ti}">KEGIATAN KREATIF</text>
      ${lines(t.L,69,yT+5,t.fs,lh,ac,FT,800,'start')}${lines(t.L,64,yT,t.fs,lh,ti,FT,800,'start')}
      ${lines(d.L,64,yD,d.fs,34,tx,FN,600,'start')}
      <polygon points="0,610 600,520 600,625 0,715" fill="${ac}"/><polygon points="0,588 600,498 600,510 0,600" fill="${ac2}"/>
      ${badge?`<g transform="rotate(-8 430 610)"><rect x="330" y="575" width="200" height="70" rx="14" fill="${ti}"/><text x="430" y="${610+bfs(badge,30,170)*.36}" text-anchor="middle" ${FT} font-weight="800" font-size="${bfs(badge,30,170)}" fill="${inkOn(ti)}">${esc(badge)}</text></g>`:''}
      <text x="64" y="765" ${FN} font-weight="700" font-size="20" fill="${ti}">${esc(foot)}</text>`;
  }
  $('#poster').innerHTML=s;
  const c1=ratio(ti,bg),c2=ratio(tx,bg),f=r=>r>=4.5?'baik':r>=3?'cukup (layak untuk teks besar)':'kurang, sulit dibaca';
  $('#contrast').innerHTML=`Kontras judul: ${c1.toFixed(1)}:1 (${f(c1)})<br>Kontras teks: ${c2.toFixed(1)}:1 (${f(c2)})`}
$('#theme').onchange=applyTheme;$('#layout').onchange=drawPoster;
['pTitle','pDesc','pBadge','pFoot'].forEach(i=>$('#'+i).oninput=drawPoster);
$('#resetBtn').onclick=()=>{$('#pTitle').value='Pameran Karya Kreatif DKV';$('#pDesc').value='Sabtu, 8 Agustus 2026. Aula SMK. Gratis dan terbuka untuk umum.';$('#pBadge').value='GRATIS';$('#pFoot').value='SMK · Jurusan DKV';$('#theme').value='0';$('#layout').value='geo';applyTheme();toast('Poster dikembalikan ke awal')};
$('#dlBtn').onclick=()=>{const svg=$('#poster').cloneNode(true);svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width',1200);svg.setAttribute('height',1600);
  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'})),img=new Image();
  img.onload=()=>{const cv=document.createElement('canvas');cv.width=1200;cv.height=1600;cv.getContext('2d').drawImage(img,0,0);URL.revokeObjectURL(url);
    cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='poster-colorlab.png';a.click();toast('Poster diunduh')})};
  img.onerror=()=>toast('Gagal membuat PNG. Coba lagi.');img.src=url};

buildNav();drawHarm();applyTheme();