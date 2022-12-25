/* Falling Leaves (by PremiumCoding)
    Animates leaves falling across the page
*/

$(function() {
 // Customisable parameters
 var fps = 45,            // Frames per second
     numberOfLeaves = 30, // Number of leaves
     rotationTrue = 1,    // If leaves should rotate
     rotation = 1,        // Rotation speed boost
     size = 40,           // General size of leaves, final size is calculated randomly
     speedC = 0.7,        // Range of speed of leaves
     minSpeed = 0.5,      // Minimum leaf speed
     zIndex = 2;          // CSS stacking order

 // Leaf file paths
 var leafTypes = new Array(
  "img/effect_leaf1.png",  // Maple
  "img/effect_leaf2.png",  // Saw
  "img/effect_leaf3.png"); // Normal

 // Initialise variables
 var Ypos = [],
     Xpos = [],
     Speed = [],
     CStrafe = [],
     Strafe = [],
     rotationAll = [],
     height = [],
     width = [],
     opacityLeaf = [],
     WinHeight = $(window).height(),
     WinWidth  = $(window).width();

  // Rotation as jQuery animation
  $.fx.step.rotate3Di = function(fx) {
   var direction = (fx.now < 0 ? -1 : 1),
       degrees = (Math.floor(Math.abs(fx.now))) % 360,
       scale = (1 - (degrees % 180) / 90) * (degrees >= 180 ? -1 : 1);
   $(fx.elem).css('transform', 'skewY(' + direction*degrees + 'deg) scale(' + scale + ', 1)');
  };

 // Generate leaves
 for (var i = 0; i < numberOfLeaves; i++) {
  // Which leaf is going to be used
  var rndLeaf = leafTypes[Math.floor(Math.random()*leafTypes.length)];

  // Randomise leaf parameters
  height[i] = Math.round(Math.random()*size+20);
  width[i]  = Math.round(Math.random()*size+20);
  if (width[i] > height[i]*1.5 || height[i] > width[i]*1.5) {
   width[i] = height[i];
  }
  Ypos[i] = -Math.random() * 1200 - 40;
  Xpos[i] = Math.round(Math.random()*(WinWidth)-width[i]*3);
  opacityLeaf[i] = 0.3;
  Speed[i] = Math.random() * speedC + minSpeed;
  rotationAll[i] = Math.round(Math.random()) * rotation + Speed[i];
  CStrafe[i] = 0;
  // Strength of right/left strafe
  Strafe[i] = Math.random() * 0.06 + 0.05;

  // Assign leaf CSS
  var leaf = document.createElement('img');
  leaf.id = 'leaves' + i;
  leaf.src = rndLeaf;
  leaf.style.backgroundColor = 'none';
  leaf.style.height = height[i] + 'px';
  leaf.style.left = Xpos[i] + 'px';
  leaf.style.opacity = opacityLeaf[i];
  leaf.style.position = 'absolute';
  leaf.style.top = Ypos[i] + 'px';
  leaf.style.width = width[i] + 'px';
  leaf.style.zIndex = zIndex;
  document.body.appendChild(leaf);
 }
 
 // Fix browser overflow only if debug text isn't present (maintains CSS consistency)
 if(document.getElementsByTagName("pre").length == 0) {
  document.body.style.overflowY = "hidden";
 }

 // Main function
 setInterval(function() {
  for (i = 0; i < numberOfLeaves; i++) {
   var strafey = Speed[i] * Math.sin(90*Math.PI/180),
       strafex = Speed[i] * Math.cos(CStrafe[i]);
   Ypos[i] += strafey;
   Xpos[i] += strafex;
   CStrafe[i] += Strafe[i];
   rotationAll[i] += rotation+Speed[i];

   // Setting opacity
   if (Ypos[i] < 0) {
    opacityLeaf[i] = 1;
    $("#leaves"+i).css({opacity:opacityLeaf[i]});
   }

   // Leaves slowly disappearing at the bottom of browser window
   if (Ypos[i] > WinHeight - height[i] * 3) {
    opacityLeaf[i] -= 0.05;
    $("#leaves"+i).css({opacity:opacityLeaf[i]});
   }

   // When leaves reach certain browser height they are transported back to the beginning
   if (Ypos[i] > WinHeight - (width[i] + height[i]/2)) {
    Ypos[i] = -50;
    Xpos[i] = Math.round(Math.random()*WinWidth-width[i]*4);
    Speed[i] = Math.random() * speedC + minSpeed;
   }

   // Rotation
   if (rotationTrue === 1) {
    $("#leaves"+i).css({top: Ypos[i], left: Xpos[i]});
    $("#leaves"+i).animate({rotate3Di: rotationAll[i]}, {duration: 0});
   } else if (rotationTrue === 0) {
    $("#leaves"+i).css({top: Ypos[i], left: Xpos[i]});
   }
  }
 }, 1000/fps);
});