"""Explicit, guarded Metro namespace/path compatibility adapter. No lifecycle hook."""
from pathlib import Path
import hashlib,json,sys
BEFORE='afb0698f853774aa7a6274eeb50c3283c56c6ada7aeb799e6cae19dd7d43ce2b'
AFTER='cb1805ca5066e7c859e3e819cd5d97e94f879682ae9aaa923fa1ba2bb423f92a'
OLD=b'const getImageSize = require("image-size");'
NEW=b'const { imageSize } = require("image-size");\nconst getImageSize = (input) => imageSize(typeof input === "string" ? fs.readFileSync(input) : input);'
def patch_bytes(raw):
    digest=hashlib.sha256(raw).hexdigest()
    if digest==AFTER:return raw
    if digest!=BEFORE or raw.count(OLD)!=1:raise ValueError('Unexpected Metro source; refusing patch')
    result=raw.replace(OLD,NEW)
    if hashlib.sha256(result).hexdigest()!=AFTER:raise ValueError('Unexpected patched hash')
    return result

def main():
    root=Path(sys.argv[1]).resolve();metro=root/'node_modules/metro'
    if json.loads((metro/'package.json').read_text())['version']!='0.81.5':raise ValueError('Expected exact Metro 0.81.5')
    target=metro/'src/Assets.js';target.write_bytes(patch_bytes(target.read_bytes()))
    print('Verified Metro adapter applied (or already present)')
if __name__=='__main__':main()
