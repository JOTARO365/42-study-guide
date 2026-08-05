const http=require("http"),fs=require("fs"),path=require("path");
const root=__dirname, port=8042;
const mt={".html":"text/html",".js":"application/javascript",".css":"text/css",".map":"application/json"};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split("?")[0]); if(p==="/")p="/index.html";
  const fp=path.join(root,p);
  if(!fp.startsWith(root)){res.writeHead(403);return res.end();}
  fs.readFile(fp,(e,d)=>{
    if(e){res.writeHead(404);return res.end("404");}
    res.writeHead(200,{"Content-Type":(mt[path.extname(fp)]||"application/octet-stream")+"; charset=utf-8"});
    res.end(d);
  });
}).listen(port,()=>console.log("serving "+root+" at http://localhost:"+port));
