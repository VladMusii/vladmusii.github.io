var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  }, numParticles = 450,
    snoverlay = document.createElement('div'),
    snow,  snowContainer, snowSVG,
snowTl
    

TweenMax.set('svg', {
  visibility: 'visible'
})

document.body.appendChild(snoverlay);
snoverlay.innerHTML = '<svg class="snowSVG"  width="100%" height="100%"  xmlns="http://www.w3.org/2000/svg"> <defs> <circle class="snowParticle" cx="0" cy="0" r="0" fill="#FFF"/> </defs> <g class="snowContainer"/></svg>';

TweenMax.set(snoverlay, {
 position:'fixed',
 width:'100%',
 height:'100%',
 zIndex:99997
})


function makeSnow(){
  snow = select('.snowParticle'),
    snowContainer = select('.snowContainer'),
    snowSVG = select('.snowSVG');
 
 var i = numParticles, r, dot, dur, posX, posY, originX;
 
 
 while(--i > -1){
  dot = snow.cloneNode(true);
  snowContainer.appendChild(dot);  
 }
 
 
TweenMax.staggerTo('.snowParticle',0, {
  cycle:{
   attr:function(){
     return {cx:randomBetween(-window.innerWidth, window.innerWidth), cy:randomBetween(-26, -16), r:randomBetween(8, 23)/10}
        },
   //vortex!
   /* duration:function(i){
    return randomBetween(1, 30)/10;
   } */
   fill:['#FFF', '#F8F8F8', '#F1F1F1']
  }

 },0)
 
startSnow();
}

function startSnow(){
snowTl = new TimelineMax();
    snowTl.staggerTo('.snowParticle', 8, {
   cycle:{
    
    y:function(i){
     return randomBetween(window.innerHeight+50, window.innerHeight+100 )
    },
    duration:function(){
     //console.log(this.getAttribute('r'))
     return 10- (this.getAttribute('r'))
    },
    rotation:function(){
     return randomBetween(360, 720)
    },
    transformOrigin:['120% -100%','-120% 1000%','20% -10%', '-200% 50%', '-200% -400%', '-180% -300%', '50% 250%' ]
   }, 
   repeat:-1,
   ease:Linear.easeNone
  },0.1)

snowTl.seek(200)
 
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}  

makeSnow();
snowTl.timeScale(0.75)