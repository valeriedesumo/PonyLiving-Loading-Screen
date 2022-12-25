/* Snowstorm (by Scott Schiller)
    Animates snow falling across the page
*/

$(function() {

 var storm = this;
 // Customisable parameters
 storm = {
  flakesMax: 150,  // Limit total amount of snow made
  fps: 12,         // Frames per second
  flakeWidth: 12,  // Max pixel width for snow element
  flakeHeight: 15, // Max pixel height for snow element
  vMaxX: 12,       // Maximum X velocity
  vMaxY: 15,       // Maximum Y velocity
  vMinX: 5,        // Minimum X velocity
  vMinY: 5,        // Minimum Y velocity
  zIndex: 6        // CSS stacking order applied to each snowflake
 };

 // Returns random number from min to n+min
 function rnd(n, min) {
  if (isNaN(min)) {
   min = 0;
  }
  return Math.random() * n + min;
 }

 // Initialising variables
 storm.flakes = [];
 var screenX  = window.innerWidth,
     screenY  = window.innerHeight,
     vRndX = parseInt(rnd(2)) ? rnd(storm.vMaxX, storm.vMinX) * -1 : rnd(storm.vMaxX, storm.vMinX),
     vRndY = rnd(storm.vMaxY, storm.vMinY),
     flakeTypes = 6; // 6 types of snowflakes, with increasing sizes and velocities

 // Initialises snowstorm
 storm.init = function() {
  // Builds snowstorm
  for (var i = 0; i < storm.flakesMax; i++) {
   storm.flakes[storm.flakes.length] = new storm.SnowFlake(parseInt(rnd(flakeTypes)));
  }

  // Main loop
  setInterval(storm.snow, 1000 / storm.fps);
 };

 // Handles individual snowflake data
 storm.SnowFlake = function(type) {
  var s = this;
  s.fontSize = 14 + type * 2; // Increased size per type

  // Build snowflake div
  s.o = document.createElement("div");
  s.o.className = "snowstorm";
  s.o.innerText = Math.round(Math.random()); // Replace snowflakes with 0s and 1s
  s.o.style.color = "#" + (parseInt(rnd(6))+10).toString(16) + "22"; // Random shades of red
  s.o.style.cursor = "default";
  s.o.style.font = s.fontSize + "px Courier New";
  s.o.style.height = storm.flakeHeight + "px";
  s.o.style.lineHeight = (storm.flakeHeight + 2) + "px";
  s.o.style.margin = "0px";
  s.o.style.overflow = "hidden";
  s.o.style.padding = "0px";
  s.o.style.position = "absolute";
  s.o.style.textAlign = "center";
  s.o.style.width = storm.flakeWidth  + "px";
  s.o.style.verticalAlign = "baseline";
  s.o.style.zIndex = storm.zIndex;
  document.body.appendChild(s.o);

  // Handles movement
  s.move = function() {
   s.x += s.vX;
   s.y += s.vY * (1 + type * 0.2); // Increased speed per type
   // Snowflakes appear on other side of targetElement if they hit the left or right edges (wraparound effect)
   if (s.x >= screenX || screenX - s.x < storm.flakeWidth) {
    s.x = 0;
   } else if (s.vX < 0 && s.x < -storm.flakeWidth) {
    s.x = screenX - storm.flakeWidth - 1;
   }
   // Apply new positions
   s.refresh();
   // Reset snow when it hits the bottom of targetElemet
   if ((screenY + window.scrollY - s.y) < storm.flakeHeight) {
    s.recycle();
   }
  };

  // Update position
  s.refresh = function() {
   s.o.style.left = s.x + "px";
   s.o.style.top  = s.y + "px";
  };

  // Reset snowflake
  s.recycle = function() {
   s.vX = vRndX + rnd(storm.vMaxX * 0.12, 0.1);
   s.vY = vRndY + rnd(storm.vMaxY * 0.12, 0.1);
   s.x = parseInt(rnd(screenX - storm.flakeWidth));
   s.y = parseInt(rnd(screenY) * -1) - storm.flakeHeight;
   s.refresh();
  };

  // New snowflake engage
  s.recycle();
  s.refresh();
 };

 // Move snowlakes
 storm.snow = function() {
  for (var i = storm.flakes.length; i--;) {
   storm.flakes[i].move();
  }
 };

 storm.init();
});