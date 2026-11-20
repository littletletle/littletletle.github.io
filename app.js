let projects=[],category='全部';
const slides=[{id:'xiongan',title:'全景雄安'},{id:'booth-design',title:'展台设计制作搭建'},{id:'science5g',title:'中国科技馆5G科普体验厅'},{id:'robotics',title:'华为（西南）数字机器人创新中心'}];
const hero=document.querySelector('.hero'),visual=hero.querySelector('.hero-visual'),heroImage=visual.querySelector('img'),caption=hero.querySelector('.hero-caption'),dots=hero.querySelector('.hero-dots'),pause=document.querySelector('#hero-pause');
let currentSlide=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,timer,touchX=null;
function showSlide(index){currentSlide=(index+slides.length)%slides.length;const slide=slides[currentSlide];heroImage.src=`assets/${slide.id}.webp`;heroImage.alt=slide.title+'方案效果图';visual.href=caption.href=`reader.html?project=${slide.id}`;visual.setAttribute('aria-label','阅读'+slide.title+'方案');caption.querySelector('strong').textContent=slide.title+' ↗';[...dots.children].forEach((button,i)=>{button.classList.toggle('active',i===currentSlide);button.setAttribute('aria-pressed',String(i===currentSlide))});}
function schedule(){clearInterval(timer);if(!paused&&!document.hidden)timer=setInterval(()=>showSlide(currentSlide+1),5500);}
slides.forEach((slide,i)=>{const button=document.createElement('button');button.title=button.ariaLabel='切换到'+slide.title;button.addEventListener('click',()=>{showSlide(i);schedule()});dots.append(button);if(i){const preload=new Image();preload.src=`assets/${slide.id}.webp`;}});
function updatePause(){pause.textContent=paused?'▷':'Ⅱ';pause.setAttribute('aria-label',paused?'播放轮播':'暂停轮播');pause.title=paused?'播放轮播':'暂停轮播';schedule();}
pause.addEventListener('click',()=>{paused=!paused;updatePause()});
hero.addEventListener('pointerenter',()=>clearInterval(timer));hero.addEventListener('pointerleave',schedule);
hero.addEventListener('focusin',()=>clearInterval(timer));hero.addEventListener('focusout',e=>{if(!hero.contains(e.relatedTarget))schedule()});
document.addEventListener('visibilitychange',schedule);
hero.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX;clearInterval(timer)},{passive:true});
hero.addEventListener('touchend',e=>{if(touchX!==null){const distance=e.changedTouches[0].clientX-touchX;if(Math.abs(distance)>45)showSlide(currentSlide+(distance<0?1:-1));touchX=null;schedule()}},{passive:true});
showSlide(0);updatePause();
const grid=document.querySelector('#projects'),search=document.querySelector('#search');
function render(){const items=projects.filter(p=>p.category!=='个人资料'&&(category==='全部'||p.category===category)&&(p.title+p.subtitle).includes(search.value.trim()));grid.replaceChildren(...items.map(p=>{const a=document.createElement('a');a.className='project';a.href=`reader.html?project=${p.id}`;a.innerHTML=`<div class="project-image"><img src="${p.cover}" alt="${p.title}方案封面" loading="lazy"></div><div class="project-meta"><span>${p.category}</span><span>${p.pages} 页 · PDF ↗</span></div><h3>${p.title}</h3><p>${p.subtitle}</p>`;return a}));document.querySelector('#empty').hidden=items.length>0;}
fetch('projects.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{projects=data;render()}).catch(()=>{grid.textContent='项目加载失败，请刷新重试。'});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});render()}));search.addEventListener('input',render);
