/* Snowstorm (by Scott Schiller)
    Animates snow falling across the page
*/

$(function() {

 var storm = this;
 // Customisable parameters
 storm = {
  flakesMax: 250,	   // Limit total amount of snow made (falling + sticking)
  flakesMaxActive: 100,	   // Limit amount of snow falling at once
  fps: 20,		   // Frames per second
  targetElement: null,	   // Element to append snow to (body if null), can be element ID or DOM node reference
  snowColor: "#FFF",	   // Don't use yellow snow
  snowCharacter: "&bull;", // &bull,: bullet, &middot, is square on some systems
  snowStick: true,	   // Whether or not snow should "stick" at the bottom
  useMeltEffect: true,	   // When recycling fallen snow (or rarely, when falling), have it "melt" and fade out
  usePositionFixed: true,  // If snow should not be affected by window scroll, may increase CPU load
  flakeWidth: 8,	   // Max pixel width for snow element
  flakeHeight: 8,	   // Max pixel height for snow element
  vMaxX: 5,		   // Maximum X velocity
  vMaxY: 6,		   // Maximum Y velocity
  vMinX: 0.2,		   // Minimum X velocity
  vMinY: 0.2,		   // Minimum Y velocity
  zIndex: 2		   // CSS stacking order applied to each snowflake
 };



 // Diable sticking and allow scrolling if loading screen's debug mode is on
 if (document.getElementsByTagName("pre").length !== 0) {
  storm.snowStick = false;
  storm.usePositionFixed = false;
 }

 // Returns random number from min to n+min
 function rnd(n, min) {
  if (isNaN(min)) {
   min = 0;
  }
  return Math.random() * n + min;
 }

 // Initialising variables
 storm.flakes = [];
 var screenX  = null,
     screenX2 = null,
     screenY  = null,
     scrollY  = null,
     vRndX = parseInt(rnd(2)) ? rnd(storm.vMaxX, storm.vMinX) * -1 : rnd(storm.vMaxX, storm.vMinX),
     vRndY = rnd(storm.vMaxY, storm.vMinY),
     flakeTypes = 6; // 6 types of snowflakes, with increasing sizes and velocities

 // targetElement 
 if (typeof storm.targetElement === "string") {
  storm.targetElement = document.getElementById(storm.targetElement);
 }
 // targetElement becomes document.body for null and undefined, or if element was not found
 if (!storm.targetElement) {
  storm.targetElement = document.body;
 }

 // Initialises snowstorm
 storm.init = function() {
  
  // Activate event listeners
  window.addEventListener("resize", storm.resizeHandler, false);
  window.addEventListener("scroll", storm.scrollHandler, false);
  storm.resizeHandler();
  storm.scrollHandler();

  // Builds snowstorm
  for (var i = 0; i < storm.flakesMax; i++) {
   storm.flakes[storm.flakes.length] = new storm.SnowFlake(parseInt(rnd(flakeTypes)));
   if (i > storm.flakesMaxActive) {
    storm.flakes[storm.flakes.length-1].active = 0;
   }
  }

  // Main loop
  setInterval(storm.snow, 1000 / storm.fps);
 };

 // Handles individual snowflake data
 storm.SnowFlake = function(type) {
  var s = this;
  s.fontSize = 10 + type * 2; // Increased size per type

  // Build snowflake div
  s.o = document.createElement("div");
  s.o.className = "snowstorm";
  s.o.innerHTML = storm.snowCharacter;
  s.o.style.color = storm.snowColor;
  s.o.style.cursor = "default";
  s.o.style.display = "none";
  s.o.style.fontFamily = "arial, verdana";
  s.o.style.fontWeight = "normal";
  s.o.style.height = storm.flakeHeight + "px";
  s.o.style.margin = "0px";
  s.o.style.overflow = "hidden";
  s.o.style.padding = "0px";
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
   // Stick or reset snow when it hits the bottom of targetElemet
   if ((screenY + scrollY - s.y) < storm.flakeHeight) {
    s.active = 0;
    if (storm.snowStick) {
     s.stick();
    } else {
     s.recycle();
    }
   // 1/1000 chance of melting mid-air with each frame
   } else if (storm.useMeltEffect && s.active && !s.melting && Math.random() > 0.999) {
    s.melting = true;
    s.melt();
   }
  };

  // Update position
  s.refresh = function() {
   s.o.style.left = s.x + "px";
   s.o.style.top  = s.y + "px";
  };

  // Stick snowflakes to bottom of targetElement
  s.stick = function() {
   if (storm.targetElement !== document.body) {
    s.o.style.top = (screenY + scrollY - storm.flakeHeight) + "px";
   } else {
    s.o.style.display = "none";
    s.o.style.top = "auto";
    s.o.style.bottom = "0px";
    s.o.style.position = "fixed";
    s.o.style.display = "block";
   }
  };

  // Melting routine
  s.melt = function() {
   if (s.melting && s.meltFrame < 20) {
    s.meltFrame++;
    s.o.style.fontSize = (s.fontSize - s.fontSize * s.meltFrame / 20) + "px";
    s.o.style.lineHeight = (storm.flakeHeight * 0.75 * s.meltFrame / 20 + storm.flakeHeight + 2) + "px";
    s.o.style.opacity -= 0.05;
   } else {
    s.recycle();
   }
  };

  // Reset snowflake
  s.recycle = function() {
   s.o.style.display = "none";
   s.o.style.bottom = "auto";
   s.o.style.fontSize = s.fontSize + "px";
   s.o.style.lineHeight = (storm.flakeHeight + 2) + "px";
   s.o.style.opacity = 1;
   s.o.style.position = s.usePositionFixed ? "fixed" : "absolute";
   s.meltFrame = 0;
   s.melting = false;
   s.vX = vRndX + rnd(storm.vMaxX * 0.12, 0.1);
   s.vY = vRndY + rnd(storm.vMaxY * 0.12, 0.1);
   s.x = parseInt(rnd(screenX - storm.flakeWidth));
   s.y = parseInt(rnd(screenY) * -1) - storm.flakeHeight;
   s.refresh();
   s.o.style.display = "block";
   s.active = 1;
  };

  // New snowflake engage
  s.recycle();
  s.refresh();
 };

 // Calls functions for snowflakes depending on state
 storm.snow = function() {
  var active = 0;
  for (var i = storm.flakes.length; i--;) {
   if (storm.flakes[i].active === 1) {
    storm.flakes[i].move();
    active++;
   }
   if (storm.useMeltEffect && storm.flakes[i].melting) {
    storm.flakes[i].melt();
   }
  }
  // Melts snowflakes at the bottom of the targetElement
  if (storm.useMeltEffect && active < storm.flakesMaxActive) {
   var flake = storm.flakes[parseInt(rnd(storm.flakes.length))];
   if (flake.active === 0) {
    flake.melting = true;
   }
  }
 };

 // Updates values upon scrolling
 storm.scrollHandler = function() {
  // IE requires document.documentElement.scrollTop
  scrollY = window.scrollY || document.documentElement.scrollTop;
  // Attach snowflakes to bottom of window
  if (!storm.usePositionFixed && storm.flakes) {
   for (var i = storm.flakes.length; i--;) {
    if (storm.flakes[i].active === 0) {
     storm.flakes[i].stick();
    }
   }
  }
 };

 // Updates values upon resizing, depending on if targetElement is document.body or specific element
 storm.resizeHandler = function() {
  screenX = (storm.targetElement === document.body)
   ? window.innerWidth : storm.targetElement.offsetLeft + storm.targetElement.offsetWidth;
  screenY = (storm.targetElement === document.body)
   ? window.innerHeight : storm.targetElement.offsetTop + storm.targetElement.offsetHeight;
  screenX2 = parseInt(screenX / 2);
 };

 storm.init();
});