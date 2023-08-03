

function css(arr) {

  var defaultStyle = window.getComputedStyle(document.createElement('div'));
  //arr.unshift(defaultStyle);
  var res = Object.assign({}, defaultStyle);

  //var style=arr.reduce((style,nextClass)=>{
  //    return Object.assign({}, style, nextClass);
  //},res);

  Object.assign.apply(null, [this.style, res, ...arr])

  //this.style=Object.assign({}, style);
  return this;
}

function Page() {
 
  var exports, page = exports = ($selector)=>[...document.querySelectorAll($selector)];

  //private vars
  var p = {};
  //extended interface
  var i = page.action = {};
   


  var init = page.init = ()=>{
  
    p.basicStylesheets  = {
      default: {
        fontFamily: `-apple-system,BlinkMacSystemFont,'SF UI Text','Helvetica Neue','Roboto','Arial Nova','Segoe UI','Arial',sans-serif`,
        margin: 0,
        padding: 0
      },
      pframe: {
        //overflow: "hidden",
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0
      },
      frame: {
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "block",
        backgroundColor: "#334",
        transformOrigin: "top left",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      },
      v: {
        top: 0,
        left: 0,
        margin: 0,
        padding: 0
      }
    };
    //var parser = new DOMParser('text/html');
    var pframe = page.pframe = make({
      id: 'pframe'
    }).css([p.basicStylesheets.pframe]);
    
    var frame = page.frame = make({
      id: 'frame'
    }).css([p.basicStylesheets.frame]);
    
    p.log = LogView();
    i.log = (msg)=>{
      if (!msg) {
        console.log({
          elem,
          p,
          i
        });
      } else {
        p.log(msg)
        console.log(msg)
      }

    }
    page.mouse={
      x:0, 
      y:0, 
      get left(){ return this.x / page.pframe.clientWidth }, 
      get top(){ return this.y / page.pframe.clientHeight },
      onMouseMove(e){
        this.x=e.x;
        this.y=e.y;
        //console.log(this.left+" "+this.top);

      }
    }
    window.addEventListener('mousemove', (e)=>page.mouse.onMouseMove(e));
    
    p.mirrored = 1;
    p.scale = 1;
    p.isPanning = false;
    p.transformString = ()=>`translate(${(p.left*100)-50}%, ${(p.top*100)-50}%) scale(${p.mirrored * p.scale}, ${p.scale}`;
    p.onMouseMove=function() {
      if(p.isPanning) {
        p.left = page.mouse.left;
        p.top = page.mouse.top;
        page.pframe.style.transform=p.transformString();
      }
    }
    i.togglePan = () => {
      p.isPanning=!p.isPanning;
      i.log("panning:" + String(p.isPanning));
    }
    i.mirror = ()=>{
      p.mirrored = -1 * p.mirrored;
      var temp = p.transformString();
      page.pframe.style.transform = temp;
      if (p.mirrored == 1) {
        i.log('mirror off')
      } else {
        i.log('mirror on')
      }
    }
    i.zoomIn = ()=>{
      p.scale = (p.scale * 10 + 2) / 10;
      if (p.scale > 10) {
        p.scale = 10;
      }
      var temp = p.transformString();
      page.pframe.style.transform = temp;
      i.log('zoom:' + p.scale);
    }
    i.zoomOut = ()=>{
      p.scale = (p.scale * 10 - 2) / 10;
      if (p.scale <= 0) {
        p.scale = 0.2;
      }
      var temp = p.transformString();
      page.pframe.style.transform = temp;
      i.log('zoom:' + p.scale);
    }
    i.zoomReset = ()=>{
      p.scale = 1;
      p.left=0.5;
      p.top=0.5;
      page.pframe.style.transform = p.transformString();
      i.log('zoom:' + p.scale);
    }
    
    pframe.appendChild(frame);
    window.addEventListener('mousemove', (e)=>p.onMouseMove(e));
    
    css.call(document.body, [{
      margin: 0,
      padding: 0,
      backgroundColor: '#223',
      overflow: "hidden"
    }])
    document.body.appendChild(pframe);
    
    
    return page;
  }


  var loadScript = page.loadScript = (e='')=>{
    return new Promise((t,n)=>{
      var i='mk'+(e=>[...String(e)].reduce((e,t)=>e^=t.charCodeAt(0),255))(e);
      var r = document.querySelector('[src="' + e + '"]');
      r ? t() : ((r = document.createElement('script')).id = i,
      r.setAttribute('async', ''),
      r.addEventListener('load', e=>t()),
      r.addEventListener('error', e=>n()),
      r.src = e,
      (document.head || document.body || document.documentElement).appendChild(r))
    }
    );
  };

  
  var make = page.make = (attr={},tagName="div")=>{
    elem = Object.entries(attr).reduce((elem,[attrName,attrValue])=>{
      elem.setAttribute(attrName, attrValue);
      return elem;
    }
    , document.createElement(tagName));
    elem.defaultStyle = window.getComputedStyle(elem);
    elem.css = css

    

    return elem;
  }

    var {abs,min, max,random,floor,ceil,sin,cos,pow} = Math;

    var defer = exports.defer = Promise.defer = () => { var t={}; t.p = new Promise((resolve, reject)=>{t.resolve=resolve; t.reject=reject}); t.p.resolve=t.resolve; t.p.reject=t.reject; return t.p };

    var sleep = exports.sleep = (time,x) => { 
        time=time||1000; 
        var slp=(dx)=>new Promise(resolve=>setTimeout(()=>resolve(dx),time)); if(typeof(x)!="undefined") { return slp() } else { return slp }
    };

    //var srand = (strseed, {min:defaultMin, max:defaultMax, callback}) => { defaultMin = defaultMin || 0; defaultMax = defaultMax || 1; callback = callback || (x=>x); var str = String(strseed||(new Date())).split(""); var seed = 0xFF, multiplicate = 9301, add = 49297, modulo = 233280; for (var i = 0; i < str.length; i++) seed ^= str[i].charCodeAt(0); return (a, b) => { a = a || 1;  b = b || 0;if(a==b) { if(a==0) { return 0; }; }; var max = Math.max([a,b]); var min = Math.min([a,b]); seed = (seed * multiplicate + add) % modulo; return callback(min + (seed / modulo) * (max - min)); } };
    var round = exports.round = (number, precision) => { precision = precision || 0; var factor = 10 ** precision; return Math.round(parseFloat(number) * factor) / factor; };
    /*
    var rand = exports.rand = (a, b, cb=(x)=>Math.floor(x)) => () => {

        var min=Math.min(a,b),max=Math.max(a,b),diff=max-min;

        return cb((rand.gen.random()*diff)+min)

    };
    rand.gen = Math;
    rand.help = ` \\ var lib=require('ea-lib'); Object.assign(global,lib,lib.lib); rand.gen=seed('hello world'); var w4=rand(1,4); var mystiq=()=>[rand(1,10), rand(77,88), rand(1000,2000), rand(10,20)][w4()](); range(1,10).map(mystiq); `
    /*  */


    var xorString = exports.xorString = s => [...String(s)].reduce((prev, next) => prev ^= next.charCodeAt(0), 0xFF);

    var base=exports.base=(B)=>(...dx)=>{var arr=dx.map((v,i)=>[`${v}*(${B}^${(dx.length-1-i)})`, v*(2**(dx.length-1-i))]); console.log(` ${arr.map(x=>x[0]).join(" + ")} = `); return arr.map(x=>x[1]).reduce((a,b)=>a+b,0)}; 
    base.help = ` base(2)(1,0,0,1) -> `;

    var cmp = exports.cmp = function cmp(a, b) {
        return a - b;
    };
    cmp.locale = (a, b) => String(a).localeCompare(String(b));

    var range = exports.range = (a, b, step) => {
        //if only 1 paramter passsed, then a is the number of elements
        if (typeof (b) == "undefined") {
            a = a || 1;
            b = 1;
        } else {
            a = a || 0;
            b = b || 0;
        }
        step = step || 1;
        var xfactor = 1000;
        var start = min(a, b) * xfactor;
        var end = max(a, b) * xfactor;
        step *= xfactor;
        var len = abs(start - end) / step;
        var r = [];
        for (var i = 0; i <= len; i++) {
            r.push((start + abs(i * step)) / xfactor);
        }
        return r;
    };
  // for (var r = []; r.length <= abs(b-a); r.push(min(a, b)+r.length*abs(step||1))) return r; };
  var shuffle = exports.shuffle = function shuffle(o) {for(var j,x,i=o.length;i;j=Math.floor(Math.random()*i),x=o[--i],o[i]=o[j],o[j]=x);return o;};
  var map = exports.map = function map(arr, f) {
      arr = Array.from(arr);
      var xs = new Array(arr.length);
      for (var i = arr.length; i-- > 0;) xs[i] = f(arr[i]);
      return xs;
  };

  var objectify = exports.objectify = (keyCreator) => { keyCreator=keyCreator||((elem,index)=>index); var i=0; return (prev,next)=>((prev[keyCreator(next,i++)]=next,next),{}) };

  var zip=exports.zip=(...xs)=>xs[0].map((_,i)=>xs.map(x=>x[i]));

  var cartesian=exports.cartesian=(...N)=>N.reduce((A,B)=>[].concat.apply([],A.map(a=>B.map(b=>[a,b])))).map(n=>[].concat.apply([],n))
  cartesian.help=`var ABC=["A","B","C"], DEC=[1,2,3]; zip(ABC,DEC); // [['A',1],['A',2],['A',3],['B',1],['B',2],['B',3],['C',1],['C',2],['C',3]]`;


  var modulo = exports.modulo = (a, n) => ((a % n) + n) % n;

  var ns = exports.ns = (literal, val, target) => { target=target||{}; if(typeof(val)=="undefined") val={}; var last; var path=literal.split('.'); var final=path.pop(); path.reduce((prev, next) => (last = prev[next] = {}, prev[next] ), target);  last[final] = val; return target; };
  ns.help = `ns('net.irc.kamuela','whoop whoop') --> { net: { irc: { kamuela: 'whoop whoop' } } } // namespace `

  var compose = exports.compose=function(...fs){ return x=>fs.reduce((x,f)=>f(x),x); };
  compose.help = ` var compose=function(...fs){ return x=>fs.reduce((x,f)=>f(x),x); }, add=(n=0)=>x=>x+n, mul=(n=1)=>x=>x*n, pow=(n=0)=>x=>x**n, arr=[0,1,2,3,4], f=add(1), g=pow(2); [arr.map(f).map(g), arr.map(compose(f,g))] // ~> arr.map(x=>g(f(x))) `


  //var elementOf = exports.elementOf = (iterable,equals=((a,b)=>a==b)) => x => [...iterable].some(e=>equals(e,x));



  var elemOf=exports.elemOf=(A,equals=((a,b)=>a===b))=>x=>[...A].some(e=>equals(e,x));
  var uniq=exports.uniq=(I,equals=((a,b)=>a===b))=>[...I].reduce((A, x)=>((!A.some(e=>equals(e,x)) && A.push(x)),A),[]);


  //var uniq = exports.uniq = (arr,equals) => { equals=equals||((a,b)=>a==b); var stack=[]; arr.forEach(entry=>{ if(!stack.some(setItem=>equals(setItem,entry))) { stack.push(entry); }}); return stack; };  //uniq(array,equals); equals(a,b) equality predicate function | default: ((a,b) => a==b)
  //uniq.help = `uniq = (arr,equals) => { equals=equals||((a,b)=>a==b); var stack=[]; arr.forEach(entry=>{ if(!stack.some(setItem=>equals(setItem,entry))) { stack.push(entry); }}); return stack; };  //uniq(array,equals); equals(a,b) equality predicate function | default: ((a,b) => a==b)`;


  var or=exports.or=(filters)=>x=>[...filters].some(filter=>filter(x));
  var and=exports.and=(filters)=>x=>[...filters].every(filter=>filter(x));

  var intersect=exports.intersect=(A,B)=>uniq(A.concat(B)).filter(and([elemOf(A),elemOf(B)]));
  intersect.help=`n> var or=(filters)=>x=>[...filters].some(filter=>filter(x)), and=(filters)=>x=>[...filters].every(filter=>filter(x)), elemOf=(A,equals=((a,b)=>a===b))=>x=>[...A].some(e=>equals(e,x)), uniq=(iterable,elementOf)=>{ elementOf=elementOf||elemOf; return [...iterable].reduce((result, next)=>{ if(!elemOf(result)(next)) result.push(next); return result; },[]); }, intersect=(A,B)=>uniq(A.concat(B)).filter(and([elemOf(A),elemOf(B)])); intersect([2,3,5,7],[1,2,3])`


  var groupBy=exports.groupBy=function(fn){ return Array.from(new Set(this.map(fn))).reduce((obj,next)=>(obj[next]=this.filter(x=>fn(x)==next),obj),{}) };
  groupBy.help=`n> var firstLetter=x=>x.slice(0,1); function(fn){ return Array.from(new Set(this.map(fn))).reduce((obj,next)=>(obj[next]=this.filter(x=>fn(x)==next),obj),{}) };  groupBy.call(["watermelon","banana"],firstLetter); `

  /*

  // INTERSECTION Based on high order equality predicate function
  // ----
  n>or=(filters)=>x=>[...filters].some(filter=>filter(x)),and=(filters)=>x=>[...filters].every(filter=>filter(x)),elemOf=(A,equals=((a,b)=>a===b))=>x=>[...A].some(e=>equals(e,x)),uniq=(iterable,elementOf)=>{elementOf=elementOf||elemOf;return[...iterable].reduce((result, next)=>{ if(!elemOf(result)(next)) result.push(next); return result; },[]); };intersect=(A,B)=>uniq(A.concat(B)).filter(and([elemOf(A),elemOf(B)])); intersect([2,3,5,7],[1,2,3])

  /* 
  n>protochain=function*(e){for(;null!=e;e=Object.getPrototypeOf(e))yield e;}; entries=(o)=>[...protochain(o)].flatMap(o=>Object.getOwnPropertyNames(o).map(propertyName=>[propertyName, Object.getOwnPropertyDescriptor(o,propertyName)])); assign=(obj,[k,v])=>(typeof(obj.configurable=='bool')?Object.defineProperty(obj,k,v):obj[k]=v,obj); entries({x:23}).reduce(assign, {blah:199})
  */

  var protochain=exports.protochain=function*(obj) { while(obj!=null) { yield obj; obj=Object.getPrototypeOf(obj) }};
  var describe=exports.describe=(obj)=>[...protochain(obj)].map(o=>[o,Object.getOwnPropertyNames(o).map(k=>[k, Object.getOwnPropertyDescriptor(o,k)])]); 


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
  var linkedImages = page.linkedImages = (d)=>{
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
  })
  var dataUrlByFileReader = page.dataUrlByFileReader = (url)=>new Promise((resolve,reject)=>{
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
  })
  var readAsDataUrl = page.readAsDataUrl = async(media)=>{
    var img, dataUrl;
    if ("string" == typeof media) {
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
  };
  var download = page.download = async(image,name)=>{
    try {
      a = document.createElement('a');
      a.href = image.href || await readAsDataUrl(image);
      a.setAttribute('download', name);
      a.style.display = 'none';

      var parent = (document.body || document.documentElement);
      parent.appendChild(a);
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
  };
  var downloadImages = page.downloadImages = (w=250,h=250)=>embedImages(w, h).map((i)=>{
    var url = new URL(i.src);
    var name = [url.host].concat(i.alt ? i.alt.match(/\w+/g) : []).concat(url.pathname.match(/[^/\?]+/g)).filter(x=>!!x).join('-');
    return ()=>download(i.src, name);
  });
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
  })
  var loadImage = page.loadImage = (u)=>new Promise((resolve,reject)=>{
    var i = new Image();
    i.onload = (e)=>resolve(i);
    i.onerror = (e)=>{
      var a = document.createElement('a');
      a.target = 'imageview';
      a.href = u;
      a.innerText = u;
      resolve(a)
    }
    ;
    console.log('loadImage: ' + u)
    i.src = u;
  });
  var findImageLinks = page.findImageLinks = (extensions=['.jpg', '.png', '.jpeg', '.gif', '.tif', '.wbem']) =>
    [...document.querySelectorAll('a')]
      .map(a=>a.href)
      .filter(href=>extensions.some(ext=>ext == href.slice(-ext.length)));

  var prepend = page.prepend = (elem)=>(document.body || document.rootElement).prepend(elem);
  var loadImages = page.loadImages = (list)=>queue(list.map(u=>()=>loadImage(u).then((x)=>prepend(x))), 1)();
  var sine = x=>{
    //const B = 4/Math.PI;
    //const C = -4/(Math.PI*Math.PI)
    return sine.B * x * sine.C * x * Math.abs(x)
  }
  sine.B = 4 / Math.PI;
  sine.C = -4 / (Math.PI * Math.PI)
  var gen = page.gen = (min,max,steps)=>{
    var len = max - min;
    steps = steps || Math.floor(len);
    var step = len / steps;
    var arr = new Array(steps).fill(0);
    for (var k = 0, i = min * 1000; i < max * 1000; i += step * 1000) {
      arr[k++] = i / 1000;
    }
    return arr;
  }
  
  var paramSearch = page.paramSearch = (param='img_url') =>
    [...document.querySelectorAll(`[href*=page{param}]`)]
      .map(a=>a.href)
      .map(u=>(new URL(u)).searchParams.get(param))

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
      var rndhex = ()=>((Math.random() * (2 ** 24)) | 0).toString(16).padStart(7, '0').toUpperCase();
      var rndimg = ()=>`https://cdn5-images.motherlessmedia.com/images/page{rndhex()}.jpg`;
      loadImages([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(x=>rndimg()));
    } else {
      var html = xs.map(({id, img, thumb})=>`<a href="page{img}"><img src="page{thumb}"></img></a>`).join("");
      document.write(html);
    }
  }
  var asmhentai = page.asmhentai = ()=>{
    var rnd = (from=1,to=10000)=>from + ((Math.random() * (to - from)) >>> 0);
    var i = rnd();
    loadImages([1, 2, 3, 4, 5].map(x=>`https://cimg.asmhentai.com/001/page{i}/page{x}.jpg`))
  }

  
 

  

  Object.defineProperty(page, "help", { value: ()=>(new Map(Object.entries(page))) });
  console.log(page);


  return page.init();
}


//download max. 2 images concurrently
  //var queueImages = queue(downloadImages(60, 80), 2);
  //var queueLinkedImages = queue(downloadLinkedImages(), 2);

  //queueImages();

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
