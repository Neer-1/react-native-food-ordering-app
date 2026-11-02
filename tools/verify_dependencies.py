"""Verify the reviewed lock and installed package versions before explicit patching."""
import hashlib,json,sys
from pathlib import Path
from apply_adapter import BEFORE, AFTER
EXPECTED_LOCK = 'ac986658915cef227ae492b40d96f9a80e164e9a1d4279c51d28f19d78d7baab'
EXPECTED = {'expo': '52.0.49', 'react-native': '0.76.9', '@expo/cli': '0.22.28', 'cacache': '18.0.4', 'postcss': '8.5.32', 'tar': '7.5.22', 'expo-asset': '11.0.5', 'expo-font': '13.0.4', 'metro': '0.81.5', '@xmldom/xmldom': '0.8.15', 'image-size': '2.0.4'}
def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def verify(root):
    lock=root/'package-lock.json'
    if hashlib.sha256(lock.read_bytes()).hexdigest()!=EXPECTED_LOCK: raise ValueError('Unreviewed lockfile; refusing validation')
    for name,version in EXPECTED.items():
        if read(root/'node_modules'/name/'package.json')['version']!=version: raise ValueError('Unexpected installed '+name)
    checked=0
    for relative,pkg in read(lock)['packages'].items():
        if not relative or pkg.get('link'): continue
        file=root/relative/'package.json'
        if not file.exists():
            if pkg.get('optional'): continue
            raise ValueError('Missing required package: '+relative)
        if read(file).get('version')!=pkg.get('version'): raise ValueError('Version mismatch: '+relative)
        checked+=1
    wrapper=root/'node_modules/@expo/cli/build/src/utils/tar.js'
    if hashlib.sha256(wrapper.read_bytes()).hexdigest() not in (BEFORE,AFTER): raise ValueError('Unexpected CLI source hash')
    from apply_metro_adapter import BEFORE as METRO_BEFORE, AFTER as METRO_AFTER
    if hashlib.sha256((root/'node_modules/metro/src/Assets.js').read_bytes()).hexdigest() not in (METRO_BEFORE,METRO_AFTER): raise ValueError('Unexpected Metro source hash')
    print('Verified locked versions and wrapper hash; installed entries:',checked)
if __name__=='__main__': verify(Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve())
