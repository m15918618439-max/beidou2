const nav=document.getElementById('nav');
addEventListener('scroll',()=>{nav.classList.toggle('scrolled',scrollY>30)});

// ---- router ----
const pages=['home','agent','products','solutions','sol-traffic','sol-safety','sol-property','sol-public','sc-rail','sc-hub','sc-highway','sc-railpolice','sc-border','sc-residential','sc-commercial','sc-office','sc-park','sc-gov','sc-hospital','sc-school','tech','about'];
const sectionRoutes={'t-stack':['tech','t-stack'],'t-flow':['tech','t-flow'],'t-flywheel':['tech','t-flywheel'],'t-cert':['tech','t-cert']};
const pageTitles={
  home:'北斗智能 · 空间智能体 | 物理世界运营的 Agentic AI 平台',
  agent:'空间智能体 | 北斗智能',
  products:'产品体系 | 北斗智能',
  solutions:'行业解决方案 | 北斗智能',
  tech:'核心技术 | 北斗智能',
  about:'关于我们 | 北斗智能'
};
function showPage(id,scrollTo){
  if(sectionRoutes[id]){const [page,section]=sectionRoutes[id];showPage(page,section);return;}
  if(!pages.includes(id))id='home';
  document.title=pageTitles[id] || (id.startsWith('sol-')||id.startsWith('sc-') ? '行业解决方案 | 北斗智能' : id.startsWith('t-') ? '核心技术 | 北斗智能' : '北斗智能 · 空间智能体');
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+id));
  // 二级页时，父级导航保持高亮
  let navKey = (id.startsWith('sol-')||id.startsWith('sc-')) ? 'solutions' : id;
  if(id.startsWith('t-')) navKey='tech';
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.dataset.nav===navKey));
  // reset reveals in newly shown page then observe
  const cur=document.getElementById('page-'+id);
  applyRevealStagger(cur);
  cur.querySelectorAll('.reveal').forEach(el=>{el.classList.remove('in');io.observe(el)});
  cur.querySelectorAll('[data-count]').forEach(el=>{co.observe(el)});
  initStarBorderCards(cur);
  if(id==='home'||id==='products')setTimeout(()=>document.querySelectorAll('.emp-grid').forEach(t=>t._empUpdate?.()),100);
  if(id==='home')setTimeout(()=>initPlasma(cur),80);
  if(scrollTo){const t=document.getElementById(scrollTo);if(t){setTimeout(()=>t.scrollIntoView({behavior:'smooth'}),60);return;}}
  window.scrollTo({top:0,behavior:'instant'in window?'instant':'auto'});
}
function nav2(id){location.hash=id;}
document.querySelectorAll('a[data-nav]').forEach(a=>{if(!a.hasAttribute('href'))a.setAttribute('href','#'+a.dataset.nav);});
document.querySelectorAll('a[data-scroll]').forEach(a=>{if(!a.hasAttribute('href'))a.setAttribute('href','#'+a.dataset.scroll);});
document.addEventListener('click',e=>{
  const n=e.target.closest('[data-nav]');
  if(n){e.preventDefault();nav2(n.dataset.nav);return;}
  const s=e.target.closest('[data-scroll]');
  if(s){e.preventDefault();const t=document.getElementById(s.dataset.scroll);if(t)t.scrollIntoView({behavior:'smooth'});}
});
addEventListener('hashchange',()=>showPage(location.hash.slice(1)));

// ---- reveal ----
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
// ---- counters ----
function animateCount(el){
  const target=+el.dataset.count;const suffix=el.dataset.suffix||'';const inner=el.querySelector('.u');
  const dur=1400;const t0=performance.now();
  if(inner&&(!el.firstChild||el.firstChild.nodeType!==3)){el.insertBefore(document.createTextNode('0'),inner);}
  function step(now){const p=Math.min((now-t0)/dur,1);const eased=1-Math.pow(1-p,3);const val=Math.round(target*eased);
    if(inner){el.firstChild.nodeValue=val.toLocaleString();}else{el.textContent=val.toLocaleString()+suffix;}
    if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
const co=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){animateCount(e.target);co.unobserve(e.target)}})},{threshold:.5});

function applyRevealStagger(root=document){
  root.querySelectorAll('.cards-3,.emp-grid,.mgrid,.sol-grid,.cap6,.tech3,.asset4,.contact-grid,.sol-entry,.metric-row').forEach(group=>{
    Array.from(group.children).forEach((el,i)=>el.style.setProperty('--stagger',`${Math.min(i*70,420)}ms`));
  });
}

function initSpotlightCards(root=document){
  const selector='#page-home .pcard,#page-home .layer,#page-home .emp,#page-home .mcell,#page-home .sol,#page-home .ccard';
  root.querySelectorAll(selector).forEach(card=>{
    if(card.dataset.spotlightReady)return;
    card.dataset.spotlightReady='true';
    card.classList.add('spotlight-card');
    card.addEventListener('pointerenter',()=>card.classList.add('is-lit'));
    card.addEventListener('pointerleave',()=>{
      card.classList.remove('is-lit');
      card.style.setProperty('--mx','50%');
      card.style.setProperty('--my','50%');
    });
    card.addEventListener('pointermove',e=>{
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${e.clientX-rect.left}px`);
      card.style.setProperty('--my',`${e.clientY-rect.top}px`);
    });
  });
}

function scrollCases(dir){const t=document.getElementById('caseTrack');if(t)t.scrollBy({left:dir*380,behavior:'smooth'});}
function initEmployeeCarousels(root=document){
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.querySelectorAll('.emp-grid').forEach(track=>{
    if(track.dataset.carouselReady)return;
    track.dataset.carouselReady='true';
    const cards=[...track.querySelectorAll('.emp')];
    if(cards.length<2)return;
    track.classList.add('is-looping');
    cards.forEach((card,i)=>{
      const clone=card.cloneNode(true);
      clone.classList.add('emp-clone');
      clone.classList.remove('reveal');
      clone.classList.add('in');
      clone.setAttribute('aria-hidden','true');
      clone.dataset.cloneOf=String(i);
      track.appendChild(clone);
    });
    let allCards=[...track.querySelectorAll('.emp')];
    const dots=document.createElement('div');
    dots.className='emp-carousel-dots';
    dots.setAttribute('aria-label','AI 员工轮播页码');
    track.insertAdjacentElement('afterend',dots);
    let active=0,visible=false,dragging=false,startX=0,startLeft=0,timer=0,resumeTimer=0,introTimer=0,scrollFrame=0,enteredOnce=false;
    const attachCardLight=card=>{
      card.addEventListener('pointermove',e=>{
        const rect=card.getBoundingClientRect();
        card.style.setProperty('--mx',`${e.clientX-rect.left}px`);
        card.style.setProperty('--my',`${e.clientY-rect.top}px`);
      });
      card.addEventListener('pointerleave',()=>{
        card.style.setProperty('--mx','50%');
        card.style.setProperty('--my','42%');
      });
    };
    allCards.forEach(attachCardLight);
    const dotBtns=cards.map((card,i)=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='emp-dot';
      btn.setAttribute('aria-label',`切换到第 ${i+1} 个 AI 员工`);
      btn.addEventListener('click',()=>{enteredOnce=true;pause(3600);scrollToIndex(i,'auto');});
      dots.appendChild(btn);
      return btn;
    });
    const maxScroll=()=>Math.max(0,track.scrollWidth-track.clientWidth);
    const rawLeft=card=>card.offsetLeft-track.offsetLeft;
    const loopStart=()=>rawLeft(allCards[cards.length]);
    const cardLeft=i=>Math.min(rawLeft(cards[i]),maxScroll());
    const normalizeLoop=()=>{
      const start=loopStart();
      if(start>0&&track.scrollLeft>=start-1){
        track.scrollLeft=rawLeft(cards[0])+(track.scrollLeft-start);
      }
    };
    const nearestIndex=()=>{
      const x=track.scrollLeft;
      let best=0,dist=Infinity;
      allCards.forEach((card,i)=>{
        const d=Math.abs((card.offsetLeft-track.offsetLeft)-x);
        if(d<dist){dist=d;best=i%cards.length;}
      });
      return best;
    };
    const setActiveDot=()=>{
      dotBtns.forEach((btn,i)=>{
        btn.classList.toggle('active',i===active);
        btn.setAttribute('aria-current',i===active?'true':'false');
      });
    };
    const update=()=>{
      active=nearestIndex();
      setActiveDot();
    };
    const scrollToIndex=(i,behavior='smooth')=>{
      const next=(i+cards.length)%cards.length;
      const useForwardClone=active===cards.length-1&&next===0&&allCards[cards.length];
      active=next;
      setActiveDot();
      const left=useForwardClone?Math.min(rawLeft(allCards[cards.length]),maxScroll()):cardLeft(active);
      track.scrollTo({left,behavior});
      if(useForwardClone){
        setTimeout(()=>normalizeLoop(),behavior==='auto'?0:520);
      }
    };
    const stop=()=>{clearInterval(timer);timer=0;};
    const start=()=>{
      if(reduceMotion||!visible||dragging||timer)return;
      timer=setInterval(()=>scrollToIndex(active+1),3000);
    };
    const pause=(delay=1800)=>{
      stop();
      clearTimeout(resumeTimer);
      clearTimeout(introTimer);
      if(delay)resumeTimer=setTimeout(start,delay);
    };
    track._empUpdate=update;
    track.addEventListener('scroll',()=>{
      if(scrollFrame)return;
      scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;if(!dragging)normalizeLoop();update();});
    },{passive:true});
    track.addEventListener('pointerdown',e=>{
      enteredOnce=true;
      dragging=true;
      startX=e.clientX;
      startLeft=track.scrollLeft;
      track.classList.add('dragging');
      pause(0);
      track.setPointerCapture?.(e.pointerId);
    });
    track.addEventListener('pointermove',e=>{
      if(dragging)track.scrollLeft=startLeft-(e.clientX-startX);
    });
    ['pointerup','pointercancel'].forEach(type=>track.addEventListener(type,()=>{
      dragging=false;
      track.classList.remove('dragging');
      update();
      pause(2600);
    }));
    track.addEventListener('pointerenter',()=>pause(0));
    track.addEventListener('pointerleave',()=>{
      if(dragging){dragging=false;track.classList.remove('dragging');}
      pause(1600);
    });
    track.addEventListener('wheel',()=>pause(2600),{passive:true});
    track.addEventListener('touchstart',()=>pause(2600),{passive:true});
    track.addEventListener('focusin',()=>pause(0));
    track.addEventListener('focusout',()=>pause(1800));
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        visible=entry.isIntersecting;
        if(visible){
          update();
          if(!enteredOnce&&!reduceMotion){
            enteredOnce=true;
            introTimer=setTimeout(()=>{if(visible&&!dragging)scrollToIndex(active+1);},650);
          }
          start();
        }else{
          stop();
          clearTimeout(introTimer);
        }
      });
    },{threshold:.34});
    observer.observe(track);
    addEventListener('resize',()=>{allCards=[...track.querySelectorAll('.emp')];update();scrollToIndex(active,'auto');},{passive:true});
    update();
  });
}
function initPlasma(root=document){
  const container=root.querySelector('[data-plasma]');
  if(!container||container.dataset.plasmaReady)return;
  container.dataset.plasmaReady='true';

  const canvas=document.createElement('canvas');
  container.appendChild(canvas);
  const gl=canvas.getContext('webgl2',{
    alpha:true,
    premultipliedAlpha:false,
    antialias:false,
    depth:false,
    stencil:false,
    powerPreference:'high-performance'
  });
  if(!gl){
    container.removeChild(canvas);
    container.classList.add('plasma-fallback-only');
    return;
  }

  const vertex=`#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
  const fragment=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
uniform float uMouseStrength;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  float interaction = clamp(uMouseInteractive, 0.0, 1.0);
  vec2 mouseOffset = (uMouse - center) * 0.00045;
  vec2 mouseDelta = uMouse - C;
  float mouseRange = max(iResolution.y * 0.38, 1.0);
  float localPull = exp(-dot(mouseDelta, mouseDelta) / (mouseRange * mouseRange));
  C += mouseOffset * length(C - center) * uMouseStrength * interaction;
  C += normalize(mouseDelta + vec2(0.001)) * localPull * iResolution.y * 0.072 * uMouseStrength * interaction;

  float i = 0.0, d = 0.0, z = 0.0, T = iTime * uSpeed * uDirection;
  vec3 O = vec3(0.0), p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.0; O += o.w / d * o.xyz) {
    p = z * normalize(vec3(C - 0.5 * r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;
    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    Q = p.xz *= mat2(cos(p.y + vec4(0, 11, 33, 0) - T));
    z += d = abs(sqrt(length(Q * Q)) - 0.25 * (5.0 + S.y)) / 3.0 + 8e-4;
    o = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2, 1, 0, 8));
  }
  o.xyz = tanh(O / 1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  float alpha = clamp(length(rgb) * uOpacity, 0.0, 1.0);
  fragColor = vec4(finalColor, alpha);
}`;

  const hexToRgb=hex=>{
    const result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1],16)/255,parseInt(result[2],16)/255,parseInt(result[3],16)/255] : [1,.5,.2];
  };
  const compile=(type,source)=>{
    const shader=gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vert=compile(gl.VERTEX_SHADER,vertex);
  const frag=compile(gl.FRAGMENT_SHADER,fragment);
  if(!vert||!frag){
    container.removeChild(canvas);
    return;
  }

  const program=gl.createProgram();
  gl.attachShader(program,vert);
  gl.attachShader(program,frag);
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    container.removeChild(canvas);
    return;
  }

  const vertices=new Float32Array([
    -1,-1,0,0,
     1,-1,1,0,
    -1, 1,0,1,
     1, 1,1,1
  ]);
  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
  gl.useProgram(program);
  const stride=4*Float32Array.BYTES_PER_ELEMENT;
  const positionLoc=gl.getAttribLocation(program,'position');
  const uvLoc=gl.getAttribLocation(program,'uv');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,stride,0);
  gl.enableVertexAttribArray(uvLoc);
  gl.vertexAttribPointer(uvLoc,2,gl.FLOAT,false,stride,2*Float32Array.BYTES_PER_ELEMENT);

  const uniforms={};
  ['iResolution','iTime','uCustomColor','uUseCustomColor','uSpeed','uDirection','uScale','uOpacity','uMouse','uMouseInteractive','uMouseStrength'].forEach(name=>{
    uniforms[name]=gl.getUniformLocation(program,name);
  });

  const color=hexToRgb('#2d6dff');
  gl.uniform3f(uniforms.uCustomColor,color[0],color[1],color[2]);
  gl.uniform1f(uniforms.uUseCustomColor,1);
  gl.uniform1f(uniforms.uSpeed,.26);
  gl.uniform1f(uniforms.uDirection,1);
  gl.uniform1f(uniforms.uScale,1.12);
  gl.uniform1f(uniforms.uOpacity,.68);
  gl.uniform1f(uniforms.uMouseInteractive,0);
  gl.uniform1f(uniforms.uMouseStrength,1.85);
  gl.uniform2f(uniforms.uMouse,0,0);
  gl.clearColor(0,0,0,0);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  let raf=0;
  let running=false;
  let contextLost=false;
  let dpr=1;
  let pointerActive=false;
  let interaction=0;
  let targetInteraction=0;
  let idleTimer=0;
  const mouse={x:0,y:0};
  const targetMouse={x:0,y:0};
  const t0=performance.now();
  const clamp=(value,min,max)=>Math.min(Math.max(value,min),max);
  const setNeutralMouse=(immediate=false)=>{
    const rect=container.getBoundingClientRect();
    const x=rect.width*.5;
    const y=rect.height*.42;
    targetMouse.x=x*dpr;
    targetMouse.y=y*dpr;
    container.style.setProperty('--plasma-x',`${x}px`);
    container.style.setProperty('--plasma-y',`${y}px`);
    container.style.setProperty('--plasma-glow','.16');
    hitArea.style.setProperty('--hero-pointer-core','0');
    hitArea.style.setProperty('--hero-pointer-halo','0');
    if(immediate){
      mouse.x=targetMouse.x;
      mouse.y=targetMouse.y;
      gl.uniform2f(uniforms.uMouse,mouse.x,mouse.y);
    }
  };
  const setSize=()=>{
    const rect=container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    dpr=Math.min(devicePixelRatio||1,1.75);
    const width=Math.max(1,Math.floor(rect.width*dpr));
    const height=Math.max(1,Math.floor(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
      gl.uniform2f(uniforms.iResolution,width,height);
      if(!pointerActive)setNeutralMouse(true);
    }
  };
  const render=t=>{
    if(!running||contextLost)return;
    raf=requestAnimationFrame(render);
    if(container.offsetParent===null)return;
    setSize();
    mouse.x+=(targetMouse.x-mouse.x)*.12;
    mouse.y+=(targetMouse.y-mouse.y)*.12;
    interaction+=(targetInteraction-interaction)*(targetInteraction > interaction ? .42 : .06);
    gl.uniform2f(uniforms.uMouse,mouse.x,mouse.y);
    gl.uniform1f(uniforms.uMouseInteractive,interaction);
    gl.uniform1f(uniforms.iTime,(t-t0)*.001);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  };
  const start=()=>{
    if(running||contextLost)return;
    running=true;
    raf=requestAnimationFrame(render);
  };
  const stop=()=>{
    running=false;
    cancelAnimationFrame(raf);
  };
  const hitArea=container.closest('.hero')||container;
  const updateMouse=e=>{
    const heroRect=hitArea.getBoundingClientRect();
    const insideHero=e.clientX>=heroRect.left&&e.clientX<=heroRect.right&&e.clientY>=heroRect.top&&e.clientY<=heroRect.bottom;
    if(!insideHero){
      if(pointerActive)resetMouse();
      return;
    }
    const rect=container.getBoundingClientRect();
    const x=clamp(e.clientX-rect.left,0,rect.width);
    const y=clamp(e.clientY-rect.top,0,rect.height);
    const hx=clamp(e.clientX-heroRect.left,0,heroRect.width);
    const hy=clamp(e.clientY-heroRect.top,0,heroRect.height);
    pointerActive=true;
    targetInteraction=1;
    clearTimeout(idleTimer);
    idleTimer=setTimeout(()=>{
      targetInteraction=0;
      container.style.setProperty('--plasma-glow','.16');
      hitArea.style.setProperty('--hero-pointer-core','0');
      hitArea.style.setProperty('--hero-pointer-halo','0');
    },820);
    targetMouse.x=x*dpr;
    targetMouse.y=y*dpr;
    container.style.setProperty('--plasma-x',`${x}px`);
    container.style.setProperty('--plasma-y',`${y}px`);
    container.style.setProperty('--plasma-glow','.9');
    hitArea.style.setProperty('--hero-pointer-x',`${hx}px`);
    hitArea.style.setProperty('--hero-pointer-y',`${hy}px`);
    hitArea.style.setProperty('--hero-pointer-core','.42');
    hitArea.style.setProperty('--hero-pointer-halo','.3');
  };
  const resetMouse=()=>{
    pointerActive=false;
    targetInteraction=0;
    clearTimeout(idleTimer);
    setNeutralMouse();
  };
  hitArea.addEventListener('pointermove',updateMouse,{passive:true});
  hitArea.addEventListener('mousemove',updateMouse,{passive:true});
  hitArea.addEventListener('pointerleave',resetMouse,{passive:true});
  addEventListener('pointermove',updateMouse,{passive:true});
  addEventListener('mousemove',updateMouse,{passive:true});
  addEventListener('resize',setSize,{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();
    contextLost=true;
    stop();
  });
  canvas.addEventListener('webglcontextrestored',()=>{contextLost=false;start();});
  if('ResizeObserver'in window)new ResizeObserver(setSize).observe(container);
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>entry.isIntersecting?start():stop());
    },{threshold:.01});
    observer.observe(container.closest('.hero')||container);
  }else{
    start();
  }
  setSize();
  start();
}
function initStarBorderCards(root=document){
  const selectors=[
    '#page-home .hero-stats .s',
    '.pcard','.layer','.emp','.mcell','.sol','.ccard','.panel','.techcol','.acard',
    '.shift .col','.def-card','.vs-box','.oslayer','.capcard','.flywheel','.sentry',
    '.metric-row .mc','.vmcard','.cc','.case-inline','.shot-slot','.cta-box',
    '#page-solutions .solution-card'
  ].join(',');
  root.querySelectorAll(selectors).forEach(card=>{
    if(card.dataset.starBorderReady)return;
    card.dataset.starBorderReady='true';
    card.classList.add('star-border-card');
    ['top','bottom'].forEach(position=>{
      const ray=document.createElement('span');
      ray.className=`star-border-flow star-border-flow-${position}`;
      ray.setAttribute('aria-hidden','true');
      card.appendChild(ray);
    });
  });
}
function openModal(){document.getElementById('modal').classList.add('open');document.body.style.overflow='hidden';}
function closeModal(){document.getElementById('modal').classList.remove('open');document.body.style.overflow='';
  setTimeout(()=>{document.getElementById('formView').style.display='block';document.getElementById('successView').style.display='none';},200);}
function submitForm(){
  const name=document.getElementById('f_name');
  const org=document.getElementById('f_org');
  const tel=document.getElementById('f_tel');
  const scene=document.getElementById('f_scene');
  [name,org,tel].forEach(el=>el.style.borderColor='');
  if(!name.value.trim()){name.focus();name.style.borderColor='#ff6b6b';return;}
  if(!tel.value.trim()){tel.focus();tel.style.borderColor='#ff6b6b';return;}
  const subject=encodeURIComponent('官网商务咨询 - '+name.value.trim());
  const body=encodeURIComponent([
    '姓名：'+name.value.trim(),
    '单位：'+(org.value.trim()||'未填写'),
    '电话：'+tel.value.trim(),
    '需求场景：'+scene.value,
    '',
    '来源：北斗官网'
  ].join('\n'));
  window.location.href='mailto:info@szbit.cn?subject='+subject+'&body='+body;
  document.getElementById('formView').style.display='none';
  document.getElementById('successView').style.display='block';
}
addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

// init
initSpotlightCards();
initEmployeeCarousels();
initStarBorderCards();
showPage(location.hash.slice(1)||'home');

