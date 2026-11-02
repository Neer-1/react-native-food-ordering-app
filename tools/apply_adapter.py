"""Explicit opt-in compatibility patch; no npm lifecycle hook. Fail closed on drift."""
import hashlib,json,sys
from pathlib import Path
BEFORE = '2f673a6bbba4ee208e478024c6ef4d73f727e7d9243356336bb69d80d53df7bb'
AFTER = 'b844cbba7fd98b1cd7e50b925a922ea712bbb1984985caca9f78f0d402514a37'
OLD = b'const data = /*#__PURE__*/ _interopRequireDefault(require("tar"));'
NEW = b'const data = { default: require("tar") };'

def patch_bytes(raw):
    digest=hashlib.sha256(raw).hexdigest()
    if digest==AFTER:return raw
    if digest!=BEFORE or raw.count(OLD)!=1:raise ValueError('Unexpected Expo CLI wrapper; refusing patch')
    result=raw.replace(OLD,NEW)
    if hashlib.sha256(result).hexdigest()!=AFTER:raise ValueError('Patch checksum mismatch')
    return result

def main():
    root=Path(sys.argv[1]).resolve()
    package=root/'node_modules/@expo/cli'
    if json.loads((package/'package.json').read_text())['version']!='0.22.28':raise ValueError('Expected exact @expo/cli 0.22.28')
    target=package/'build/src/utils/tar.js'
    target.write_bytes(patch_bytes(target.read_bytes()))
    print('Verified narrow adapter applied (or already present)')
if __name__=='__main__':main()
