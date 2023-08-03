// queue() returns a promise returning function. 'tasks' is an array of higher order functions that return 'promise returning'/'async' functions [()=>async(){ }]. 
// the purpose of that wrapping  is not to start resolving the promise immediately, but being able to map parameters for the task.  
//'concurrent' is the max. number of tasks to be executed in parallel.

/*----- bookmarklet ----------
javascript:(async(e,t)=>{await n("file:///shared/git/http/cdn/urlcreate.js");var r=e.page=e.page||{};return r.entries=(()=>new Map(Object.entries(e.page))),r.loadScript=n,n.page=(()=>n("file:///tmp/shared0/git/http/cdn/urlcreate.js")),await n(),Object.assign(r,e.$),console.log(r.entries(r)),r;function n(e="file:///tmp/shared0/git/http/cdn/webkit.min.js"){return new Promise((r,n)=>{var a=t.querySelector('[src="'+e+'"]');a?r(a):((a=t.createElement("script")).setAttribute("async",""),a.addEventListener("load",e=>r()),a.addEventListener("error",e=>n()),a.src=e,(t.head||t.body||t.documentElement).appendChild(a))})}})(window,window.document);
-----------------------------*/

var page=window.page={};

//ea-webkit
/*
javascript:(async(e,t)=>{var loadScript=window.loadScript=(e='file:///shared/git/http/cdn/urlcreate.js')=>new Promise((t,n)=>{var r=document.querySelector('[src="' + e + '"]');r?t(r):(r=document.createElement('script'),r.setAttribute('async',''),r.addEventListener('load',e=>t()),r.addEventListener('error',e=>n()),r.src=e,(document.head||document.body||document.documentElement).appendChild(r))});loadScript();})(window,window.document);
*/
//loadScript('https://unpkg.com/ea-webkit@latest/dist/webkit.min.js')

//https://xxxporn.pics/media/celebrityf/emma-watson/naked-hardcore-page/emma-watson-10.jpg


var loadScript=page.loadScript=(e='file:///shared/git/http/cdn/urlcreate.js')=>new Promise((t,n)=>{var r=document.querySelector('[src="' + e + '"]');r?t(r):(r=document.createElement('script'),r.setAttribute('async',''),r.addEventListener('load',e=>t()),r.addEventListener('error',e=>n()),r.src=e,(document.head||document.body||document.documentElement).appendChild(r))});

loadScript('file:///shared/git/http/cdn/webkit.min.js')
    .then(webkit=>(Object.assign(page,window.webkit),window.webkit))
    .then(webkit=>webkit.toolbox())
    .then(({editor,btnToolbox,btnBookmarklet}) => {
      

      
		   var script = `var loadScript=window.loadScript=(e='file:///shared/git/http/cdn/urlcreate.js')=>new Promise((t,n)=>{var r=document.querySelector('[src="' + e + '"]');r?t(r):(r=document.createElement('script'),r.setAttribute('async',''),r.addEventListener('load',e=>t()),r.addEventListener('error',e=>n()),r.src=e,(document.head||document.body||document.documentElement).appendChild(r))});loadScript();`

		   editor.session.setValue(script);      //this (or any) gist link
    //var defaultGistUrl = 'https://gsist.github.com/hagb4rd/6843803a6674fe1b9ead6f1e60f14f15#file-toolbox-js';
    //var defaultGistUrl = 'https://gist.github.com/hagb4rd/6843803a6674fe1b9ead6f1e60f14f15#file-queue-download-images-js';
    //var defaultGistUrl = 'https://gist.github.com/hagb4rd/6843803a6674fe1b9ead6f1e60f14f15#download-linked-images-text-js'

    //load-gist-contents
    /*
    


    page.gist.file(defaultGistUrl).then(file=>{        editor.session.setValue(file.content) 
    */

    })

var queue = page.queue = function queue(tasks, concurrent) {
return function() {
    var result = new Array(tasks.length);
    var running = 0;
    var pending = tasks.length;
    var cursor = 0;

    function next(onDone, onError) {
        if (cursor < tasks.length && running < concurrent) {
            let index = cursor;
            ++cursor;
            ++running;

            function save(v) {
                result[index] = v;
                --running;
                --pending;
                if (pending === 0)
                    onDone(result);
                else
                    next(onDone, onError);
                return v;
            }

            //execute task/resolve promise, and save result
            tasks[index]().then(save, save);
            //load next task
            next(onDone, onError);
        }
    }
    return new Promise(function(resolve, reject) {
        next(function(result) {
            resolve(result);
        }, reject);
    }
    );
}
}
var linkedImages = page.linkedImages = (d) =>{
d = d || window.document;
var xs = d.querySelectorAll("[hrefpage=\".jpg\"],[hrefpage=\".png\"]")
var is = [...xs].map(x=>x.href);
return is;
}
var embedImages = page.embedImages = (minW=250,minH=250)=>[...document.querySelectorAll('img')].filter(({width, height})=>(width >= minW && height >= minH));

var dataUrlFromCanvas = page.dataUrlFromCanvas = (img)=>new Promise((resolve,reject)=>{
if (img instanceof Image) {
    try {
        n.height = img.height;
        n.width = img.width;
        n.getContext("2d").drawImage(img, 0, 0);
        var dataUrl = n.toDataURL("image/jpeg");
        return resolve(dataUrl);
    } catch (err) {
        reject(err.message);
    }
} else {
    var e = new Image();
    e.crossOrigin = 'Anonymous';
    var n = document.createElement("CANVAS");
    e.addEventListener("error", (e)=>reject(e.message));
    e.addEventListener("load", ()=>{
        try {
            n.height = e.height;
            n.width = e.width;
            n.getContext("2d").drawImage(e, 0, 0);
            var dataUrl = n.toDataURL("image/jpeg");
            resolve(dataUrl);
        } catch (err) {
            reject(err.message);
        }
    }
    );
    e.src = img.src ? img.src : img;
}
}
)

var dataUrlByFileReader =  page.dataUrlByFileReader = (url)=>new Promise((resolve,reject)=>{
var xhr = new XMLHttpRequest();
xhr.responseType = 'blob';
xhr.onerror = (e)=>reject(e);
xhr.onload = function() {
    var reader = new FileReader();
    reader.onerror = function(e) {
        reject(e.message)
    }
    reader.onloadend = function() {
        resolve(reader.result);
    }
    reader.readAsDataURL(xhr.response);
}
;
xhr.open('GET', url);
xhr.send();
}
)

var readAsDataUrl = page.readAsDataUrl = async(media)=>{
var img,dataUrl;
if("string" == typeof media) {
    try {
        var u = new URL(media);
        return dataUrlByFileReader(media);
    } catch (err) {
        conole.log(err);
    }

}
try {
    dataUrl = await dataUrlFromCanvas(img);
    return dataUrl;
} catch (err) {
    conole.log(err);
}
try {
    dataUrl = await dataUrlByFileReader(img);
    return dataUrl;
} catch (err) {
    console.log(err);
}
try {
    dataUrl = await dataUrlFromCanvas(`https://jslave.herokuapp.com/proxy/?url=page{img}`);
    return dataUrl;
} catch (err) {
    conole.log(err);
}
try {
    dataUrl = await dataUrlFromCanvas(`https://jslave2.herokuapp.com/proxy/?url=page{img}`);
    return dataUrl;
} catch (err) {
    conole.log(err);
}

try {
    dataUrl = await dataUrlByFileReader(`https://jslave.herokuapp.com/proxy/?url=page{img}`);
    return dataUrl;
} catch (err) {
    console.log(err);
}
try {
    dataUrl = await dataUrlByFileReader(`https://jslave2.herokuapp.com/proxy/?url=page{img}`);
    return dataUrl;
} catch (err) {
    console.log(err);
}
throw Error('could not resolve create dataUrl');
}
;

var download = page.download = async(image,name)=>{
try {
    a = document.createElement('a');
    a.href =  image.href||await readAsDataUrl(image);
    a.setAttribute('download', name);
    a.style.display = 'none';
    
    var parent=(document.body || document.documentElement);
    parent.appendChild(a);
    console.log(`downloading: ${name}`);
    a.click();
    parent.remove(a);
    
    
} catch (err) {
    console.log(err, [image, name]);
}
return [image, name]
}
var downloadLinkedImages = page.downloadLinkedImages = ()=>{
return [...linkedImages()].map((url)=>{
    var name = `page{location.host}page{location.pathname.replace(/\//g, '.')}.page{url.split(/\//).pop()}`;
    return ()=>download(url, name)
}
)
}
;
var downloadImages = page.downloadImages = (w=250,h=250)=>embedImages(w, h).map((i)=>{
var url = new URL(i.src);
var name = [url.host].concat(i.alt ? i.alt.match(/\w+/g) : []).concat(url.pathname.match(/[^/\?]+/g)).filter(x=>!!x).join('-');
return ()=>download(i.src, name);
}
);

var downloadText = page.downloadText = (text,filename)=>{
//var toDataUrl=(s)=>`data:text/plain;base64,page{btoa(s)}`;
var toDataUrl = (s)=>`data:text/plain;charset=utf-8,` + encodeURIComponent(s);
var a = document.createElement('a');
a.setAttribute('download', filename || 'images' + (String(Math.floor(Math.random() * 99999))).padStart(6, '0') + '.txt');
a.href = toDataUrl(text);
a.style.visibility = 'hidden';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}

var urlcreate = page.urlcreate = (u=`https://content4.coedcherry.com/watch-my-gf/184395/91122_#.jpg`,n=1,m=20)=>[...(new Array(m - n + 1)).keys()].map(x=>(x + n)).map(x=>{
var pad = u.match(/#+/)[0].length;
return u.replace(`#`.repeat(pad), String(x).padStart(pad, '0'));
}
)
//https://cdn5-images.motherlessmedia.com/images/00342B9.jpg
var scrape = page.scrape = (url, start = 1, end = 24) => {
  var imagelinks=page.urlcreate(url, start, end)
  var concurrentDownloads=1;
  var task=page.queue(imagelinks.map(u=>async()=>{
    console.log('downloading: ' + u);
    var result=await download(u);
    console.log('done',result);
  }), concurrentDownloads);
  //run queue with task() 
  return task; 
};
var loadImage = page.loadImage = (u)=>new Promise((resolve,reject)=>{
var i = new Image();
i.onload = (e)=>resolve(i);
i.onerror = (e)=>{
    var a = document.createElement('a');
    a.target = 'imageview';
    a.href = u;
    a.innerText = u;
    resolve(a)
};
console.log('loadImage: ' + u)
i.src = u;
}
);

var findImageLinks = page.findImageLinks = (extensions=['.jpg', '.png', '.jpeg', '.gif', '.tif', '.wbem'])=>[...document.querySelectorAll('a')].map(a=>a.href).filter(href=>extensions.some(ext=>ext == href.slice(-ext.length)));

var prepend = page.prepend = (elem)=>(document.body || document.rootElement).prepend(elem);

var loadImages = page.loadImages = (list)=>queue(list.map(u=>()=>loadImage(u).then((x)=>prepend(x))),1)();


var sine=x=>{
//const B = 4/Math.PI;
//const C = -4/(Math.PI*Math.PI)
return sine.B * x * sine.C * x * Math.abs(x)
}
sine.B=4/Math.PI;
sine.C=-4/(Math.PI*Math.PI)
var gen=page.gen=(min,max,steps)=>{
var len=max-min;
steps = steps || Math.floor(len);
var step=len/steps;
var arr=new Array(steps).fill(0);
for(var k=0,i=min*1000;i<max*1000;i+=step*1000) {
arr[k++]=i/1000;
}
return arr;
}


var paramSearch = page.paramSearch = (param='img_url')=>[...document.querySelectorAll(`[href*=page{param}]`)].map(a=>a.href).map(u=>(new URL(u)).searchParams.get(param))
//downloadText(paramSearch('img_url').join("\r\n"));
//downloadText(indImageLinks().join('\n'));

/*
((text,filename)=>{
//var toDataUrl=(s)=>`data:text/plain;base64,page{btoa(s)}`;
var toDataUrl=(s)=>`data:text/plain;charset=utf-8,`+ encodeURIComponent(s);
var a=document.createElement('a');
a.setAttribute('download',filename||'images'+(String(Math.floor(Math.random()*99999))).padStart(6,'0')+'.txt');
a.href=toDataUrl(text);
a.style.visibility='hidden';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
})([...document.querySelectorAll('[href*=img_url]')].map(a=>a.href).map(u=>(new URL(u)).searchParams.get('img_url')).join("\r\n"))
*/

//loadImages(urlcreate(`https://content4.coedcherry.com/watch-my-gf/184395/91122_#.jpg`,1,20));
//loadImages(urlcreate(`    https://cdn1.watchmygf.me/contents/videos_screenshots/3000/3###/preview.mp4.jpg`, 1, 50))
//https://enjoyvids.com/fhg/dpn/0001/photos/##.jpg`
//loadImages(findImageLinks());
var motherless = page.motherless = ()=>{
var xs = [...document.querySelectorAll('.img-container')].map(a=>{
    var priv = {};
    priv.id = a.href.match(/.*\/([A-F0-9]{5,7})/)[1];
    return ({
        get id() {
            return priv.id;
        },
        get img() {
            return `https://cdn5-images.motherlessmedia.com/images/page{priv.id}.jpg`;
        },
        get thumb() {
            return a.querySelector('img.static').src;
        }
    });
}
);
if (!xs.length) {
    var rndhex = ()=>((Math.random() * (2 ** 24)) | 0).toString(16).padStart(7,'0').toUpperCase();
    var rndimg = ()=>`https://cdn5-images.motherlessmedia.com/images/page{rndhex()}.jpg`;
    loadImages([0,1,2,3,4,5,6,7,8,9,10].map(x=>rndimg()));
} else {
    var html = xs.map(({id, img, thumb})=>`<a href="page{img}"><img src="page{thumb}"></img></a>`).join("");
    document.write(html);
}
}
;
//motherless();

var asmhentai=page.asmhentai=()=>{
var rnd=(from=1,to=10000)=>from+((Math.random()*(to-from))>>>0);
var i=rnd();
loadImages([1,2,3,4,5].map(x=>`https://cimg.asmhentai.com/001/page{i}/page{x}.jpg`))
};


// ==========================================================================
// ACTION
// ==========================================================================

//download images on site .. max. 1 images in parallel
var queueImages = queue(downloadImages(128, 128), 1);
//-tries do download deeplinked images 
var queueLinkedImages = queue(downloadLinkedImages(), 1);

//start both queues concurrently
queueImages();
queueLinkedImages();



window.loadScript=loadScript;

Object.defineProperty(page, "help", { get: ()=>(new Map(Object.entries(page))) });
console.log(page);
