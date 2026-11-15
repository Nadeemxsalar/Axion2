# index.html ko PWA version mein badalta hai. Backup: index.old.html
# Chalao:  python patch_index.py        (index.html isi folder mein ho)
import shutil, sys
f = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
s = open(f, encoding='utf-8').read()
if 'media.js' in s:
    sys.exit('Pehle se patched hai')
def rep(old, new):
    global s
    if s.count(old) != 1:
        sys.exit('Ye line nahi mili (ya 1 se zyada baar hai): ' + old[:70])
    s = s.replace(old, new)
rep('<meta name="theme-color" content="#eef1f8">',
    '<meta name="theme-color" content="#eef1f8">\n<link rel="manifest" href="/manifest.webmanifest">\n<link rel="apple-touch-icon" href="/icon-192.png">\n<meta name="mobile-web-app-capable" content="yes">\n<script src="/media.js"></script>')
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js"></script>\n', '')
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.7.4/dash.all.min.js"></script>\n', '')
rep("function load(url,t=0,auto=true,type=''){",
    "function load(url,t=0,auto=true,type=''){\n if(window.axLazy&&axLazy(url,()=>load(url,t,auto,type)))return;")
shutil.copy(f, 'index.old.html')
open(f, 'w', encoding='utf-8').write(s)
print('Done: ' + f + ' patched. Backup: index.old.html')