const params=new URLSearchParams(location.search),id=params.get('project'),frame=document.querySelector('#viewer');
fetch('projects.json?v=speed-20261126',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{
 const p=data.find(p=>p.id===id);if(!p)throw Error('没有找到这份方案');
 document.title=p.title+' · 蒋尉聪';document.querySelector('#title').textContent=p.title;
 if(p.available===false||!p.pdf){document.querySelector('#fullscreen').hidden=true;frame.outerHTML='<div class="reader-error">此方案暂不开放阅读。<br><a href="index.html#work">返回作品集</a></div>';return;}
 const pdf=new URL(p.pdf,location.href);
 const url=new URL('pdfjs-compatible/web/viewer.html',location.href);
 url.searchParams.set('file',pdf.href);url.searchParams.set('v','speed-20261126');url.hash='locale=zh-CN&zoom=page-fit';
 const preview=document.createElement('div');preview.className='reader-preview';
 if(p.preview){const image=document.createElement('img');image.src=p.preview;image.alt=p.title+'第一页';image.fetchPriority='high';preview.append(image);document.body.append(preview);}
 const loading=document.createElement('p');loading.className='reader-status';loading.textContent='正在加载方案…';document.body.append(loading);
 let finished=false,monitoring=false;
 function complete(){finished=true;loading.remove();preview.remove();}
 function fail(){if(finished)return;loading.textContent='方案加载较慢，请稍候或刷新重试。';}
 function monitorViewer(){
  try{
   const app=frame.contentWindow.PDFViewerApplication;
   if(!app){fail();return;}
   if(monitoring)return;
   monitoring=true;
   app.initializedPromise.then(()=>{
    app.eventBus.on('pagerendered',complete,{once:true});
    app.eventBus.on('documenterror',fail,{once:true});
    if(app.pdfViewer?.getPageView(0)?.renderingState===3)complete();
   }).catch(fail);
  }catch{fail();}
 }
 document.addEventListener('webviewerloaded',event=>{if(event.detail?.source===frame.contentWindow)monitorViewer();});
 frame.addEventListener('load',monitorViewer,{once:true});
 frame.src=url.href;frame.hidden=false;
 document.querySelector('#fullscreen').href=url.href;
 setTimeout(()=>{if(!finished)fail()},20000);
}).catch(()=>{document.querySelector('#title').textContent='方案未找到';frame.outerHTML='<div class="reader-error">这份方案暂时无法打开。<br><a href="index.html#work">返回作品集</a></div>';});
