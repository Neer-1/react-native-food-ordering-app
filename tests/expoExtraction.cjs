const fs=require('fs'), path=require('path'), assert=require('assert/strict');
const {createRequire}=require('module');
const root=path.resolve(process.argv[2]), fixtures=path.resolve(process.argv[3]);
fs.mkdirSync(fixtures,{recursive:true});
const nm=path.join(root,'node_modules');
const cliRequire=createRequire(path.join(nm,'@expo/cli/package.json'));
const cacheRequire=createRequire(cliRequire.resolve('cacache/package.json'));
function version(req,name){let p=req.resolve(name);while(true){const f=path.join(p,'package.json');if(fs.existsSync(f)){const j=JSON.parse(fs.readFileSync(f));if(j.name===name && j.version)return j.version;}const next=path.dirname(p);if(next===p)throw Error('Package metadata not found');p=next;}}
(async()=>{
 const output={node:process.version,tar:{},tests:[]};
 for(const [label,req] of [['cli',cliRequire],['cacache',cacheRequire]]){
  const tar=req('tar');output.tar[label]=version(req,'tar');
  const work=path.join(fixtures,label);fs.mkdirSync(work,{recursive:true});const input=path.join(work,'input');fs.mkdirSync(path.join(input,'nested'),{recursive:true});fs.writeFileSync(path.join(input,'hello.txt'),'synthetic hello\n');fs.writeFileSync(path.join(input,'nested','data.txt'),'safe data\n');
  const archive=path.join(work,'sample.tgz');await tar.create({cwd:input,file:archive,gzip:true},['hello.txt','nested/data.txt']);
  const entries=[];await tar.list({file:archive,onentry:e=>entries.push(e.path)});assert.deepEqual(entries.sort(),['hello.txt','nested/data.txt']);
  for(const [mode,extract] of [['api',async dest=>tar.extract({file:archive,cwd:dest})],['expo',async dest=>require(path.join(nm,'@expo/cli/build/src/utils/tar.js')).extractAsync(archive,dest)]]){
   const dest=path.join(work,mode);fs.mkdirSync(dest);try { await extract(dest);
   assert.equal(fs.readFileSync(path.join(dest,'hello.txt'),'utf8'),'synthetic hello\n');assert.equal(fs.readFileSync(path.join(dest,'nested/data.txt'),'utf8'),'safe data\n');assert.deepEqual(fs.readdirSync(dest).sort(),['hello.txt','nested']);
   assert.ok(fs.statSync(path.join(dest,'hello.txt')).isFile());
   output.tests.push(`${label}: create/list/${mode} extraction passed`);
   } catch(error) { output.tests.push(`${label}: ${mode} FAILED: ${error.message}`); output.failed=true; }
  }
 }
 const cache=cliRequire('cacache'),cachePath=path.join(fixtures,'cache');await cache.put(cachePath,'synthetic-key','synthetic cache');assert.equal((await cache.get(cachePath,'synthetic-key')).data.toString(),'synthetic cache');await cache.verify(cachePath);output.tests.push('cacache put/get/verify passed');
 console.log(JSON.stringify(output,null,2));if(output.failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
