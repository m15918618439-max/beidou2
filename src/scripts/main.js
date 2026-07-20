const nav=document.getElementById('nav');
addEventListener('scroll',()=>{nav.classList.toggle('scrolled',scrollY>30);updatePageSubnavPin();},{passive:true});

// ---- router ----
const pages=['home','agent','products','solutions','sol-traffic','sol-safety','sol-property','sol-public','sc-rail','sc-hub','sc-highway','sc-railpolice','sc-border','sc-residential','sc-commercial','sc-office','sc-park','sc-gov','sc-hospital','sc-school','tech','about'];
const sectionRoutes={'t-stack':['tech','t-stack'],'t-flow':['tech','t-flow'],'t-flywheel':['tech','t-flywheel'],'t-cert':['tech','t-cert'],'solutions-industries':['solutions','solutions-industries'],'solutions-scenarios':['solutions','solutions-scenarios'],'solutions-cases':['solutions','solutions-cases']};
const solutionPageNav={
  solutions:[
    ['行业入口','solutions-industries','scroll'],
    ['十二类场景','solutions-scenarios','scroll'],
    ['标杆案例','solutions-cases','scroll'],
    ['智慧交通','sol-traffic','nav'],
    ['公共安全','sol-safety','nav'],
    ['园区物业','sol-property','nav'],
    ['公共服务','sol-public','nav']
  ],
  'sol-traffic':[
    ['方案总览','solutions','nav'],
    ['智慧交通','sol-traffic','nav'],
    ['轨道交通','sc-rail','nav'],
    ['交通枢纽','sc-hub','nav'],
    ['高速·低空','sc-highway','nav']
  ],
  'sol-safety':[
    ['方案总览','solutions','nav'],
    ['公共安全','sol-safety','nav'],
    ['轨道公安','sc-railpolice','nav'],
    ['口岸边检','sc-border','nav']
  ],
  'sol-property':[
    ['方案总览','solutions','nav'],
    ['园区物业','sol-property','nav'],
    ['住宅物业','sc-residential','nav'],
    ['商业物业','sc-commercial','nav'],
    ['写字楼','sc-office','nav'],
    ['产业园区','sc-park','nav']
  ],
  'sol-public':[
    ['方案总览','solutions','nav'],
    ['公共服务','sol-public','nav'],
    ['机关单位','sc-gov','nav'],
    ['医院','sc-hospital','nav'],
    ['学校','sc-school','nav']
  ]
};
const sceneParentPage={
  'sc-rail':'sol-traffic',
  'sc-hub':'sol-traffic',
  'sc-highway':'sol-traffic',
  'sc-railpolice':'sol-safety',
  'sc-border':'sol-safety',
  'sc-residential':'sol-property',
  'sc-commercial':'sol-property',
  'sc-office':'sol-property',
  'sc-park':'sol-property',
  'sc-gov':'sol-public',
  'sc-hospital':'sol-public',
  'sc-school':'sol-public'
};
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
  document.body.dataset.page=id;
  document.title=pageTitles[id] || (id.startsWith('sol-')||id.startsWith('sc-') ? '行业解决方案 | 北斗智能' : id.startsWith('t-') ? '核心技术 | 北斗智能' : '北斗智能 · 空间智能体');
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+id));
  // 二级页时，父级导航保持高亮
  let navKey = (id.startsWith('sol-')||id.startsWith('sc-')) ? 'solutions' : id;
  if(id.startsWith('t-')) navKey='tech';
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.dataset.nav===navKey));
  // reset reveals in newly shown page then observe
  const cur=document.getElementById('page-'+id);
  ensurePageSubnav(cur,id);
  syncPageSubnav(cur,id,scrollTo);
  releasePageSubnavPins();
  applyRevealStagger(cur);
  cur.querySelectorAll('.reveal').forEach(el=>{el.classList.remove('in');io.observe(el)});
  cur.querySelectorAll('[data-count]').forEach(el=>{co.observe(el)});
  initStarBorderCards(cur);
  initScenarioBridge(cur);
  initSolutionCases(cur);
  if(id==='home'||id==='products')setTimeout(()=>document.querySelectorAll('.emp-grid').forEach(t=>t._empUpdate?.()),100);
  if(id==='solutions')setTimeout(()=>{
    cur.querySelectorAll('[data-scenario-bridge]').forEach(b=>b._scenarioRefresh?.());
    initSolutionsLightPillar(cur);
  },80);
  if(id==='home')setTimeout(()=>initPlasma(cur),80);
  if(id==='agent')setTimeout(()=>initAgentPlasma(cur),80);
  if(id==='products')setTimeout(()=>initProductsPixelBlast(cur),80);
  if(id==='tech')setTimeout(()=>initFloatingLines(cur),80);
  if(id==='about')setTimeout(()=>{
    initAboutTimeline(cur);
    initAboutLightfall(cur);
  },80);
  if(scrollTo){const t=document.getElementById(scrollTo);if(t){setTimeout(()=>{t.scrollIntoView({behavior:'smooth'});updatePageSubnavPin();},60);return;}}
  window.scrollTo({top:0,behavior:'instant'in window?'instant':'auto'});
  requestAnimationFrame(updatePageSubnavPin);
}
function getSolutionNavItems(id){
  return solutionPageNav[id]||solutionPageNav[sceneParentPage[id]];
}
function ensurePageSubnav(page,id){
  if(!page||[...page.children].some(el=>el.classList?.contains('subnav')))return;
  const items=getSolutionNavItems(id);
  const hero=[...page.children].find(el=>el.classList?.contains('phero'));
  if(!items||!hero)return;
  const subnav=document.createElement('div');
  subnav.className='subnav page-context-subnav solutions-subnav';
  const inner=document.createElement('div');
  inner.className='wrap subnav-in';
  items.forEach(([label,target,type])=>{
    const link=document.createElement('a');
    link.textContent=label;
    link.href='#'+target;
    if(type==='scroll')link.dataset.scroll=target;
    else link.dataset.nav=target;
    inner.appendChild(link);
  });
  subnav.appendChild(inner);
  hero.insertAdjacentElement('afterend',subnav);
}
function releasePageSubnavPins(){
  document.querySelectorAll('.page > .subnav.is-fixed').forEach(subnav=>{
    subnav.classList.remove('is-fixed');
    delete subnav.dataset.pinY;
  });
  document.querySelectorAll('.subnav-pin-spacer').forEach(spacer=>{
    spacer.hidden=true;
    spacer.style.height='0px';
  });
}
function ensureSubnavSpacer(subnav){
  let spacer=subnav.nextElementSibling;
  if(!spacer||!spacer.classList.contains('subnav-pin-spacer')){
    spacer=document.createElement('div');
    spacer.className='subnav-pin-spacer';
    spacer.hidden=true;
    subnav.insertAdjacentElement('afterend',spacer);
  }
  return spacer;
}
function getSubnavTopOffset(subnav){
  const top=parseFloat(getComputedStyle(subnav).top);
  const navBottom=Math.ceil(nav?.getBoundingClientRect().bottom||0);
  return Math.max(Number.isFinite(top)?top:86,navBottom);
}
function updatePageSubnavPin(){
  const page=document.querySelector('.page.active');
  if(!page)return;
  document.querySelectorAll('.page:not(.active) > .subnav.is-fixed').forEach(subnav=>subnav.classList.remove('is-fixed'));
  const subnav=[...page.children].find(el=>el.classList?.contains('subnav'));
  if(!subnav)return;
  const spacer=ensureSubnavSpacer(subnav);
  const topOffset=getSubnavTopOffset(subnav);
  subnav.style.setProperty('--subnav-pin-top',`${topOffset}px`);
  const height=subnav.offsetHeight;
  if(!subnav.classList.contains('is-fixed')){
    subnav.dataset.pinY=String(subnav.getBoundingClientRect().top+scrollY);
  }
  const pinY=Number(subnav.dataset.pinY);
  const shouldFix=Number.isFinite(pinY)&&scrollY+topOffset>=pinY;
  subnav.classList.toggle('is-fixed',shouldFix);
  spacer.hidden=!shouldFix;
  spacer.style.height=shouldFix?`${height}px`:'0px';
}
function syncPageSubnav(page,id,scrollTo){
  if(!page)return;
  const subnav=[...page.children].find(el=>el.classList?.contains('subnav'));
  const links=subnav?[...subnav.querySelectorAll('a')]:[];
  if(!links.length)return;
  let matched=false;
  links.forEach(link=>{
    const active=Boolean((link.dataset.nav===id)||(scrollTo&&link.dataset.scroll===scrollTo));
    link.classList.toggle('active',active);
    if(active)matched=true;
  });
  if(!matched){
    const firstScroll=links.find(link=>link.dataset.scroll);
    if(firstScroll)firstScroll.classList.add('active');
  }
}
function nav2(id){location.hash=id;}
document.querySelectorAll('a[data-nav]').forEach(a=>{if(!a.hasAttribute('href'))a.setAttribute('href','#'+a.dataset.nav);});
document.querySelectorAll('a[data-scroll]').forEach(a=>{if(!a.hasAttribute('href'))a.setAttribute('href','#'+a.dataset.scroll);});
document.addEventListener('click',e=>{
  const n=e.target.closest('[data-nav]');
  if(n){e.preventDefault();nav2(n.dataset.nav);return;}
  const s=e.target.closest('[data-scroll]');
  if(s){e.preventDefault();const page=s.closest('.page');syncPageSubnav(page,document.body.dataset.page,s.dataset.scroll);const t=document.getElementById(s.dataset.scroll);if(t)t.scrollIntoView({behavior:'smooth'});}
});
addEventListener('hashchange',()=>showPage(location.hash.slice(1)));
addEventListener('resize',()=>{releasePageSubnavPins();requestAnimationFrame(updatePageSubnavPin);},{passive:true});

// ---- reveal ----
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
// ---- counters ----
function animateCount(el){
  const target=+el.dataset.count;const suffix=el.dataset.suffix||'';const inner=el.querySelector('.u');
  const dur=1400;const t0=performance.now();
  if(inner&&(!el.firstChild||el.firstChild.nodeType!==3)){el.insertBefore(document.createTextNode('0'),inner);}
  function step(now){const p=Math.max(0,Math.min((now-t0)/dur,1));const eased=1-Math.pow(1-p,3);const val=Math.round(target*eased);
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
function initAboutTimeline(root=document){
  const timeline=root.querySelector('[data-about-timeline]');
  const prev=root.querySelector('[data-about-history-prev]');
  const next=root.querySelector('[data-about-history-next]');
  if(!timeline||!prev||!next||timeline.dataset.timelineReady)return;
  timeline.dataset.timelineReady='true';
  const move=dir=>timeline.scrollBy({left:dir*Math.max(280,timeline.clientWidth*.72),behavior:'smooth'});
  prev.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  timeline.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}
    if(e.key==='ArrowRight'){e.preventDefault();move(1);}
    if(e.key==='Home'){e.preventDefault();timeline.scrollTo({left:0,behavior:'smooth'});}
    if(e.key==='End'){e.preventDefault();timeline.scrollTo({left:timeline.scrollWidth,behavior:'smooth'});}
  });
}
function initSolutionCases(root=document){
  root.querySelectorAll('[data-solution-cases]').forEach(block=>{
    if(block.dataset.casesReady)return;
    const tabs=[...block.querySelectorAll('[data-case-tab]')];
    const panels=[...block.querySelectorAll('[data-case-panel]')];
    if(!tabs.length||!panels.length)return;
    block.dataset.casesReady='true';
    const activate=(id,focusTab=false)=>{
      tabs.forEach(tab=>{
        const active=tab.dataset.caseTab===id;
        tab.classList.toggle('active',active);
        tab.setAttribute('aria-selected',active?'true':'false');
        tab.tabIndex=active?0:-1;
        if(active&&focusTab)tab.focus({preventScroll:true});
      });
      panels.forEach(panel=>{
        const active=panel.dataset.casePanel===id;
        panel.classList.toggle('active',active);
        panel.hidden=!active;
      });
    };
    tabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>activate(tab.dataset.caseTab));
      tab.addEventListener('keydown',e=>{
        const nextKey=e.key==='ArrowDown'||e.key==='ArrowRight';
        const prevKey=e.key==='ArrowUp'||e.key==='ArrowLeft';
        if(!nextKey&&!prevKey&&e.key!=='Home'&&e.key!=='End')return;
        e.preventDefault();
        let next=index;
        if(nextKey)next=(index+1)%tabs.length;
        if(prevKey)next=(index-1+tabs.length)%tabs.length;
        if(e.key==='Home')next=0;
        if(e.key==='End')next=tabs.length-1;
        activate(tabs[next].dataset.caseTab,true);
      });
    });
    const initial=tabs.find(tab=>tab.classList.contains('active'))||tabs[0];
    activate(initial.dataset.caseTab);
  });
}
function initScenarioBridge(root=document){
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.querySelectorAll('[data-scenario-bridge]').forEach(bridge=>{
    if(bridge.dataset.scenarioReady){bridge._scenarioRefresh?.();return;}
    const viewport=bridge.querySelector('.scenario-viewport');
    const track=bridge.querySelector('.scenario-track');
    const button=bridge.querySelector('.scenario-expand');
    const cards=[...bridge.querySelectorAll('.scenario-track .sentry')];
    if(!viewport||!track||!button||!cards.length)return;
    bridge.dataset.scenarioReady='true';
    let active=Math.min(2,cards.length-1);
    let dragging=false,startX=0,lastX=0,suppressClick=false,wheelLock=0,resizeFrame=0;
    const wrapIndex=i=>(i+cards.length)%cards.length;
    const signedOffset=i=>{
      let offset=i-active;
      const half=Math.floor(cards.length/2);
      if(offset>half)offset-=cards.length;
      if(offset<-half)offset+=cards.length;
      return offset;
    };
    const metrics=()=>{
      const w=viewport.clientWidth||innerWidth;
      const mobile=w<640;
      return {
        step:mobile?Math.max(124,Math.min(w*.38,166)):Math.max(160,Math.min(w*.17,214)),
        drops:mobile?[0,24,52,68]:[0,30,66,86]
      };
    };
    const setCardAccess=(card,visible)=>{
      card.tabIndex=visible?0:-1;
      card.setAttribute('aria-hidden',visible?'false':'true');
    };
    const render=()=>{
      const expanded=bridge.classList.contains('is-expanded');
      const {step,drops}=metrics();
      button.textContent=expanded?'收起桥型轮播':'展开全部场景';
      button.setAttribute('aria-expanded',expanded?'true':'false');
      cards.forEach((card,i)=>{
        card.setAttribute('role','button');
        const offset=signedOffset(i);
        const depth=Math.min(Math.abs(offset),3);
        const visible=expanded||Math.abs(offset)<=2;
        card.classList.toggle('is-active',!expanded&&offset===0);
        card.dataset.bridgeHidden=visible?'false':'true';
        setCardAccess(card,visible);
        if(expanded){
          ['--bridge-x','--bridge-y','--bridge-scale','--bridge-rotate','--bridge-opacity','--bridge-saturate','--bridge-blur','--bridge-z'].forEach(name=>card.style.removeProperty(name));
          return;
        }
        card.style.setProperty('--bridge-x',`${Math.round(offset*step)}px`);
        card.style.setProperty('--bridge-y',`${drops[depth]}px`);
        card.style.setProperty('--bridge-scale',(1-depth*.085).toFixed(3));
        card.style.setProperty('--bridge-rotate',`${(offset*-2.2).toFixed(2)}deg`);
        card.style.setProperty('--bridge-opacity',visible?String(Math.max(.2,1-depth*.2)):'0');
        card.style.setProperty('--bridge-saturate',(1-depth*.08).toFixed(2));
        card.style.setProperty('--bridge-blur',depth>1?'.18px':'0');
        card.style.setProperty('--bridge-z',String(20-depth));
      });
    };
    const setActive=next=>{
      active=wrapIndex(next);
      render();
    };
    const setExpanded=expanded=>{
      bridge.classList.toggle('is-expanded',expanded);
      bridge.classList.remove('is-dragging');
      dragging=false;
      render();
    };
    const finishDrag=()=>{
      if(!dragging)return;
      const dx=lastX-startX;
      dragging=false;
      bridge.classList.remove('is-dragging');
      if(Math.abs(dx)>46)setActive(active+(dx<0?1:-1));
      else render();
      if(Math.abs(dx)>8){
        suppressClick=true;
        setTimeout(()=>{suppressClick=false;},0);
      }
    };
    cards.forEach(card=>{
      card.addEventListener('keydown',e=>{
        if((e.key==='Enter'||e.key===' ')&&card.dataset.nav&&card.dataset.bridgeHidden!=='true'){
          e.preventDefault();
          nav2(card.dataset.nav);
        }
      });
    });
    button.addEventListener('click',e=>{
      e.preventDefault();
      setExpanded(!bridge.classList.contains('is-expanded'));
    });
    bridge.addEventListener('click',e=>{
      if(!suppressClick)return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick=false;
    },true);
    viewport.addEventListener('pointerdown',e=>{
      if(bridge.classList.contains('is-expanded'))return;
      dragging=true;
      startX=lastX=e.clientX;
      bridge.classList.add('is-dragging');
      viewport.setPointerCapture?.(e.pointerId);
    });
    viewport.addEventListener('pointermove',e=>{
      if(dragging)lastX=e.clientX;
    });
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>viewport.addEventListener(type,finishDrag));
    viewport.addEventListener('wheel',e=>{
      if(bridge.classList.contains('is-expanded'))return;
      const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
      if(Math.abs(delta)<8)return;
      e.preventDefault();
      if(wheelLock)return;
      setActive(active+(delta>0?1:-1));
      wheelLock=setTimeout(()=>{wheelLock=0;},reduceMotion?140:360);
    },{passive:false});
    viewport.addEventListener('keydown',e=>{
      if(bridge.classList.contains('is-expanded'))return;
      if(e.key==='ArrowRight'){e.preventDefault();setActive(active+1);}
      if(e.key==='ArrowLeft'){e.preventDefault();setActive(active-1);}
      if(e.key==='Home'){e.preventDefault();setActive(0);}
    });
    bridge._scenarioRefresh=()=>{
      cancelAnimationFrame(resizeFrame);
      resizeFrame=requestAnimationFrame(render);
    };
    addEventListener('resize',bridge._scenarioRefresh,{passive:true});
    render();
  });
}
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
function initSolutionsLightPillar(root=document){
  const container=root.querySelector('[data-solutions-lightpillar]');
  if(!container)return;
  if(container.dataset.lightpillarReady){
    container._lightpillarRefresh?.();
    container._lightpillarSync?.();
    return;
  }
  container.dataset.lightpillarReady='true';

  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const canvas=document.createElement('canvas');
  canvas.className='solutions-lightpillar-canvas';
  container.appendChild(canvas);

  const gl=canvas.getContext('webgl',{
    alpha:true,
    premultipliedAlpha:false,
    antialias:false,
    powerPreference:'high-performance'
  })||canvas.getContext('experimental-webgl');
  if(!gl){
    container.removeChild(canvas);
    container.classList.add('solutions-lightpillar-fallback');
    return;
  }

  const isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const lowPower=isMobile||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);
  const quality=isMobile?'low':lowPower?'medium':'high';
  const settings={
    low:{iterations:24,waveIterations:1,pixelRatio:.55,stepMultiplier:1.5},
    medium:{iterations:40,waveIterations:2,pixelRatio:.7,stepMultiplier:1.2},
    high:{iterations:80,waveIterations:4,pixelRatio:Math.min(devicePixelRatio||1,2),stepMultiplier:1}
  }[quality];

  const vertex=`
    attribute vec2 position;
    varying vec2 vUv;
    void main(){
      vUv=position*.5+.5;
      gl_Position=vec4(position,0.0,1.0);
    }
  `;
  const fragment=`
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec3 uTopColor;
    uniform vec3 uBottomColor;
    uniform float uIntensity;
    uniform bool uInteractive;
    uniform float uGlowAmount;
    uniform float uPillarWidth;
    uniform float uPillarHeight;
    uniform float uNoiseIntensity;
    uniform float uRotCos;
    uniform float uRotSin;
    uniform float uPillarRotCos;
    uniform float uPillarRotSin;
    uniform float uWaveSin;
    uniform float uWaveCos;
    varying vec2 vUv;

    const float STEP_MULT=${settings.stepMultiplier.toFixed(1)};
    const int MAX_ITER=${settings.iterations};
    const int WAVE_ITER=${settings.waveIterations};

    vec3 fastTanh(vec3 x){
      vec3 y=clamp(x,vec3(-20.0),vec3(20.0));
      vec3 e=exp(2.0*y);
      return (e-vec3(1.0))/(e+vec3(1.0));
    }

    void main(){
      vec2 uv=(vUv*2.0-1.0)*vec2(uResolution.x/uResolution.y,1.0);
      uv=vec2(uPillarRotCos*uv.x-uPillarRotSin*uv.y,uPillarRotSin*uv.x+uPillarRotCos*uv.y);

      vec3 ro=vec3(0.0,0.0,-10.0);
      vec3 rd=normalize(vec3(uv,1.0));

      float rotC=uRotCos;
      float rotS=uRotSin;
      if(uInteractive&&(uMouse.x!=0.0||uMouse.y!=0.0)){
        float a=uMouse.x*6.283185;
        rotC=cos(a);
        rotS=sin(a);
      }

      vec3 col=vec3(0.0);
      float t=0.1;
      for(int i=0;i<MAX_ITER;i++){
        vec3 p=ro+rd*t;
        p.xz=vec2(rotC*p.x-rotS*p.z,rotS*p.x+rotC*p.z);

        vec3 q=p;
        q.y=p.y*uPillarHeight+uTime;
        float freq=1.0;
        float amp=1.0;
        for(int j=0;j<WAVE_ITER;j++){
          q.xz=vec2(uWaveCos*q.x-uWaveSin*q.z,uWaveSin*q.x+uWaveCos*q.z);
          q+=cos(q.zxy*freq-uTime*float(j)*2.0)*amp;
          freq*=2.0;
          amp*=0.5;
        }

        float d=length(cos(q.xz))-0.2;
        float bound=length(p.xz)-uPillarWidth;
        float k=4.0;
        float h=max(k-abs(d-bound),0.0);
        d=max(d,bound)+h*h*0.0625/k;
        d=abs(d)*0.15+0.01;

        float grad=clamp((15.0-p.y)/30.0,0.0,1.0);
        col+=mix(uBottomColor,uTopColor,grad)/d;
        t+=d*STEP_MULT;
        if(t>50.0)break;
      }

      float widthNorm=max(uPillarWidth/3.0,0.15);
      col=fastTanh(col*uGlowAmount/widthNorm);
      float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
      col-=grain/15.0*uNoiseIntensity;

      vec3 finalColor=max(col,0.0)*uIntensity;
      finalColor=pow(finalColor,vec3(1.22));
      finalColor*=vec3(.5,.74,1.18);
      finalColor=min(finalColor,vec3(.56,.82,1.0));
      gl_FragColor=vec4(finalColor,1.0);
    }
  `;

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
    container.classList.add('solutions-lightpillar-fallback');
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
    container.classList.add('solutions-lightpillar-fallback');
    return;
  }

  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  gl.useProgram(program);
  const positionLoc=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,0,0);

  const loc={};
  [
    'uTime','uResolution','uMouse','uTopColor','uBottomColor','uIntensity','uInteractive',
    'uGlowAmount','uPillarWidth','uPillarHeight','uNoiseIntensity','uRotCos','uRotSin',
    'uPillarRotCos','uPillarRotSin','uWaveSin','uWaveCos'
  ].forEach(name=>{loc[name]=gl.getUniformLocation(program,name);});

  const hexToRgb=hex=>{
    const value=hex.replace('#','');
    return [0,2,4].map(i=>parseInt(value.slice(i,i+2),16)/255);
  };
  const topColor=hexToRgb('5227ff');
  const bottomColor=hexToRgb('9fe3ff');
  const pillarRotRad=0;
  gl.uniform3f(loc.uTopColor,topColor[0],topColor[1],topColor[2]);
  gl.uniform3f(loc.uBottomColor,bottomColor[0],bottomColor[1],bottomColor[2]);
  gl.uniform1f(loc.uIntensity,.9);
  gl.uniform1i(loc.uInteractive,0);
  gl.uniform1f(loc.uGlowAmount,.0046);
  gl.uniform1f(loc.uPillarWidth,isMobile?2.7:2.5);
  gl.uniform1f(loc.uPillarHeight,.4);
  gl.uniform1f(loc.uNoiseIntensity,reduceMotion?.12:.5);
  gl.uniform1f(loc.uPillarRotCos,Math.cos(pillarRotRad));
  gl.uniform1f(loc.uPillarRotSin,Math.sin(pillarRotRad));
  gl.uniform1f(loc.uWaveSin,Math.sin(.4));
  gl.uniform1f(loc.uWaveCos,Math.cos(.4));
  gl.uniform2f(loc.uMouse,0,0);
  gl.clearColor(0,0,0,0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  let raf=0;
  let running=false;
  let contextLost=false;
  let inView=true;
  let timeValue=2.65;
  let lastFrame=performance.now();
  const frameTime=quality==='low'?1000/30:1000/60;
  const setSize=()=>{
    const rect=container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const dpr=settings.pixelRatio;
    const width=Math.max(1,Math.floor(rect.width*dpr));
    const height=Math.max(1,Math.floor(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
      gl.uniform2f(loc.uResolution,width,height);
    }
  };
  const render=now=>{
    if(!running||contextLost)return;
    raf=requestAnimationFrame(render);
    if(container.offsetParent===null){stop();return;}
    const delta=now-lastFrame;
    if(delta<frameTime)return;
    lastFrame=now-(delta%frameTime);
    setSize();
    timeValue+=0.016*(reduceMotion?0.02:.06);
    gl.uniform1f(loc.uTime,timeValue);
    gl.uniform1f(loc.uRotCos,Math.cos(timeValue*.3));
    gl.uniform1f(loc.uRotSin,Math.sin(timeValue*.3));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  };
  function start(){
    if(running||contextLost||document.hidden)return;
    running=true;
    lastFrame=performance.now();
    raf=requestAnimationFrame(render);
  }
  function stop(){
    running=false;
    cancelAnimationFrame(raf);
  }
  const syncRunning=()=>{
    if(inView&&!document.hidden)start();
    else stop();
  };

  addEventListener('resize',setSize,{passive:true});
  document.addEventListener('visibilitychange',syncRunning,{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();
    contextLost=true;
    stop();
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    contextLost=false;
    setSize();
    syncRunning();
  });
  if('ResizeObserver'in window)new ResizeObserver(setSize).observe(container);
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      inView=entries[0]?.isIntersecting??false;
      syncRunning();
    },{threshold:.01});
    observer.observe(container.closest('.phero')||container);
  }

  container._lightpillarRefresh=setSize;
  container._lightpillarSync=syncRunning;
  setSize();
  inView=container.offsetParent!==null;
  syncRunning();
}

function initPlasma(root=document){
  const container=root.querySelector('[data-plasma]');
  if(!container||container.dataset.plasmaReady)return;
  container.dataset.plasmaReady='true';

  const canvas=document.createElement('canvas');
  canvas.className='prism-canvas';
  container.appendChild(canvas);
  const gl=canvas.getContext('webgl',{
    alpha:true,
    premultipliedAlpha:false,
    antialias:false,
    powerPreference:'high-performance'
  })||canvas.getContext('experimental-webgl');
  if(!gl){
    container.removeChild(canvas);
    container.classList.add('plasma-fallback-only');
    return;
  }

  const prism={
    height:4.42,
    baseWidth:6.85,
    animationType:'rotate',
    glow:.93,
    noise:.025,
    transparent:true,
    scale:3.72,
    hueShift:0,
    saturation:2.08,
    colorFrequency:.86,
    bloom:.9,
    timeScale:.6,
    offsetX:0,
    offsetY:-18
  };
  const H=Math.max(.001,prism.height);
  const baseHalf=Math.max(.001,prism.baseWidth*.5);
  const GLOW=Math.max(0,prism.glow);
  const NOISE=Math.max(0,prism.noise);
  const SAT=Math.max(0,prism.saturation ?? (prism.transparent?1.5:1));
  const SCALE=Math.max(.001,prism.scale);
  const HUE=prism.hueShift||0;
  const CFREQ=Math.max(0,prism.colorFrequency||1);
  const BLOOM=Math.max(0,prism.bloom||1);
  const TS=Math.max(0,prism.timeScale||1);

  const vertex=`
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;
  const fragment=`
    precision highp float;

    uniform vec2  iResolution;
    uniform float iTime;

    uniform float uHeight;
    uniform float uBaseHalf;
    uniform mat3  uRot;
    uniform int   uUseBaseWobble;
    uniform float uGlow;
    uniform vec2  uOffsetPx;
    uniform float uNoise;
    uniform float uSaturation;
    uniform float uScale;
    uniform float uHueShift;
    uniform float uColorFreq;
    uniform float uBloom;
    uniform float uCenterShift;
    uniform float uInvBaseHalf;
    uniform float uInvHeight;
    uniform float uMinAxis;
    uniform float uPxScale;
    uniform float uTimeScale;

vec4 tanh4(vec4 x){
  vec4 e2x = exp(2.0*x);
  return (e2x - 1.0) / (e2x + 1.0);
}

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
}

float sdOctaAnisoInv(vec3 p){
  vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
  float m = q.x + q.y + q.z - 1.0;
  return m * uMinAxis * 0.5773502691896258;
}

float sdPyramidUpInv(vec3 p){
  float oct = sdOctaAnisoInv(p);
  float halfSpace = -p.y;
  return max(oct, halfSpace);
}

mat3 hueRotation(float a){
  float c = cos(a), s = sin(a);
  mat3 W = mat3(
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114
  );
  mat3 U = mat3(
     0.701, -0.587, -0.114,
    -0.299,  0.413, -0.114,
    -0.300, -0.588,  0.886
  );
  mat3 V = mat3(
     0.168, -0.331,  0.500,
     0.328,  0.035, -0.500,
    -0.497,  0.296,  0.201
  );
  return W + U * c + V * s;
}

void main(){
  vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

  float z = 5.0;
  float d = 0.0;
  vec3 p;
  vec4 o = vec4(0.0);

  mat2 wob = mat2(1.0);
  if (uUseBaseWobble == 1) {
    float phase = iTime * uTimeScale;
    float triHold = pow(max(cos(phase), 0.0), 5.0);
    float t = phase - 0.28 * sin(phase) * triHold;
    float c0 = cos(t + 0.0);
    float c1 = cos(t + 33.0);
    float c2 = cos(t + 11.0);
    float triMix = triHold * 0.26;
    wob = mat2(
      mix(c0, 1.0, triMix),
      mix(c1, 0.0, triMix),
      mix(c2, 0.0, triMix),
      mix(c0, 1.0, triMix)
    );
  }

  const int STEPS = 100;
  for (int i = 0; i < STEPS; i++) {
    p = vec3(f, z);
    p.xz = p.xz * wob;
    p = uRot * p;
    vec3 q = p;
    q.y += uCenterShift;
    d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
    z -= d;
    o += (sin((p.y + z) * uColorFreq + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
  }

  o = tanh4(o * o * (uGlow * uBloom) / 1e5);

  vec3 col = o.rgb;
  float n = rand(gl_FragCoord.xy + vec2(iTime));
  col += (n - 0.5) * uNoise;
  col = clamp(col, 0.0, 1.0);

  float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);
  col = clamp(col * vec3(0.62, 0.98, 1.45) + vec3(0.0, 0.016, 0.07) * smoothstep(0.08, 0.72, L), 0.0, 1.0);
  col = clamp(mix(col, vec3(0.04, 0.58, 1.0) * clamp(L * 1.08, 0.0, 1.0), 0.24), 0.0, 1.0);

  if(abs(uHueShift) > 0.0001){
    col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
  }

  gl_FragColor = vec4(col, clamp(o.a * 1.18, 0.0, 1.0));
}`;

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
    -1,-1,
     3,-1,
    -1, 3
  ]);
  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
  gl.useProgram(program);
  const positionLoc=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,0,0);

  const uniforms={};
  [
    'iResolution','iTime','uHeight','uBaseHalf','uUseBaseWobble','uRot','uGlow','uOffsetPx',
    'uNoise','uSaturation','uScale','uHueShift','uColorFreq','uBloom','uCenterShift','uInvBaseHalf',
    'uInvHeight','uMinAxis','uPxScale','uTimeScale'
  ].forEach(name=>{
    uniforms[name]=gl.getUniformLocation(program,name);
  });

  const uniform1f=(name,value)=>uniforms[name]&&gl.uniform1f(uniforms[name],value);
  uniform1f('uHeight',H);
  uniform1f('uBaseHalf',baseHalf);
  gl.uniform1i(uniforms.uUseBaseWobble,1);
  uniform1f('uGlow',GLOW);
  uniform1f('uNoise',NOISE);
  uniform1f('uSaturation',SAT);
  uniform1f('uScale',SCALE);
  uniform1f('uHueShift',HUE);
  uniform1f('uColorFreq',CFREQ);
  uniform1f('uBloom',BLOOM);
  uniform1f('uCenterShift',H*.25);
  uniform1f('uInvBaseHalf',1/baseHalf);
  uniform1f('uInvHeight',1/H);
  uniform1f('uMinAxis',Math.min(baseHalf,H));
  uniform1f('uTimeScale',TS);
  gl.clearColor(0,0,0,0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.disable(gl.BLEND);

  let raf=0;
  let running=false;
  let contextLost=false;
  let dpr=1;
  const rotBuf=new Float32Array([1,0,0,0,1,0,0,0,1]);
  const t0=performance.now();
  const setSize=()=>{
    const rect=canvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    dpr=Math.min(devicePixelRatio||1,2);
    const width=Math.max(1,Math.floor(rect.width*dpr));
    const height=Math.max(1,Math.floor(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
      gl.uniform2f(uniforms.iResolution,width,height);
      gl.uniform2f(uniforms.uOffsetPx,prism.offsetX*dpr,prism.offsetY*dpr);
      uniform1f('uPxScale',1/((height||1)*.1*SCALE));
    }
  };
  const render=t=>{
    if(!running||contextLost)return;
    raf=requestAnimationFrame(render);
    if(container.offsetParent===null)return;
    setSize();
    const time=(t-t0)*.001;
    rotBuf[0]=1;rotBuf[1]=0;rotBuf[2]=0;
    rotBuf[3]=0;rotBuf[4]=1;rotBuf[5]=0;
    rotBuf[6]=0;rotBuf[7]=0;rotBuf[8]=1;
    gl.uniformMatrix3fv(uniforms.uRot,false,rotBuf);
    uniform1f('iTime',time);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,3);
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
function initAgentPlasma(root=document){
  const container=root.querySelector('[data-agent-plasma]');
  if(!container)return;
  if(container.dataset.agentPlasmaReady){
    container._agentPlasmaRefresh?.();
    container._agentPlasmaSync?.();
    return;
  }
  container.dataset.agentPlasmaReady='true';

  const canvas=document.createElement('canvas');
  canvas.className='agent-plasma-canvas';
  container.appendChild(canvas);

  const gl=canvas.getContext('webgl2',{
    alpha:true,
    premultipliedAlpha:false,
    antialias:false,
    powerPreference:'high-performance'
  });
  if(!gl){
    container.removeChild(canvas);
    container.classList.add('agent-plasma-fallback');
    return;
  }

  const hexToRgb=hex=>{
    const result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(!result)return [1,.5,.2];
    return [
      parseInt(result[1],16)/255,
      parseInt(result[2],16)/255,
      parseInt(result[3],16)/255
    ];
  };
  const config={
    color:'#3f8cff',
    speed:.82,
    direction:'forward',
    scale:1.04,
    opacity:1.18,
    mouseInteractive:true
  };
  const customColor=hexToRgb(config.color);

  const vertex=`#version 300 es
precision highp float;
in vec2 position;
void main(){
  gl_Position=vec4(position,0.0,1.0);
}`;
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
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C){
  vec2 center=iResolution.xy*.5;
  C=(C-center)/uScale+center;

  vec2 mouseOffset=(uMouse-center)*.0002;
  C+=mouseOffset*length(C-center)*step(.5,uMouseInteractive);

  float i=0.0;
  float d=0.0;
  float z=0.0;
  float T=iTime*uSpeed*uDirection;
  vec3 O=vec3(0.0);
  vec3 p=vec3(0.0);
  vec3 S=vec3(0.0);

  for(vec2 r=iResolution.xy,Q; ++i<48.; O+=o.w/max(d,.0008)*o.xyz){
    p=z*normalize(vec3(C-.5*r,r.y));
    p.z-=4.;
    S=p;
    d=p.y-T;

    p.x+=.4*(1.+p.y)*sin(d+p.x*.1)*cos(.34*d+p.x*.05);
    Q=p.xz*=mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+=d=abs(sqrt(length(Q*Q))-.25*(5.+S.y))/3.+8e-4;
    o=1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz=tanh(O/4160.0);
}

bool finite1(float x){return !(isnan(x)||isinf(x));}
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r)?c.r:0.0,
    finite1(c.g)?c.g:0.0,
    finite1(c.b)?c.b:0.0
  );
}

void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  vec3 rgb=sanitize(o.rgb);

  float intensity=(rgb.r+rgb.g+rgb.b)/3.0;
  vec3 customColor=(.12+intensity*1.78)*uCustomColor;
  vec3 finalColor=mix(rgb,customColor+rgb*.22,step(.5,uUseCustomColor));

  float alpha=clamp((length(rgb)*1.55+intensity*.26)*uOpacity,0.0,1.0);
  fragColor=vec4(finalColor,alpha);
}`;

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
    container.classList.add('agent-plasma-fallback');
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
    container.classList.add('agent-plasma-fallback');
    return;
  }

  const vertices=new Float32Array([-1,-1,3,-1,-1,3]);
  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
  gl.useProgram(program);
  const positionLoc=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,0,0);

  const uniforms={};
  ['iResolution','iTime','uCustomColor','uUseCustomColor','uSpeed','uDirection','uScale','uOpacity','uMouse','uMouseInteractive'].forEach(name=>{
    uniforms[name]=gl.getUniformLocation(program,name);
  });
  gl.uniform3f(uniforms.uCustomColor,customColor[0],customColor[1],customColor[2]);
  gl.uniform1f(uniforms.uUseCustomColor,1);
  gl.uniform1f(uniforms.uSpeed,config.speed*.48);
  gl.uniform1f(uniforms.uDirection,config.direction==='reverse'?-1:1);
  gl.uniform1f(uniforms.uScale,config.scale);
  gl.uniform1f(uniforms.uOpacity,config.opacity);
  gl.uniform1f(uniforms.uMouseInteractive,config.mouseInteractive?1:0);
  gl.clearColor(0,0,0,0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);

  let raf=0;
  let running=false;
  let contextLost=false;
  let inView=true;
  let lastFrame=0;
  let needsResize=true;
  const targetFrameTime=1000/30;
  const t0=performance.now();
  const hitArea=container.closest('.agent-hero')||container;
  const setSize=()=>{
    const rect=container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const dpr=Math.min(devicePixelRatio||1,1);
    const width=Math.max(1,Math.floor(rect.width*dpr));
    const height=Math.max(1,Math.floor(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
      gl.uniform2f(uniforms.iResolution,width,height);
      gl.uniform2f(uniforms.uMouse,width*.5,height*.5);
    }
  };
  const requestSizeUpdate=()=>{
    needsResize=true;
    if(!running)setSize();
  };
  const handlePointerMove=event=>{
    if(!config.mouseInteractive)return;
    const rect=container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const dpr=canvas.width/rect.width||1;
    gl.uniform2f(
      uniforms.uMouse,
      (event.clientX-rect.left)*dpr,
      (rect.height-(event.clientY-rect.top))*dpr
    );
  };
  const render=now=>{
    if(!running||contextLost)return;
    raf=requestAnimationFrame(render);
    if(container.offsetParent===null){stop();return;}
    const delta=lastFrame?now-lastFrame:targetFrameTime;
    if(delta<targetFrameTime)return;
    lastFrame=now-(delta%targetFrameTime);
    if(needsResize){
      setSize();
      needsResize=false;
    }
    gl.uniform1f(uniforms.iTime,(now-t0)*.001);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,3);
  };
  const start=()=>{
    if(running||contextLost||!inView)return;
    running=true;
    lastFrame=0;
    needsResize=true;
    setSize();
    needsResize=false;
    raf=requestAnimationFrame(render);
  };
  const stop=()=>{
    running=false;
    cancelAnimationFrame(raf);
  };
  const syncRunning=()=>{
    if(document.hidden||!inView||container.offsetParent===null)stop();
    else start();
  };

  hitArea.addEventListener('pointermove',handlePointerMove,{passive:true});
  addEventListener('resize',requestSizeUpdate,{passive:true});
  document.addEventListener('visibilitychange',syncRunning,{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();
    contextLost=true;
    stop();
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    contextLost=false;
    setSize();
    syncRunning();
  });
  if('ResizeObserver'in window)new ResizeObserver(requestSizeUpdate).observe(container);
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      inView=entries[0]?.isIntersecting??false;
      syncRunning();
    },{threshold:.01});
    observer.observe(hitArea);
  }

  container._agentPlasmaRefresh=setSize;
  container._agentPlasmaSync=()=>{
    inView=container.offsetParent!==null;
    syncRunning();
  };
  setSize();
  inView=container.offsetParent!==null;
  syncRunning();
}
function initFloatingLines(root=document){
  const container=root.querySelector('[data-floating-lines]');
  if(!container)return;
  if(container.dataset.floatingLinesReady){
    container._floatingLinesRefresh?.();
    container._floatingLinesSync?.();
    return;
  }
  container.dataset.floatingLinesReady='true';

  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const canvas=document.createElement('canvas');
  canvas.className='floating-lines-canvas';
  container.appendChild(canvas);

  const gl=canvas.getContext('webgl2',{
    alpha:false,
    antialias:true,
    powerPreference:'high-performance'
  });
  if(!gl){
    container.removeChild(canvas);
    container.classList.add('floating-lines-fallback');
    return;
  }

  const vertex=`#version 300 es
    precision highp float;
    in vec2 position;
    void main(){
      gl_Position=vec4(position,0.0,1.0);
    }
  `;
  const fragment=`#version 300 es
    precision highp float;

    uniform float iTime;
    uniform vec3  iResolution;
    uniform float animationSpeed;

    uniform bool enableTop;
    uniform bool enableMiddle;
    uniform bool enableBottom;

    uniform int topLineCount;
    uniform int middleLineCount;
    uniform int bottomLineCount;

    uniform float topLineDistance;
    uniform float middleLineDistance;
    uniform float bottomLineDistance;

    uniform vec3 topWavePosition;
    uniform vec3 middleWavePosition;
    uniform vec3 bottomWavePosition;

    uniform vec2 iMouse;
    uniform bool interactive;
    uniform float bendRadius;
    uniform float bendStrength;
    uniform float bendInfluence;

    uniform bool parallax;
    uniform float parallaxStrength;
    uniform vec2 parallaxOffset;

    uniform vec3 lineGradient[8];
    uniform int lineGradientCount;

    out vec4 outColor;

    const vec3 BLACK=vec3(0.0);
    const vec3 PINK=vec3(233.0,71.0,245.0)/255.0;
    const vec3 BLUE=vec3(47.0,75.0,162.0)/255.0;

    mat2 rotate(float r){
      return mat2(cos(r),sin(r),-sin(r),cos(r));
    }

    vec3 background_color(vec2 uv){
      vec3 col=vec3(0.0);
      float y=sin(uv.x-0.2)*0.3-0.1;
      float m=uv.y-y;
      col+=mix(BLUE,BLACK,smoothstep(0.0,1.0,abs(m)));
      col+=mix(PINK,BLACK,smoothstep(0.0,1.0,abs(m-0.8)));
      return col*0.5;
    }

    vec3 getLineColor(float t,vec3 baseColor){
      if(lineGradientCount<=0){
        return baseColor;
      }

      vec3 gradientColor;
      if(lineGradientCount==1){
        gradientColor=lineGradient[0];
      }else{
        float clampedT=clamp(t,0.0,0.9999);
        float scaled=clampedT*float(lineGradientCount-1);
        int idx=int(floor(scaled));
        float f=fract(scaled);
        int idx2=min(idx+1,lineGradientCount-1);
        vec3 c1=lineGradient[idx];
        vec3 c2=lineGradient[idx2];
        gradientColor=mix(c1,c2,f);
      }
      return gradientColor*0.56;
    }

    float wave(vec2 uv,float offset,vec2 screenUv,vec2 mouseUv,bool shouldBend){
      float time=iTime*animationSpeed;
      float x_offset=offset;
      float x_movement=time*0.1;
      float amp=sin(offset+time*0.22)*0.26;
      float y=sin(uv.x+x_offset+x_movement)*amp;

      if(shouldBend){
        vec2 d=screenUv-mouseUv;
        float influence=exp(-dot(d,d)*bendRadius);
        float bendOffset=(mouseUv.y-screenUv.y)*influence*bendStrength*bendInfluence;
        y+=bendOffset;
      }

      float m=uv.y-y;
      float core=0.0115/max(abs(m)+0.013,1e-3);
      float halo=0.0022/max(abs(m)+0.044,1e-3);
      return core+halo+0.0045;
    }

    void mainImage(out vec4 fragColor,in vec2 fragCoord){
      vec2 baseUv=(2.0*fragCoord-iResolution.xy)/iResolution.y;
      baseUv.y*=-1.0;

      if(parallax){
        baseUv+=parallaxOffset;
      }

      vec3 col=vec3(0.0);
      vec3 b=lineGradientCount>0?vec3(0.0):background_color(baseUv);

      vec2 mouseUv=vec2(0.0);
      if(interactive){
        mouseUv=(2.0*iMouse-iResolution.xy)/iResolution.y;
        mouseUv.y*=-1.0;
      }

      if(enableBottom){
        for(int i=0;i<64;++i){
          if(i>=bottomLineCount)break;
          float fi=float(i);
          float t=fi/max(float(bottomLineCount-1),1.0);
          vec3 lineCol=getLineColor(t,b);
          float angle=bottomWavePosition.z*log(length(baseUv)+1.0);
          vec2 ruv=baseUv*rotate(angle);
          col+=lineCol*wave(
            ruv+vec2(bottomLineDistance*fi+bottomWavePosition.x,bottomWavePosition.y),
            1.5+0.2*fi,
            baseUv,
            mouseUv,
            interactive
          )*0.2;
        }
      }

      if(enableMiddle){
        for(int i=0;i<64;++i){
          if(i>=middleLineCount)break;
          float fi=float(i);
          float t=fi/max(float(middleLineCount-1),1.0);
          vec3 lineCol=getLineColor(t,b);
          float angle=middleWavePosition.z*log(length(baseUv)+1.0);
          vec2 ruv=baseUv*rotate(angle);
          col+=lineCol*wave(
            ruv+vec2(middleLineDistance*fi+middleWavePosition.x,middleWavePosition.y),
            2.0+0.15*fi,
            baseUv,
            mouseUv,
            interactive
          )*0.84;
        }
      }

      if(enableTop){
        for(int i=0;i<64;++i){
          if(i>=topLineCount)break;
          float fi=float(i);
          float t=fi/max(float(topLineCount-1),1.0);
          vec3 lineCol=getLineColor(t,b);
          float angle=topWavePosition.z*log(length(baseUv)+1.0);
          vec2 ruv=baseUv*rotate(angle);
          ruv.x*=-1.0;
          col+=lineCol*wave(
            ruv+vec2(topLineDistance*fi+topWavePosition.x,topWavePosition.y),
            1.0+0.2*fi,
            baseUv,
            mouseUv,
            interactive
          )*0.11;
        }
      }

      fragColor=vec4(col,1.0);
    }

    void main(){
      vec4 color=vec4(0.0);
      mainImage(color,gl_FragCoord.xy);
      outColor=color;
    }
  `;

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
    container.classList.add('floating-lines-fallback');
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
    container.classList.add('floating-lines-fallback');
    return;
  }

  const vertices=new Float32Array([-1,-1,3,-1,-1,3]);
  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
  gl.useProgram(program);
  const positionLoc=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,0,0);

  const uniforms={};
  [
    'iTime','iResolution','animationSpeed','enableTop','enableMiddle','enableBottom',
    'topLineCount','middleLineCount','bottomLineCount','topLineDistance','middleLineDistance',
    'bottomLineDistance','topWavePosition','middleWavePosition','bottomWavePosition','iMouse',
    'interactive','bendRadius','bendStrength','bendInfluence','parallax','parallaxStrength',
    'parallaxOffset','lineGradientCount'
  ].forEach(name=>{
    uniforms[name]=gl.getUniformLocation(program,name);
  });
  uniforms.lineGradient=gl.getUniformLocation(program,'lineGradient[0]');

  const config={
    linesGradient:['#ffffff','#eaf4ff','#91c6ff','#48a0ff','#36e0ff'],
    enabledWaves:['top','middle','bottom'],
    lineCount:[5,9,8],
    lineDistance:[14,12,11],
    topWavePosition:{x:10.2,y:0.5,rotate:-0.3},
    middleWavePosition:{x:5.85,y:0.1,rotate:0.2},
    bottomWavePosition:{x:2.9,y:-0.92,rotate:-0.62},
    animationSpeed:reduceMotion?0:.82,
    interactive:true,
    bendRadius:5.0,
    bendStrength:-0.5,
    mouseDamping:0.05,
    parallax:true,
    parallaxStrength:0.12
  };

  const getLineCount=waveType=>{
    if(typeof config.lineCount==='number')return config.lineCount;
    if(!config.enabledWaves.includes(waveType))return 0;
    const index=config.enabledWaves.indexOf(waveType);
    return config.lineCount[index]??6;
  };
  const getLineDistance=waveType=>{
    if(typeof config.lineDistance==='number')return config.lineDistance;
    if(!config.enabledWaves.includes(waveType))return .1;
    const index=config.enabledWaves.indexOf(waveType);
    return config.lineDistance[index]??.1;
  };
  const hexToRgb=hex=>{
    let value=String(hex||'').trim();
    if(value.startsWith('#'))value=value.slice(1);
    let r=255,g=255,b=255;
    if(value.length===3){
      r=parseInt(value[0]+value[0],16);
      g=parseInt(value[1]+value[1],16);
      b=parseInt(value[2]+value[2],16);
    }else if(value.length===6){
      r=parseInt(value.slice(0,2),16);
      g=parseInt(value.slice(2,4),16);
      b=parseInt(value.slice(4,6),16);
    }
    return [r/255,g/255,b/255];
  };

  const setVec3=(name,value)=>uniforms[name]&&gl.uniform3f(uniforms[name],value.x,value.y,value.rotate);
  gl.uniform1f(uniforms.animationSpeed,config.animationSpeed);
  gl.uniform1i(uniforms.enableTop,config.enabledWaves.includes('top')?1:0);
  gl.uniform1i(uniforms.enableMiddle,config.enabledWaves.includes('middle')?1:0);
  gl.uniform1i(uniforms.enableBottom,config.enabledWaves.includes('bottom')?1:0);
  gl.uniform1i(uniforms.topLineCount,getLineCount('top'));
  gl.uniform1i(uniforms.middleLineCount,getLineCount('middle'));
  gl.uniform1i(uniforms.bottomLineCount,getLineCount('bottom'));
  gl.uniform1f(uniforms.topLineDistance,getLineDistance('top')*.01);
  gl.uniform1f(uniforms.middleLineDistance,getLineDistance('middle')*.01);
  gl.uniform1f(uniforms.bottomLineDistance,getLineDistance('bottom')*.01);
  setVec3('topWavePosition',config.topWavePosition);
  setVec3('middleWavePosition',config.middleWavePosition);
  setVec3('bottomWavePosition',config.bottomWavePosition);
  gl.uniform1i(uniforms.interactive,config.interactive?1:0);
  gl.uniform1f(uniforms.bendRadius,config.bendRadius);
  gl.uniform1f(uniforms.bendStrength,config.bendStrength);
  gl.uniform1f(uniforms.bendInfluence,0);
  gl.uniform1i(uniforms.parallax,config.parallax?1:0);
  gl.uniform1f(uniforms.parallaxStrength,config.parallaxStrength);
  gl.uniform2f(uniforms.iMouse,-1000,-1000);
  gl.uniform2f(uniforms.parallaxOffset,0,0);

  const gradient=config.linesGradient.slice(0,8);
  const gradientData=[];
  gradient.forEach(hex=>gradientData.push(...hexToRgb(hex)));
  while(gradientData.length<24)gradientData.push(1,1,1);
  gl.uniform3fv(uniforms.lineGradient,new Float32Array(gradientData));
  gl.uniform1i(uniforms.lineGradientCount,gradient.length);

  gl.clearColor(0,0,0,1);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.disable(gl.BLEND);

  const targetMouse={x:-1000,y:-1000};
  const currentMouse={x:-1000,y:-1000};
  const targetParallax={x:0,y:0};
  const currentParallax={x:0,y:0};
  let targetInfluence=0;
  let currentInfluence=0;
  let raf=0;
  let running=false;
  let inView=false;
  let contextLost=false;
  const t0=performance.now();
  const lerp=(a,b,t)=>a+(b-a)*t;

  const setSize=()=>{
    const rect=container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const dpr=Math.min(devicePixelRatio||1,2);
    const width=Math.max(1,Math.floor(rect.width*dpr));
    const height=Math.max(1,Math.floor(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
      gl.uniform3f(uniforms.iResolution,width,height,1);
    }
  };
  const render=now=>{
    if(!running||contextLost)return;
    raf=requestAnimationFrame(render);
    if(container.offsetParent===null){stop();return;}
    setSize();
    gl.uniform1f(uniforms.iTime,(now-t0)*.001);

    if(config.interactive){
      currentMouse.x=lerp(currentMouse.x,targetMouse.x,config.mouseDamping);
      currentMouse.y=lerp(currentMouse.y,targetMouse.y,config.mouseDamping);
      currentInfluence=lerp(currentInfluence,targetInfluence,config.mouseDamping);
      gl.uniform2f(uniforms.iMouse,currentMouse.x,currentMouse.y);
      gl.uniform1f(uniforms.bendInfluence,currentInfluence);
    }
    if(config.parallax){
      currentParallax.x=lerp(currentParallax.x,targetParallax.x,config.mouseDamping);
      currentParallax.y=lerp(currentParallax.y,targetParallax.y,config.mouseDamping);
      gl.uniform2f(uniforms.parallaxOffset,currentParallax.x,currentParallax.y);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,3);
  };
  const start=()=>{
    if(running||contextLost||document.hidden)return;
    running=true;
    raf=requestAnimationFrame(render);
  };
  function stop(){
    running=false;
    cancelAnimationFrame(raf);
  }
  const syncRunning=()=>{
    if(inView&&!document.hidden)start();
    else stop();
  };
  const handlePointerMove=event=>{
    const rect=canvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const dpr=canvas.width/rect.width||1;
    const x=event.clientX-rect.left;
    const y=event.clientY-rect.top;
    targetMouse.x=x*dpr;
    targetMouse.y=(rect.height-y)*dpr;
    targetInfluence=1;
    if(config.parallax){
      const offsetX=(x-rect.width/2)/rect.width;
      const offsetY=-(y-rect.height/2)/rect.height;
      targetParallax.x=offsetX*config.parallaxStrength;
      targetParallax.y=offsetY*config.parallaxStrength;
    }
  };
  const handlePointerLeave=()=>{
    targetInfluence=0;
  };

  if(config.interactive){
    canvas.addEventListener('pointermove',handlePointerMove,{passive:true});
    canvas.addEventListener('pointerleave',handlePointerLeave,{passive:true});
  }
  addEventListener('resize',setSize,{passive:true});
  document.addEventListener('visibilitychange',syncRunning,{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();
    contextLost=true;
    stop();
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    contextLost=false;
    setSize();
    syncRunning();
  });
  if('ResizeObserver'in window)new ResizeObserver(setSize).observe(container);
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      inView=entries[0]?.isIntersecting??false;
      syncRunning();
    },{threshold:.01});
    observer.observe(container.closest('.tech-hero')||container);
  }else{
    inView=true;
  }
  container._floatingLinesRefresh=setSize;
  container._floatingLinesSync=()=>{
    inView=container.offsetParent!==null;
    syncRunning();
  };
  setSize();
  inView=container.offsetParent!==null;
  syncRunning();
}

function initAboutLightfall(root=document){
  const container=root.querySelector('[data-about-lightfall]');
  if(!container)return;
  if(container.dataset.aboutLightfallReady){
    container._aboutLightfallRefresh?.();
    container._aboutLightfallSync?.();
    return;
  }
  container.dataset.aboutLightfallReady='true';

  const canvas=document.createElement('canvas');
  canvas.className='about-lightfall-canvas';
  container.appendChild(canvas);
  const gl=canvas.getContext('webgl',{
    alpha:true,
    premultipliedAlpha:false,
    antialias:true,
    powerPreference:'high-performance'
  })||canvas.getContext('experimental-webgl');
  if(!gl){
    canvas.remove();
    container.classList.add('about-lightfall-fallback');
    return;
  }

  const vertex=`
    attribute vec2 position;
    void main(){
      gl_Position=vec4(position,0.0,1.0);
    }
  `;
  const fragment=`
    precision highp float;

    uniform vec3 iResolution;
    uniform vec2 iMouse;
    uniform float iTime;

    uniform vec3 uColor0;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform vec3 uColor5;
    uniform vec3 uColor6;
    uniform vec3 uColor7;
    uniform int uColorCount;

    uniform vec3 uBgColor;
    uniform vec3 uMouseColor;
    uniform float uSpeed;
    uniform int uStreakCount;
    uniform float uStreakWidth;
    uniform float uStreakLength;
    uniform float uGlow;
    uniform float uDensity;
    uniform float uTwinkle;
    uniform float uZoom;
    uniform float uBgGlow;
    uniform float uOpacity;
    uniform float uMouseEnabled;
    uniform float uMouseStrength;
    uniform float uMouseRadius;

    vec3 palette(float h){
      int count=uColorCount;
      if(count<1)count=1;
      int idx=int(floor(clamp(h,0.0,0.999999)*float(count)));
      if(idx<=0)return uColor0;
      if(idx==1)return uColor1;
      if(idx==2)return uColor2;
      if(idx==3)return uColor3;
      if(idx==4)return uColor4;
      if(idx==5)return uColor5;
      if(idx==6)return uColor6;
      return uColor7;
    }

    vec3 tanhv(vec3 x){
      vec3 e=exp(-2.0*x);
      return(1.0-e)/(1.0+e);
    }

    vec2 sceneC(vec2 frag,vec2 r){
      vec2 P=(frag+frag-r)/r.x;
      float z=0.0;
      float d=1e3;
      vec4 O=vec4(0.0);
      for(int k=0;k<39;k++){
        if(d<=1e-4)break;
        O=z*normalize(vec4(P,uZoom,0.0))-vec4(0.0,4.0,1.0,0.0)/4.5;
        d=1.0-sqrt(length(O*O));
        z+=d;
      }
      return vec2(O.x,atan(O.z,O.y));
    }

    void mainImage(out vec4 o,vec2 C){
      vec2 r=iResolution.xy;
      vec2 uv0=(C+C-r)/r.x;
      float T=0.1*iTime*uSpeed+9.0;
      float angRings=max(1.0,floor(6.28318530718*max(uDensity,0.05)+0.5));
      vec2 Y=vec2(5e-3,6.28318530718/angRings);

      vec2 c0=sceneC(C,r);
      vec2 cdx=sceneC(C+vec2(1.0,0.0),r);
      vec2 cdy=sceneC(C+vec2(0.0,1.0),r);
      vec2 dCx=cdx-c0;
      vec2 dCy=cdy-c0;
      dCx.y-=6.28318530718*floor(dCx.y/6.28318530718+0.5);
      dCy.y-=6.28318530718*floor(dCy.y/6.28318530718+0.5);
      vec2 fw=abs(dCx)+abs(dCy);
      C=c0;

      vec2 P=vec2(2.0,1.0)*uv0-(r/r.x)*vec2(0.0,1.0);
      vec4 O=vec4(uBgColor*90.0*uBgGlow/(1e3*dot(P,P)+6.0),0.0);

      float mGlow=0.0;
      if(uMouseEnabled>0.5){
        vec2 mN=(iMouse+iMouse-r)/r.x;
        float md=length(uv0-mN);
        mGlow=exp(-md*md/max(uMouseRadius*uMouseRadius,1e-4))*uMouseStrength;
        O.rgb+=uMouseColor*mGlow*0.25;
      }

      float zr=5e-4*uStreakWidth;
      vec2 rr=vec2(max(length(fw),1e-5));
      float tail=19.0/max(uStreakLength,0.05);

      for(int m=0;m<16;m++){
        if(m>=uStreakCount)break;
        float jf=float(m)+1.0;
        float cell=floor(C.x/Y.x+0.5);
        float keepRand=fract(sin(dot(vec2(cell,jf+23.0),vec2(127.1,311.7)))*43758.5453);
        float keep=step(1.0-clamp(uDensity*0.56,0.06,0.48),keepRand);
        float ic=fract(sin(dot(vec2(jf,cell),vec2(7.0,11.0)))*73.0);
        vec2 Pp=C-(T+T*ic)*vec2(0.0,1.0);
        Pp-=floor(Pp/Y+0.5)*Y;
        float h=fract(8663.0*ic);
        vec3 col=palette(h);
        float weight=mix(1.5,1.0+sin(T+7.0*h+4.0),uTwinkle);
        weight*=1.0+mGlow*2.0;
        vec2 inner=vec2(length(max(Pp,vec2(-1.0,0.0))),length(Pp)-zr)-zr;
        vec2 sm=vec2(1.0)-smoothstep(-rr,rr,inner);
        O.rgb+=dot(sm,vec2(exp(tail*Pp.y),3.0))*col*weight*keep;
        C.x+=Y.x/8.0;
      }

      vec3 colr=sqrt(tanhv(max(O.rgb*uGlow-vec3(0.04,0.08,0.02),0.0)));
      o=vec4(colr,uOpacity);
    }

    void main(){
      vec4 color;
      mainImage(color,gl_FragCoord.xy);
      gl_FragColor=color;
    }
  `;

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
    canvas.remove();
    container.classList.add('about-lightfall-fallback');
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
    canvas.remove();
    container.classList.add('about-lightfall-fallback');
    return;
  }

  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  gl.useProgram(program);
  const positionLoc=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,0,0);

  const uniformNames=[
    'iResolution','iMouse','iTime','uColor0','uColor1','uColor2','uColor3','uColor4','uColor5','uColor6','uColor7',
    'uColorCount','uBgColor','uMouseColor','uSpeed','uStreakCount','uStreakWidth','uStreakLength','uGlow','uDensity',
    'uTwinkle','uZoom','uBgGlow','uOpacity','uMouseEnabled','uMouseStrength','uMouseRadius'
  ];
  const loc={};
  uniformNames.forEach(name=>{loc[name]=gl.getUniformLocation(program,name);});

  const hexToRGB=hex=>{
    const value=hex.replace('#','').padEnd(6,'0');
    return[
      parseInt(value.slice(0,2),16)/255,
      parseInt(value.slice(2,4),16)/255,
      parseInt(value.slice(4,6),16)/255
    ];
  };
  const paletteColors=['#F8FBFF','#D8ECFF','#87C6FF','#9B6CFF','#5A35FF'];
  const prepared=Array.from({length:8},(_,i)=>hexToRGB(paletteColors[Math.min(i,paletteColors.length-1)]));
  const average=paletteColors.map(hexToRGB).reduce((sum,color)=>[
    sum[0]+color[0]/paletteColors.length,
    sum[1]+color[1]/paletteColors.length,
    sum[2]+color[2]/paletteColors.length
  ],[0,0,0]);
  prepared.forEach((color,i)=>gl.uniform3f(loc[`uColor${i}`],color[0],color[1],color[2]));
  const bgColor=hexToRGB('#1728A2');
  gl.uniform1i(loc.uColorCount,paletteColors.length);
  gl.uniform3f(loc.uBgColor,bgColor[0],bgColor[1],bgColor[2]);
  gl.uniform3f(loc.uMouseColor,average[0],average[1],average[2]);
  gl.uniform1f(loc.uSpeed,.42);
  gl.uniform1i(loc.uStreakCount,8);
  gl.uniform1f(loc.uStreakWidth,.96);
  gl.uniform1f(loc.uStreakLength,1.86);
  gl.uniform1f(loc.uGlow,1.34);
  gl.uniform1f(loc.uDensity,.42);
  gl.uniform1f(loc.uTwinkle,.9);
  gl.uniform1f(loc.uZoom,2.2);
  gl.uniform1f(loc.uBgGlow,.66);
  gl.uniform1f(loc.uOpacity,.84);
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  gl.uniform1f(loc.uMouseEnabled,reduceMotion?0:1);
  gl.uniform1f(loc.uMouseStrength,.3);
  gl.uniform1f(loc.uMouseRadius,.9);

  gl.clearColor(0,0,0,0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  let raf=0;
  let running=false;
  let inView=true;
  let contextLost=false;
  let lastTime=0;
  let mouseInitialized=false;
  const mouseTarget=[0,0];
  const mouseCurrent=[0,0];
  const hitArea=container.closest('.about-hero')||container;

  const draw=now=>{
    if(contextLost)return;
    gl.useProgram(program);
    gl.uniform1f(loc.iTime,now*.001);
    gl.uniform2f(loc.iMouse,mouseCurrent[0],mouseCurrent[1]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,3);
  };
  const setSize=()=>{
    const rect=container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const dpr=Math.min(devicePixelRatio||1,1.25);
    const width=Math.max(1,Math.floor(rect.width*dpr));
    const height=Math.max(1,Math.floor(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
      gl.uniform3f(loc.iResolution,width,height,1);
      if(!mouseInitialized){
        mouseTarget[0]=mouseCurrent[0]=width*.5;
        mouseTarget[1]=mouseCurrent[1]=height*.48;
        mouseInitialized=true;
      }
      if(reduceMotion)draw(0);
    }
  };
  const render=now=>{
    if(!running||contextLost)return;
    if(container.offsetParent===null){
      running=false;
      raf=0;
      return;
    }
    const dt=lastTime?Math.min((now-lastTime)/1000,.08):0;
    lastTime=now;
    const factor=1-Math.exp(-dt/.15);
    mouseCurrent[0]+=(mouseTarget[0]-mouseCurrent[0])*factor;
    mouseCurrent[1]+=(mouseTarget[1]-mouseCurrent[1])*factor;
    setSize();
    draw(now);
    raf=requestAnimationFrame(render);
  };
  const start=()=>{
    if(running||reduceMotion||contextLost)return;
    running=true;
    lastTime=performance.now();
    raf=requestAnimationFrame(render);
  };
  const stop=()=>{
    running=false;
    if(raf)cancelAnimationFrame(raf);
    raf=0;
  };
  const syncRunning=()=>{
    const shouldRun=!document.hidden&&inView&&container.offsetParent!==null;
    if(shouldRun)start();else stop();
    if(reduceMotion&&shouldRun){setSize();draw(0);}
  };
  const onPointerMove=e=>{
    const rect=container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    mouseTarget[0]=(e.clientX-rect.left)*(canvas.width/rect.width);
    mouseTarget[1]=(rect.height-(e.clientY-rect.top))*(canvas.height/rect.height);
  };
  const onPointerLeave=()=>{
    mouseTarget[0]=canvas.width*.5;
    mouseTarget[1]=canvas.height*.48;
  };

  if(!reduceMotion){
    hitArea.addEventListener('pointermove',onPointerMove,{passive:true});
    hitArea.addEventListener('pointerleave',onPointerLeave,{passive:true});
  }
  addEventListener('resize',setSize,{passive:true});
  document.addEventListener('visibilitychange',syncRunning,{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();
    contextLost=true;
    stop();
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    contextLost=false;
    container.dataset.aboutLightfallReady='';
    canvas.remove();
    initAboutLightfall(root);
  });
  if('ResizeObserver'in window)new ResizeObserver(setSize).observe(container);
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      inView=entries[0]?.isIntersecting??false;
      syncRunning();
    },{threshold:.01});
    observer.observe(hitArea);
  }else{
    inView=container.offsetParent!==null;
  }
  container._aboutLightfallRefresh=setSize;
  container._aboutLightfallSync=()=>{
    setSize();
    inView=container.offsetParent!==null;
    syncRunning();
  };
  setSize();
  inView=container.offsetParent!==null;
  syncRunning();
}

function initAboutOrb(root=document){
  const container=root.querySelector('[data-about-orb]');
  if(!container)return;
  if(container.dataset.aboutOrbReady){
    container._aboutOrbRefresh?.();
    container._aboutOrbSync?.();
    return;
  }
  container.dataset.aboutOrbReady='true';

  const canvas=document.createElement('canvas');
  canvas.className='about-orb-canvas';
  container.appendChild(canvas);
  const gl=canvas.getContext('webgl',{
    alpha:true,
    premultipliedAlpha:false,
    antialias:false,
    powerPreference:'high-performance'
  })||canvas.getContext('experimental-webgl');
  if(!gl){
    container.removeChild(canvas);
    container.classList.add('about-orb-fallback');
    return;
  }

  const vertex=`
    attribute vec2 position;
    void main(){
      gl_Position=vec4(position,0.0,1.0);
    }
  `;
  const fragment=`
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform vec3 backgroundColor;

    vec3 rgb2yiq(vec3 c){
      float y=dot(c,vec3(0.299,0.587,0.114));
      float i=dot(c,vec3(0.596,-0.274,-0.322));
      float q=dot(c,vec3(0.211,-0.523,0.312));
      return vec3(y,i,q);
    }
    vec3 yiq2rgb(vec3 c){
      float r=c.x+0.956*c.y+0.621*c.z;
      float g=c.x-0.272*c.y-0.647*c.z;
      float b=c.x-1.106*c.y+1.703*c.z;
      return vec3(r,g,b);
    }
    vec3 adjustHue(vec3 color,float hueDeg){
      float hueRad=hueDeg*3.14159265/180.0;
      vec3 yiq=rgb2yiq(color);
      float cosA=cos(hueRad);
      float sinA=sin(hueRad);
      float i=yiq.y*cosA-yiq.z*sinA;
      float q=yiq.y*sinA+yiq.z*cosA;
      yiq.y=i;
      yiq.z=q;
      return yiq2rgb(yiq);
    }
    vec3 hash33(vec3 p3){
      p3=fract(p3*vec3(0.1031,0.11369,0.13787));
      p3+=dot(p3,p3.yxz+19.19);
      return -1.0+2.0*fract(vec3(p3.x+p3.y,p3.x+p3.z,p3.y+p3.z)*p3.zyx);
    }
    float snoise3(vec3 p){
      const float K1=0.333333333;
      const float K2=0.166666667;
      vec3 i=floor(p+(p.x+p.y+p.z)*K1);
      vec3 d0=p-(i-(i.x+i.y+i.z)*K2);
      vec3 e=step(vec3(0.0),d0-d0.yzx);
      vec3 i1=e*(1.0-e.zxy);
      vec3 i2=1.0-e.zxy*(1.0-e);
      vec3 d1=d0-(i1-K2);
      vec3 d2=d0-(i2-K1);
      vec3 d3=d0-0.5;
      vec4 h=max(0.6-vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)),0.0);
      vec4 n=h*h*h*h*vec4(
        dot(d0,hash33(i)),
        dot(d1,hash33(i+i1)),
        dot(d2,hash33(i+i2)),
        dot(d3,hash33(i+1.0))
      );
      return dot(vec4(31.316),n);
    }
    vec4 extractAlpha(vec3 colorIn){
      float a=max(max(colorIn.r,colorIn.g),colorIn.b);
      return vec4(colorIn.rgb/(a+1e-5),a);
    }

    const vec3 baseColor1=vec3(0.611765,0.262745,0.996078);
    const vec3 baseColor2=vec3(0.298039,0.760784,0.913725);
    const vec3 baseColor3=vec3(0.062745,0.078431,0.600000);
    const float innerRadius=0.6;
    const float noiseScale=0.65;

    float light1(float intensity,float attenuation,float dist){
      return intensity/(1.0+dist*attenuation);
    }
    float light2(float intensity,float attenuation,float dist){
      return intensity/(1.0+dist*dist*attenuation);
    }
    vec4 draw(vec2 uv){
      vec3 color1=adjustHue(baseColor1,hue);
      vec3 color2=adjustHue(baseColor2,hue);
      vec3 color3=adjustHue(baseColor3,hue);
      float ang=atan(uv.y,uv.x);
      float len=length(uv);
      float invLen=len>0.0?1.0/len:0.0;
      float bgLuminance=dot(backgroundColor,vec3(0.299,0.587,0.114));
      float n0=snoise3(vec3(uv*noiseScale,iTime*0.5))*0.5+0.5;
      float r0=mix(mix(innerRadius,1.0,0.4),mix(innerRadius,1.0,0.6),n0);
      float d0=distance(uv,(r0*invLen)*uv);
      float v0=light1(1.0,10.0,d0);
      v0*=smoothstep(r0*1.05,r0,len);
      float innerFade=smoothstep(r0*0.8,r0*0.95,len);
      v0*=mix(innerFade,1.0,bgLuminance*0.7);
      float cl=cos(ang+iTime*2.0)*0.5+0.5;
      float a=iTime*-1.0;
      vec2 pos=vec2(cos(a),sin(a))*r0;
      float d=distance(uv,pos);
      float v1=light2(1.5,5.0,d);
      v1*=light1(1.0,50.0,d0);
      float v2=smoothstep(1.0,mix(innerRadius,1.0,n0*0.5),len);
      float v3=smoothstep(innerRadius,mix(innerRadius,1.0,0.5),len);
      vec3 colBase=mix(color1,color2,cl);
      float fadeAmount=mix(1.0,0.1,bgLuminance);
      vec3 darkCol=mix(color3,colBase,v0);
      darkCol=(darkCol+v1)*v2*v3;
      darkCol=clamp(darkCol,0.0,1.0);
      vec3 lightCol=(colBase+v1)*mix(1.0,v2*v3,fadeAmount);
      lightCol=mix(backgroundColor,lightCol,v0);
      lightCol=clamp(lightCol,0.0,1.0);
      vec3 finalCol=mix(darkCol,lightCol,bgLuminance);
      return extractAlpha(finalCol);
    }
    vec4 mainImage(vec2 fragCoord){
      vec2 center=iResolution.xy*0.5;
      float size=min(iResolution.x,iResolution.y);
      vec2 uv=(fragCoord-center)/size*2.0;
      float angle=rot;
      float s=sin(angle);
      float c=cos(angle);
      uv=vec2(c*uv.x-s*uv.y,s*uv.x+c*uv.y);
      uv.x+=hover*hoverIntensity*0.1*sin(uv.y*10.0+iTime);
      uv.y+=hover*hoverIntensity*0.1*sin(uv.x*10.0+iTime);
      return draw(uv);
    }
    void main(){
      vec4 col=mainImage(gl_FragCoord.xy);
      gl_FragColor=vec4(col.rgb*col.a,col.a);
    }
  `;

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
    container.classList.add('about-orb-fallback');
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
    container.classList.add('about-orb-fallback');
    return;
  }

  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  gl.useProgram(program);
  const positionLoc=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,0,0);

  const loc={};
  ['iTime','iResolution','hue','hover','rot','hoverIntensity','backgroundColor'].forEach(name=>{
    loc[name]=gl.getUniformLocation(program,name);
  });
  const bg=[7/255,11/255,22/255];
  const config={hue:12,hoverIntensity:2.35,rotateOnHover:true,forceHoverState:true};
  gl.uniform1f(loc.hue,config.hue);
  gl.uniform1f(loc.hoverIntensity,config.hoverIntensity);
  gl.uniform3f(loc.backgroundColor,bg[0],bg[1],bg[2]);
  gl.clearColor(0,0,0,0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);

  let raf=0;
  let running=false;
  let contextLost=false;
  let inView=true;
  let targetHover=0;
  let hoverValue=0;
  let currentRot=0;
  let lastTime=performance.now();
  const hitArea=container.closest('.about-hero')||container;
  const setSize=()=>{
    const rect=container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const dpr=Math.min(devicePixelRatio||1,2);
    const width=Math.max(1,Math.floor(rect.width*dpr));
    const height=Math.max(1,Math.floor(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
      gl.uniform3f(loc.iResolution,width,height,width/height);
    }
  };
  const handlePointerMove=e=>{
    const rect=container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const x=e.clientX-rect.left;
    const y=e.clientY-rect.top;
    const size=Math.min(rect.width,rect.height);
    const uvX=((x-rect.width*.5)/size)*2.0;
    const uvY=((y-rect.height*.5)/size)*2.0;
    targetHover=Math.sqrt(uvX*uvX+uvY*uvY)<.8?1:0;
  };
  const handlePointerLeave=()=>{targetHover=0;};
  const render=now=>{
    if(!running||contextLost)return;
    raf=requestAnimationFrame(render);
    if(container.offsetParent===null)return;
    setSize();
    const dt=(now-lastTime)*.001;
    lastTime=now;
    const effectiveHover=config.forceHoverState?1:targetHover;
    hoverValue+=(effectiveHover-hoverValue)*.1;
    if(config.rotateOnHover&&effectiveHover>.5)currentRot+=dt*.42;
    gl.uniform1f(loc.iTime,now*.00125);
    gl.uniform1f(loc.hue,config.hue);
    gl.uniform1f(loc.hoverIntensity,config.hoverIntensity);
    gl.uniform1f(loc.hover,hoverValue);
    gl.uniform1f(loc.rot,currentRot);
    gl.uniform3f(loc.backgroundColor,bg[0],bg[1],bg[2]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,3);
  };
  const start=()=>{
    if(running||contextLost||!inView||document.hidden)return;
    running=true;
    lastTime=performance.now();
    raf=requestAnimationFrame(render);
  };
  const stop=()=>{
    running=false;
    cancelAnimationFrame(raf);
  };
  const sync=()=>{
    if(inView&&container.offsetParent!==null&&!document.hidden)start();
    else stop();
  };

  hitArea.addEventListener('pointermove',handlePointerMove,{passive:true});
  hitArea.addEventListener('pointerleave',handlePointerLeave,{passive:true});
  addEventListener('resize',setSize,{passive:true});
  document.addEventListener('visibilitychange',sync,{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();
    contextLost=true;
    stop();
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    contextLost=false;
    setSize();
    sync();
  });
  if('ResizeObserver'in window)new ResizeObserver(setSize).observe(container);
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      inView=entries[0]?.isIntersecting??false;
      sync();
    },{threshold:.01});
    observer.observe(hitArea);
  }
  container._aboutOrbRefresh=setSize;
  container._aboutOrbSync=()=>{
    inView=container.offsetParent!==null;
    sync();
  };
  setSize();
  inView=container.offsetParent!==null;
  sync();
}

function initProductsPixelBlast(root=document){
  const container=root.querySelector('[data-products-pixelblast]');
  if(!container)return;
  if(container.dataset.pixelBlastReady){
    container._productsPixelBlastSync?.();
    return;
  }
  container.dataset.pixelBlastReady='true';
  const canvas=document.createElement('canvas');
  container.appendChild(canvas);
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'high-performance'});
  if(!gl){
    container.classList.add('pixelblast-fallback');
    container.removeChild(canvas);
    return;
  }
  container.classList.add('is-webgl');

  const vertex=`#version 300 es
    in vec2 position;
    void main(){gl_Position=vec4(position,0.0,1.0);}
  `;
  const fragment=`#version 300 es
    precision highp float;
    uniform vec3 uColor;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uPixelSize;
    uniform float uScale;
    uniform float uDensity;
    uniform float uPixelJitter;
    uniform float uRippleSpeed;
    uniform float uRippleThickness;
    uniform float uRippleIntensity;
    uniform float uEdgeFade;
    uniform vec2 uClickPos[10];
    uniform float uClickTimes[10];
    out vec4 fragColor;

    float Bayer2(vec2 a){
      a=floor(a);
      return fract(a.x/2.0+a.y*a.y*.75);
    }
    #define Bayer4(a) (Bayer2(.5*(a))*.25+Bayer2(a))
    #define Bayer8(a) (Bayer4(.5*(a))*.25+Bayer2(a))

    float hash11(float n){return fract(sin(n)*43758.5453);}
    float vnoise(vec3 p){
      vec3 ip=floor(p);
      vec3 fp=fract(p);
      float n000=hash11(dot(ip+vec3(0.0,0.0,0.0),vec3(1.0,57.0,113.0)));
      float n100=hash11(dot(ip+vec3(1.0,0.0,0.0),vec3(1.0,57.0,113.0)));
      float n010=hash11(dot(ip+vec3(0.0,1.0,0.0),vec3(1.0,57.0,113.0)));
      float n110=hash11(dot(ip+vec3(1.0,1.0,0.0),vec3(1.0,57.0,113.0)));
      float n001=hash11(dot(ip+vec3(0.0,0.0,1.0),vec3(1.0,57.0,113.0)));
      float n101=hash11(dot(ip+vec3(1.0,0.0,1.0),vec3(1.0,57.0,113.0)));
      float n011=hash11(dot(ip+vec3(0.0,1.0,1.0),vec3(1.0,57.0,113.0)));
      float n111=hash11(dot(ip+vec3(1.0,1.0,1.0),vec3(1.0,57.0,113.0)));
      vec3 w=fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
      float x00=mix(n000,n100,w.x);
      float x10=mix(n010,n110,w.x);
      float x01=mix(n001,n101,w.x);
      float x11=mix(n011,n111,w.x);
      return mix(mix(x00,x10,w.y),mix(x01,x11,w.y),w.z)*2.0-1.0;
    }
    float fbm2(vec2 uv,float t){
      vec3 p=vec3(uv*uScale,t);
      float amp=1.0;
      float freq=1.0;
      float sum=1.0;
      for(int i=0;i<5;++i){
        sum+=amp*vnoise(p*freq);
        freq*=1.25;
        amp*=1.0;
      }
      return sum*.5+.5;
    }
    float maskCircle(vec2 p,float cov){
      float r=sqrt(cov)*.25;
      float d=length(p-.5)-r;
      float aa=.5*fwidth(d);
      return cov*(1.0-smoothstep(-aa,aa,d*2.0));
    }
    void main(){
      float pixelSize=uPixelSize;
      vec2 fragCoord=gl_FragCoord.xy-uResolution*.5;
      float aspectRatio=uResolution.x/uResolution.y;
      vec2 pixelUV=fract(fragCoord/pixelSize);
      float cellPixelSize=8.0*pixelSize;
      vec2 cellId=floor(fragCoord/cellPixelSize);
      vec2 cellCoord=cellId*cellPixelSize;
      vec2 uv=cellCoord/uResolution*vec2(aspectRatio,1.0);

      float base=fbm2(uv,uTime*.05);
      base=base*.46-.7;
      float feed=base+(uDensity-.5)*.42;

      for(int i=0;i<10;++i){
        vec2 pos=uClickPos[i];
        if(pos.x<0.0)continue;
        vec2 cuv=(((pos-uResolution*.5-cellPixelSize*.5)/uResolution))*vec2(aspectRatio,1.0);
        float t=max(uTime-uClickTimes[i],0.0);
        float r=distance(uv,cuv);
        float ring=exp(-pow((r-uRippleSpeed*t)/uRippleThickness,2.0));
        float atten=exp(-1.0*t)*exp(-10.0*r);
        feed=max(feed,ring*atten*uRippleIntensity);
      }

      float bayer=Bayer8(fragCoord/uPixelSize)-.5;
      float bw=step(.5,feed+bayer);
      float h=fract(sin(dot(floor(fragCoord/uPixelSize),vec2(127.1,311.7)))*43758.5453);
      float coverage=bw*(1.0+(h-.5)*uPixelJitter);
      float mask=maskCircle(pixelUV,coverage);

      vec2 norm=gl_FragCoord.xy/uResolution;
      float edge=min(min(norm.x,norm.y),min(1.0-norm.x,1.0-norm.y));
      mask*=smoothstep(0.0,uEdgeFade,edge);
      mask*=smoothstep(.04,.42,norm.y);

      vec3 color=uColor;
      vec3 srgb=mix(color*12.92,1.055*pow(color,vec3(1.0/2.4))-.055,step(0.0031308,color));
      fragColor=vec4(srgb,mask*.86);
    }
  `;

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
    container.classList.add('pixelblast-fallback');
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
    container.classList.add('pixelblast-fallback');
    container.removeChild(canvas);
    return;
  }

  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  gl.useProgram(program);
  const positionLoc=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,0,0);

  const loc={
    color:gl.getUniformLocation(program,'uColor'),
    resolution:gl.getUniformLocation(program,'uResolution'),
    time:gl.getUniformLocation(program,'uTime'),
    pixelSize:gl.getUniformLocation(program,'uPixelSize'),
    scale:gl.getUniformLocation(program,'uScale'),
    density:gl.getUniformLocation(program,'uDensity'),
    jitter:gl.getUniformLocation(program,'uPixelJitter'),
    rippleSpeed:gl.getUniformLocation(program,'uRippleSpeed'),
    rippleThickness:gl.getUniformLocation(program,'uRippleThickness'),
    rippleIntensity:gl.getUniformLocation(program,'uRippleIntensity'),
    edgeFade:gl.getUniformLocation(program,'uEdgeFade'),
    clickPos:gl.getUniformLocation(program,'uClickPos[0]'),
    clickTimes:gl.getUniformLocation(program,'uClickTimes[0]')
  };
  const clicks=new Float32Array(20);
  const clickTimes=new Float32Array(10);
  for(let i=0;i<10;i++)clicks[i*2]=-1;
  let clickIx=0;
  let dpr=1;
  const colorHex='#4ae6ff';
  const rgb=[parseInt(colorHex.slice(1,3),16)/255,parseInt(colorHex.slice(3,5),16)/255,parseInt(colorHex.slice(5,7),16)/255];
  const config={pixelSize:5,scale:2.7,density:.88,jitter:.5,rippleSpeed:.42,rippleThickness:.12,rippleIntensity:1.7,edgeFade:.2,speed:.72};

  function setSize(){
    dpr=Math.min(devicePixelRatio||1,2);
    const rect=container.getBoundingClientRect();
    const width=Math.max(1,Math.round(rect.width*dpr));
    const height=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
    }
    gl.viewport(0,0,width,height);
    gl.useProgram(program);
    gl.uniform2f(loc.resolution,width,height);
    gl.uniform1f(loc.pixelSize,config.pixelSize*dpr);
  }

  const pointerToPixel=e=>{
    const rect=canvas.getBoundingClientRect();
    return {
      x:(e.clientX-rect.left)*(canvas.width/rect.width),
      y:(rect.height-(e.clientY-rect.top))*(canvas.height/rect.height)
    };
  };
  const addRipple=e=>{
    const p=pointerToPixel(e);
    clicks[clickIx*2]=p.x;
    clicks[clickIx*2+1]=p.y;
    clickTimes[clickIx]=timeValue;
    clickIx=(clickIx+1)%10;
  };
  const addSoftRipple=e=>{
    if(performance.now()-lastMoveRipple<520)return;
    lastMoveRipple=performance.now();
    addRipple(e);
  };

  let raf=0;
  let running=false;
  let inView=false;
  let timeValue=Math.random()*1000;
  let lastMoveRipple=0;
  const start=()=>{
    if(running||document.hidden)return;
    running=true;
    raf=requestAnimationFrame(render);
  };
  const stop=()=>{
    running=false;
    cancelAnimationFrame(raf);
  };
  const sync=()=>{
    if(inView&&!document.hidden)start();
    else stop();
  };
  function render(){
    if(!running)return;
    timeValue+=0.016*config.speed;
    gl.useProgram(program);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform3f(loc.color,rgb[0],rgb[1],rgb[2]);
    gl.uniform1f(loc.time,timeValue);
    gl.uniform1f(loc.scale,config.scale);
    gl.uniform1f(loc.density,config.density);
    gl.uniform1f(loc.jitter,config.jitter);
    gl.uniform1f(loc.rippleSpeed,config.rippleSpeed);
    gl.uniform1f(loc.rippleThickness,config.rippleThickness);
    gl.uniform1f(loc.rippleIntensity,config.rippleIntensity);
    gl.uniform1f(loc.edgeFade,config.edgeFade);
    gl.uniform2fv(loc.clickPos,clicks);
    gl.uniform1fv(loc.clickTimes,clickTimes);
    gl.drawArrays(gl.TRIANGLES,0,3);
    raf=requestAnimationFrame(render);
  }

  canvas.addEventListener('pointerdown',addRipple,{passive:true});
  canvas.addEventListener('pointermove',addSoftRipple,{passive:true});
  addEventListener('resize',setSize,{passive:true});
  document.addEventListener('visibilitychange',sync,{passive:true});
  if('ResizeObserver'in window)new ResizeObserver(setSize).observe(container);
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      inView=entries[0]?.isIntersecting??false;
      sync();
    },{threshold:.01});
    observer.observe(container);
  }else{
    inView=container.offsetParent!==null;
  }
  container._productsPixelBlastSync=()=>{
    setSize();
    inView=container.offsetParent!==null;
    sync();
  };
  setSize();
  inView=container.offsetParent!==null;
  sync();
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
    card.classList.add('star-border-card');
    if(!card.dataset.starBorderReady){
      card.dataset.starBorderReady='true';
      ['top','bottom'].forEach(position=>{
        const ray=document.createElement('span');
        ray.className=`star-border-flow star-border-flow-${position}`;
        ray.setAttribute('aria-hidden','true');
        card.appendChild(ray);
      });
    }
    ['left','right'].forEach(position=>{
      if(card.querySelector(`:scope > .star-border-side-glow-${position}`))return;
      const glow=document.createElement('span');
      glow.className=`star-border-side-glow star-border-side-glow-${position}`;
      glow.setAttribute('aria-hidden','true');
      card.appendChild(glow);
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

