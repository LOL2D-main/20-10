// Overrides added to perform site text replacements and remove shop UI.
// This file intentionally keeps changes separate from the large original script.js
// so it's easier to review and revert.
(function(){
  'use strict';

  // Replace visible text nodes (runtime) for requested strings.
  function replaceTextNodeStrings(root){
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, null, false);
    const repls = [
      [/Cậu tớ/g, 'Em và Anh'],
      [/cậu tớ/g, 'em và anh'],
      [/DaLabs/g, 'LazyBucket'],
      [/dalabs/g, 'lazybucket']
    ];
    let n;
    while(n = walker.nextNode()){
      let v = n.nodeValue;
      let nv = v;
      for (const [rx, to] of repls) nv = nv.replace(rx, to);
      if(nv !== v) n.nodeValue = nv;
    }
  }

  function removeShopUI(){
    try{
      const selectors = [
        '#tiny-shop-scene',
        '#shop-tiny-host',
        '#shop-flying-butterfly',
        '#shop-coming-note',
        '#shop-product-modal',
        '#shop-modal-thumb',
        '#shop-modal-kicker',
        '#shop-modal-title',
        '#shop-modal-price',
        '#shop-modal-random',
        '#shop-modal-buy',
        '#shop-magical-field',
        '.shop-product',
        '.shop-visible',
        '.shop-modal-active',
        '.shop-tracking',
        '.shop-blinking'
      ];
      selectors.forEach(sel=>{document.querySelectorAll(sel).forEach(el=>el.remove());});
    }catch(e){console.error('removeShopUI',e)}

    try{
      // Neutralize known globals used for shop behavior if present.
      const names = ['openShops','openProductModal','closeProductModal','shopIsInteractive','nextButterfly','flyButterfly'];
      for(const n of names){
        try{ if(window[n]) window[n] = function(){}; }catch(e){}
      }
    }catch(e){/* ignore */}
  }

  function disableShopClicks(){
    // Prevent any future click handler from opening the shop by intercepting clicks on document.
    document.addEventListener('click', function ev(e){
      // If target is within a removed shop node, stop propagation.
      if (e.target && e.target.closest && e.target.closest('#tiny-shop-scene, #shop-tiny-host, #shop-product-modal, .shop-product')) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);
  }

  function runNow(){
    replaceTextNodeStrings(document.body);
    removeShopUI();
    disableShopClicks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runNow);
  else runNow();

  // Also observe for DOM changes to catch text inserted later.
  try{
    const obs = new MutationObserver((mutations)=>{
      for(const m of mutations){
        if(m.type === 'childList'){
          for(const n of m.addedNodes){
            if(n.nodeType === 1) replaceTextNodeStrings(n);
          }
        } else if (m.type === 'characterData'){
          replaceTextNodeStrings(m.target.parentNode || document.body);
        }
      }
    });
    obs.observe(document.documentElement || document.body, { childList: true, subtree: true, characterData: true });
  }catch(e){/* ignore */}

})();
