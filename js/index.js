var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
    allStars = selectAll('.stars use')
  

TweenMax.set('svg', {
  visibility: 'visible'
})

var mainTl = new TimelineMax();
var linesTl = new TimelineMax({repeat:-1});
var foamTl = new TimelineMax({repeat:-1}).seek(100)
var starsTl = new TimelineMax({repeat:-1}).seek(100)
linesTl.to('.rainbowLines path', 0.4, {
 strokeDashoffset:'+=145',
 ease:Linear.easeNone
})

starsTl.staggerTo(allStars,0,{
 cycle:{
  rotation:[23, 45, -12, 90, 120,6],
  svgOrigin:function(i){
  return (Number(allStars[i].getAttribute('x'))+6) + ' ' + (Number(allStars[i].getAttribute('y'))+6)
  }
 },
 
},0)
 .staggerFromTo(allStars, 0.123, {
 scale:0
}, {
 scale:1.32,
 repeat:-1,
 cycle:{
  repeatDelay:[0.0151, 0.01,0.0422,0.123, 0.025, 0.084]
 },

 yoyo:true,
 ease:SteppedEase.config(6)
},0.2)

foamTl.staggerTo('.foamGroup *', 0.1, {
 
 cycle:{
  y:['+=5', '+=8', '+=6', '+=8', '+=2' ],
  //duration:[0.2, 0.1,0.2,0.3, 0.077]
 },
 repeat:-1,
 yoyo:true,
 ease:SteppedEase.config(3)
},0.25)

mainTl.add(linesTl, 0);
//ScrubGSAPTimeline(mainTl);