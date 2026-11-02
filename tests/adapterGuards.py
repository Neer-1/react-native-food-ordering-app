from pathlib import Path
import json,shutil,subprocess,sys,hashlib
p=Path(sys.argv[1]).resolve();b=Path(sys.argv[2]).resolve();b.mkdir(parents=True,exist_ok=False);tests=[]
for name,module,version,target in [('cli','@expo/cli','0.22.28','build/src/utils/tar.js'),('metro','metro','0.81.5','src/Assets.js')]:
 script=p/'tools'/('apply_adapter.py' if name=='cli' else 'apply_metro_adapter.py')
 for fault in ['version','hash']:
  root=b/('guard-'+name+'-'+fault);pkg=root/'node_modules'/module;(pkg/target).parent.mkdir(parents=True)
  (pkg/'package.json').write_text(json.dumps({'version':'99.0.0' if fault=='version' else version}))
  raw=(p/'node_modules'/module/target).read_bytes();(pkg/target).write_bytes(raw+(b'\n// drift' if fault=='hash' else b''));before=(pkg/target).read_bytes()
  # -O confirms rejection does not depend on Python assert statements.
  result=subprocess.run([sys.executable,'-B','-O',str(script),str(root)],capture_output=True,text=True)
  if result.returncode==0 or (pkg/target).read_bytes()!=before:raise RuntimeError('Guard did not fail closed')
  tests.append(name+' '+fault+' rejected without writes')
print(json.dumps({'tests':tests,'passed':len(tests)},indent=2))
