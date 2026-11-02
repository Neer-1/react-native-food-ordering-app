"""Original geometric Foodies illustrations. No original images read or traced.
Pillow is needed only to regenerate assets; the app uses bundled output.
"""
import argparse
import hashlib
import json
from pathlib import Path
import random
from PIL import Image, ImageDraw, ImageOps


def draw_art(name):
    im=Image.new('RGB',(512,512),(248,244,232));d=ImageDraw.Draw(im)
    rng=random.Random(int(hashlib.sha256(name.encode()).hexdigest()[:16],16))
    green='#2E644C';gold='#E6AC52';red='#CA6149';brown='#784832'
    d.ellipse((48,58,464,474),fill='#E7EBD8')
    d.ellipse((78,92,434,448),fill='#FFFCF2',outline='#C6CFB6',width=5)
    n=name.lower()
    def burger(cx=256,cy=260,z=1):
        def box(a,b,c,e):return (cx+(a-256)*z,cy+(b-260)*z,cx+(c-256)*z,cy+(e-260)*z)
        d.pieslice(box(133,143,379,325),180,360,fill=gold)
        for rect,color in [((133,249,379,274),green),((140,276,372,297),red),((139,302,373,334),brown),((138,340,374,376),gold)]:d.rounded_rectangle(box(*rect),radius=12,fill=color)
        for x,y in [(185,213),(224,185),(265,204),(306,189),(329,222)]:d.ellipse(box(x,y,x+12,y+5),fill='#FFF2C6')
    def cup(cx=260,cy=270,z=1):
        d.polygon([(cx-72*z,cy-75*z),(cx+72*z,cy-75*z),(cx+54*z,cy+110*z),(cx-54*z,cy+110*z)],fill=red)
        d.ellipse((cx-72*z,cy-86*z,cx+72*z,cy-63*z),fill='#F6D9AE')
        d.line((cx+12*z,cy-65*z,cx+36*z,cy-155*z),fill=green,width=max(3,int(12*z)))
        d.arc((cx-38*z,cy-3*z,cx+38*z,cy+68*z),0,350,fill='#FFF8DC',width=max(3,int(6*z)))
    if any(t in n for t in ['icon.png','favicon','adaptive-icon','splash-icon']):
        d.ellipse((136,142,376,382),fill=green);d.ellipse((177,183,335,341),outline='#FFF7DB',width=10)
        d.line((112,175,112,355),fill=green,width=10)
        for x in [94,112,130]:d.line((x,166,x,220),fill=green,width=7)
        d.arc((94,202,130,242),0,180,fill=green,width=7);d.line((400,223,400,355),fill=green,width=10);d.ellipse((382,165,418,239),fill=green)
    elif 'pizza' in n:
        for rect,color in [((131,140,381,390),gold),((148,157,364,373),red),((159,168,353,362),'#F6D98B')]:d.ellipse(rect,fill=color)
        for _ in range(12):
            x=rng.randint(182,325);y=rng.randint(190,337);d.ellipse((x-12,y-12,x+12,y+12),fill=rng.choice([green,red]))
        d.line((256,148,256,383),fill='#CB9755',width=3);d.line((141,265,374,265),fill='#CB9755',width=3)
    elif 'combo' in n or 'meal' in n:burger(227,272,.73);cup(358,238,.55)
    elif 'salad' in n or 'tofu' in n:
        for _ in range(28):
            x=rng.randint(155,330);y=rng.randint(175,322);d.ellipse((x-18,y-11,x+28,y+22),fill=rng.choice([green,'#77A55C','#A8BD64','#E0B14C',red]))
        d.pieslice((120,204,392,418),0,180,fill=green);d.line((125,308,387,308),fill='#BFD3AA',width=9)
    elif 'wrap' in n or 'sandwich' in n:
        d.polygon([(143,211),(292,143),(380,302),(219,375)],fill='#EBC88C',outline=brown,width=4)
        for offset in [0,34,68]:d.line((179+offset,206-offset//2,253+offset,342-offset//2),fill='#C48A4B',width=7)
        d.ellipse((150,184,253,268),fill=green)
        for x,y in [(175,210),(207,222),(226,205)]:d.ellipse((x,y,x+16,y+18),fill=red)
    elif any(t in n for t in ['fries','sides','rings','sticks']):
        for x in range(160,350,28):d.rounded_rectangle((x,rng.randint(154,202),x+19,324),radius=5,fill=gold)
        d.polygon([(149,257),(363,257),(340,384),(171,384)],fill=red);d.ellipse((224,295,290,350),outline='#FFF2D5',width=5)
    elif any(t in n for t in ['drink','tea','juice','milkshake','water']):cup()
    elif any(t in n for t in ['dessert','pie','cake','brownie','donut','icecream']):
        d.polygon([(151,342),(151,229),(337,168),(370,342)],fill=gold)
        d.polygon([(151,229),(337,168),(370,213),(181,278)],fill='#F3D8C7')
        d.polygon([(181,278),(370,213),(370,257),(181,321)],fill=brown)
        d.line((150,347,380,347),fill=green,width=7);d.ellipse((292,159,325,190),fill=red)
    else:burger()
    return im


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);root=parser.parse_args().root.resolve()
    plan=json.loads(Path(__file__).with_name('asset-plan.json').read_text())
    for row in plan:
        dest=(root/row['path']).resolve()
        if root not in dest.parents or not row['path'].startswith('assets/'):raise ValueError('Unsafe asset path')
        dest.parent.mkdir(parents=True,exist_ok=True)
        canvas=Image.new('RGB',tuple(row['size']),(248,244,232));drawing=ImageOps.contain(draw_art(row['path']),tuple(row['size']),Image.Resampling.LANCZOS)
        canvas.paste(drawing,((canvas.width-drawing.width)//2,(canvas.height-drawing.height)//2))
        if dest.suffix.lower() in ['.jpg','.jpeg']:canvas.save(dest,format='JPEG',quality=90,optimize=True)
        else:canvas.save(dest,format='PNG',optimize=True)
    print(f'Drew {len(plan)} geometric assets without reading source images.')

if __name__=='__main__':main()
