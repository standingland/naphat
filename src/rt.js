(function(){
function get(s,e){var v=s;e.split('.').forEach(function(k){v=v==null?'':v[k];});return v;}
var H=[];
function holes(s,sc){return s.replace(/\{\{([\w.]+)\}\}/g,function(m,e){var v=get(sc,e);return(typeof v==='function'||v==null)?'':String(v);});}
function expand(s,sc){
s=s.replace(/<sc-for list="\{\{([\w.]+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g,function(m,l,as,b){return(get(sc,l)||[]).map(function(it){var n=Object.assign({},sc);n[as]=it;return expand(b,n);}).join('');});
s=s.replace(/<sc-if value="\{\{([\w.]+)\}\}"[^>]*>([\s\S]*?)<\/sc-if>/g,function(m,e,b){return get(sc,e)?expand(b,sc):'';});
s=s.replace(/onclick="\{\{([\w.]+)\}\}"/gi,function(m,e){var f=get(sc,e);if(typeof f!=='function')return'';H.push(f);return'data-h="'+(H.length-1)+'"';});
return holes(s,sc);}
function DCLogic(p){this.props=p||{};this.state={};}
DCLogic.prototype.setState=function(o){Object.assign(this.state,o);render();};
var app=document.getElementById('app'),tpl=document.getElementById('t').innerHTML,inst;
var Comp=new Function('DCLogic',document.getElementById('c').textContent+'\nreturn Component;')(DCLogic);
function render(){
var keep={},ae=document.activeElement,ah=ae&&ae.getAttribute&&ae.getAttribute('data-h');
app.querySelectorAll('[id]').forEach(function(el){if('value'in el)keep[el.id]=el.value;});
H=[];app.innerHTML=expand(tpl,inst.renderVals());
Object.keys(keep).forEach(function(id){var el=document.getElementById(id);if(el)el.value=keep[id];});
if(ah!=null){var n=app.querySelector('[data-h="'+ah+'"]');if(n)n.focus();}
}
inst=new Comp({});
app.addEventListener('click',function(e){var t=e.target.closest('[data-h]');if(t&&H[t.getAttribute('data-h')])H[t.getAttribute('data-h')]();});
render();
})();