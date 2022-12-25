/* Rising Hearts (by PremiumCoding, Valerie Desumo)
    Animates hearts rising across the page
*/

$(function() {
 // Customisable parameters
 var fps = 15,		  // Frames per second
     numberOfHearts = 30, // Number of hearts
     rotationTrue = 1,	  // If hearts should rotate
     rotation = 1,	  // Rotation speed boost
     size = 40,		  // General size of hearts, final size is calculated randomly
     speedC = 1.5,	  // Speed of hearts
     zIndex = 2;	  // CSS stacking order

 // Heart file paths
 var heartTypes = new Array(
  "effect_heart1.png",
  "effect_heart2.png",
  "effect_heart3.png");

 // Initialise variables
 var Ypos = [],
     Xpos = [],
     Speed = [],
     CStrafe = [],
     Strafe = [],
     rotationAll = [],
     height = [],
     width = [],
     opacityHeart = [],
     WinHeight = $(window).height(),
     WinWidth  = $(window).width();

  // Rotation as jQuery animation
  $.fx.step.rotate3Di = function(fx) {
   var direction = (fx.now < 0 ? -1 : 1),
       degrees = (Math.floor(Math.abs(fx.now))) % 360,
       scale = (1 - (degrees % 180) / 90) * (degrees >= 180 ? -1 : 1);
   $(fx.elem).css('transform', 'skewY(' + direction*degrees + 'deg) scale(' + scale + ', 1)');
  };

 // Generate hearts
 for (var i = 0; i < numberOfHearts; i++) {
  // Which heart is going to be used
  var rndHeart = heartTypes[Math.floor(Math.random()*heartTypes.length)];

  // Randomise heart parameters
  height[i] = Math.round(Math.random()*size+20);
  width[i]  = Math.round(Math.random()*size+20);
  if (width[i] > height[i]*1.5 || height[i] > width[i]*1.5) {
   width[i] = height[i];
  }
  Ypos[i] = WinHeight + Math.random() * 500 + 40;
  Xpos[i] = Math.round(Math.random()*(WinWidth)-width[i]*3);
  opacityHeart[i] = 0.3;
  Speed[i] = Math.random() * speedC + 2;
  rotationAll[i] = Math.round(Math.random()) * rotation + Speed[i];
  CStrafe[i] = 0;
  // Strength of right/left strafe
  Strafe[i] = Math.random() * 0.06 + 0.05;

  // Assign heart CSS
  var heart = document.createElement('img');
  heart.id = 'hearts' + i;
  heart.src = rndHeart;
  heart.style.backgroundColor = 'none';
  heart.style.height = height[i] + 'px';
  heart.style.left = Xpos[i] + 'px';
  heart.style.opacity = opacityHeart[i];
  heart.style.position = 'absolute';
  heart.style.top = Ypos[i] + 'px';
  heart.style.width = width[i] + 'px';
  heart.style.zIndex = zIndex;
  document.body.appendChild(heart);
 }

 // Main function
 setInterval(function() {
  for (i = 0; i < numberOfHearts; i++) {
   var strafey = Speed[i] * Math.sin(90*Math.PI/180),
       strafex = Speed[i] * 0.5 * Math.cos(CStrafe[i]);
   Ypos[i] -= strafey;
   Xpos[i] += strafex;
   CStrafe[i] += Strafe[i];
   rotationAll[i] += rotation+Speed[i];

   // Setting opacity
   if (Ypos[i] > WinHeight) {
    opacityHeart[i] = 1;
    $("#hearts"+i).css({opacity:opacityHeart[i]});
   }

   // Hearts slowly disappearing at the top of browser window
   if (Ypos[i] < height[i] * 1.5) {
    opacityHeart[i] -= 0.05;
    $("#hearts"+i).css({opacity:opacityHeart[i]});
   }

   // When hearts reach certain browser height they are transported back to the begining
   if (Ypos[i] < -50) {
    Ypos[i] = WinHeight + 50;
    Xpos[i] = Math.round(Math.random()*WinWidth-width[i]*4);
    Speed[i] = Math.random() * speedC + 2;
   }

   // Rotation
   if (rotationTrue === 1) {
    $("#hearts"+i).css({top: Ypos[i], left: Xpos[i]});
    $("#hearts"+i).animate({rotate3Di: rotationAll[i]}, {duration: 0});
   } else if (rotationTrue === 0) {
    $("#hearts"+i).css({top: Ypos[i], left: Xpos[i]});
   }
  }
 }, 1000/fps);
});