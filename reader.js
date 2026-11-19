const params=new URLSearchParams(location.search),id=params.get('project'),frame=document.querySelector('#viewer'),status=document.querySelector('#status');
fetch('projects.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{
 const p=data.find(p=>p.id===id);if(!p)throw Error('没有找到这份方案');
 document.title=p.title+' · 蒋尉聪';document.querySelector('#title').textContent=p.title;
 const pdf=new URL(p.pdf,location.href);
 const url=new URL('pdfjs-compatible/web/viewer.html',location.href);
 url.searchParams.set('file',pdf.href);url.hash='locale=zh-CN&zoom=page-fit';
 const direct=document.createElement('a');direct.href=pdf.href;direct.target='_blank';direct.rel='noopener';direct.textContent='直接打开 PDF';direct.title='使用浏览器阅读 PDF';
 document.querySelector('.reader-nav').insertBefore(direct,document.querySelector('#share'));
 const loading=document.createElement('p');loading.className='reader-status';loading.textContent='正在加载方案…';document.body.append(loading);
 let finished=false;
 function complete(){finished=true;loading.remove();}
 function fail(){if(finished)return;loading.replaceChildren(document.createTextNode('加载较慢，'),direct.cloneNode(true));}
 frame.addEventListener('load',()=>{
  try{
   const app=frame.contentWindow.PDFViewerApplication;
   if(!app){fail();return;}
   app.initializedPromise.then(()=>{
    app.eventBus.on('pagerendered',complete,{once:true});
    app.eventBus.on('documenterror',fail,{once:true});
    if(app.pdfViewer?.getPageView(0)?.renderingState===3)complete();
   }).catch(fail);
  }catch{fail();}
 },{once:true});
 frame.src=url.href;frame.hidden=false;
 document.querySelector('#fullscreen').href=url.href;document.querySelector('#download').href=pdf.href;
 setTimeout(()=>{if(!finished)fail()},20000);
}).catch(()=>{document.querySelector('#title').textContent='方案未找到';frame.outerHTML='<div class="reader-error">这份方案暂时无法打开。<br><a href="index.html#work">返回作品集</a></div>';});
document.querySelector('#share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);status.textContent='链接已复制';}catch{status.textContent='请复制浏览器地址栏中的链接';}status.hidden=false;setTimeout(()=>status.hidden=true,2600)});
