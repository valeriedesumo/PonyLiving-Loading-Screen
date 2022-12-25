/* Fools
   Designed by Valerie Desumo (Ultimaximus)
    Code for the Fools theme, a creepy static-covered theme with jitters, text corruption, and background imagery

    http://www.ponyliving.com/files/loading/?f=2
    type	1,2,3
     1: Transitions from original theme
     2: No transition, main theme
     3: Static on original theme only
    song	music[_{THEME}]/{SONG}.ogg
*/

function fool(type, song) {

 // Static overlay
 var static = document.createElement("div");
 static.id = "static";
 static.style.opacity = 1.00;
 document.body.appendChild(static);
 StaticGen.init("#static",{
  tileWidth:  400,    // Unique tile width
  tileHeight: 100,    // Unique tile height
  totalFrames: 3,     // Number of total static frames
  fps: 6,	      // Number of frames per second
  pixelWidth:  2,     // Single static grain width
  pixelHeight: 2,     // Single static grain height
  stretchH: 2,	      // Amount of horizontal stretching applied to each static grain; "fit" to fit container width  or int>1
  stretchV: 1,	      // Amount of vertical   stretching applied to each static grain; "fit" to fit container height or int>1
  scanLines: true,    // Leave a 1px high gap between {pixelHeight}px pixel rows
  randomizeRows: true // Randomly offset each row by a fraction of {pixelWidth}
 });

 // jPlayer static SFX, active only if sound is enabled
 var muted = (document.getElementById("jquery_jplayer") === null);
 if (!muted) {
  $("#jquery_jplayer").jPlayer("volume", 0.3);
  var jstatic = document.createElement("div");
  jstatic.id = "jplayer_static";
  document.body.appendChild(jstatic);
  $("#jplayer_static").jPlayer({
   ready: function() {
    $(this).jPlayer("setMedia", {
     oga: "effect_static.ogg",
     mp3: "effect_static.mp3"
    });
    // Automatically plays song for Fools type 2
    if (type == 2) {
     $(this).jPlayer("volume", 1.0);
    }
   },
   // Empty CSS selectors, required
   cssSelector: {
    videoPlay: "",
    play: "",
    pause: "",
    stop: "",
    seekBar: "",
    playBar: "",
    mute: "",
    unmute: "",
    volumeBar: "",
    volumeBarValue: "",
    volumeMax: "",
    playbackRateBar: "",
    playbackRateBarValue: "",
    currentTime: "",
    duration: "",
    title: "",
    fullScreen: "",
    restoreScreen: "",
    repeat: "",
    repeatOff: "",
    gui: ""
   },
   // jPlayer settings
   solution: "html",
   supplied: "oga, mp3",
   loop: true,
   volume: 0.3,
   errorAlerts: true,
   warningAlerts: true
  });
 }

 // Retrieves elements of page
 var main = document.getElementsByClassName("main")[0],
     mustitle = document.getElementsByClassName("mustitle")[0],
     ava = document.getElementsByClassName("ava")[0],
     valve = /Valve Source Client/i.test(navigator.userAgent);

 // Run appropriate code for Fools type
 switch (type) {
  case 1:
   foolFirst();
   break;
  case 2:
   foolSecond();
   break;
  case 3:
   foolThird();
   break;
 }

 // Returns random integer between 0 and expand - 1, with an optional offset
 function rand(expand, offset) {
  if (typeof offset === "undefined") {
   offset = 0;
  }
  return Math.floor(Math.random() * expand + offset);
 }

 // Toggles page skewing for glitched effect, will skew mustitle and ava if present
 function skewOn() {
  main.className = "main skew";
  if (mustitle !== undefined) {
   mustitle.className = "mustitle skew";
  }
  if (ava !== undefined) {
   ava.className = "ava skew";
  }
 }
 function skewOff() {
  main.className = "main";
  if (mustitle !== undefined) {
   mustitle.className = "mustitle";
  }
  if (ava !== undefined) {
   ava.className = "ava";
  }
 }

 // Toggles static overlay
 function staticOn() {
  static.style.display = "block";
  if (!muted) {
   $("#jquery_jplayer").jPlayer("pause");
   $("#jplayer_static").jPlayer("play");
  }
 }
 function staticOff() {
  static.style.display = "none";
  if (!muted) {
   $("#jplayer_static").jPlayer("stop");
   $("#jquery_jplayer").jPlayer("play");
  }
 }

 // Fools type 1, transitions from original theme to Fools type 2
 function foolFirst() {
  // Skewing turned on 0.2s before static
  var timer1 = new Timer(function(){
   skewOn();
   timer2.start(0.20);
  }),
  timer2 = new Timer(function(){
   staticOn();
   timer3.start(0.35);
  }),
  timer3 = new Timer(function(){
   staticOff();
   timer4.start(0.20);
  }),
  timer4 = new Timer(function(){
   staticOn();
   timer5.start(0.35);
  }),
  timer5 = new Timer(function(){
   staticOff();
   skewOff();
   timer6.start(5.00);
  }),
  timer6 = new Timer(function(){
   skewOn();
   timer7.start(0.20);
  }),
  timer7 = new Timer(function(){
   staticOn();
   timer8.start(0.35);
  }),
  timer8 = new Timer(function(){
   staticOff();
   timer9.start(0.20);
  }),
  timer9 = new Timer(function(){
   staticOn();
   timer10.start(0.50);
  }),
  timer10 = new Timer(function(){
   staticOff();
   timer11.start(0.35);
  }),
  timer11 = new Timer(function(){
   staticOn();
   skewOff();
   timer12.start(4.00);
  }),
  // Final timer before transfer to Fools type 2
  timer12 = new Timer(function(){
   // Change to Fools theme
   document.getElementById("theme").href = "theme_fools.css";
   // Remove Javascript effects
   $("#birds").remove();
   $(".sunray").remove();
   $("img").filter("[id^=leaves]").remove();
   $(".snowstorm").remove();
   $("#bloodshot").remove();
   $(".hyudoro").remove();
   $("img").filter("[id^=hearts]").remove();
   // Change to fools image
   document.getElementsByClassName("cen")[0].src = "img_fools.php";
   // Change to Fools music, determined externally by PHP
   if (!muted) {
    $("#jquery_jplayer")
     .jPlayer("setMedia", {
      oga: song,
      mp3: song.slice(0, -3) + "mp3"
     })
     .jPlayer("play")
     // Custom volume fade function in jPlayer file
     .jPlayerFade().in(8000);
    $("#jplayer_static").jPlayerFade().out(8000, 0.3, 0.1);
   }
   // Proceed to Fools type 2
   foolSecond();
  });

  // Run set of Timers
  timer1.start(3);
 }

 // Fools type 2, main theme
 function foolSecond() {
  // Initiates static and song title based on Fools type (Static already faded out in Fools type 1)
  if (type == 2) {
   static.style.display = "block";
   static.style.opacity = 0.4;
   song = mustitle.innerHTML;
  } else {
   song = song.substring(song.indexOf("/")+1, song.indexOf(".ogg"));
  }

  // "Snowstorm" of 0s and 1s, too CPU-intensive for Gmod
  if (!valve) {
   var js = document.createElement("script");
   js.type = "text/javascript";
   js.src = "effect_fools_snowstorm.js";
   document.head.appendChild(js);
  }

  // Skewing, pulsing, or wobbling at random intervals anywhere from 0 to 4 seconds
  function randOn() {
   var effects = ["skew", "pulse", "wobble"];
   main.className = "main " + effects[rand(effects.length)];
   if (mustitle !== undefined) {
    mustitle.className = "mustitle " + effects[rand(effects.length)];
   }
   if (ava !== undefined) {
    ava.className = "ava " + effects[rand(effects.length)];
   }
  }
  var timer1 = new Timer(function(){
   randOn();
   timer2.start(0.05);
  }),
  timer2 = new Timer(function(){
   skewOff();
   timer1.start(Math.random()*4);
  });
  timer1.start();

  // Randomly fade in and out opacity of static overlay
  function opacityFade(opacity) {
   var direction = (opacity > static.style.opacity),
       fade = setInterval(function(){
    if (opacity == Number(static.style.opacity)) {
     clearInterval(fade);
     opacityFadeRun();
    } else {
     static.style.opacity = (direction) ?
      Number(static.style.opacity) + 0.01 :
      Number(static.style.opacity) - 0.01;
     }
   }, 60);
  }
  // Random opacity values between 0.20 and 0.53, biased towards 0.28, produced via calculations
  function opacityFadeRun() {
   opacityFade((0.64 * Math.pow(1.231004435 * Math.random() - 0.5, 3) + 0.28).toPrecision(2));
  }
  opacityFadeRun();

  // Use CamanJS on avatar for effect
  if (ava !== undefined) {
   Caman.remoteProxy = "code_caman_proxy.php";
   Caman("#sincity",function(){
    this.greyscale();
    this.colorize("#FF0022", 10);
    this.contrast(100);
    this.brightness(15);
    this.exposure(10);
    this.clip(30);
    this.render();
   });
  }

  // Zalgo text randomly flickers into text, not compatible with Gmod due to Unicode 
  if (!valve) {
   var status = document.getElementById("status");
   setInterval(function(){
    var zalgo = document.getElementById("zalgo");
    // Remove existing Zalgo text
    if (zalgo !== null) {
     zalgo.parentNode.removeChild(zalgo);
    }
    // Store text in variable before re-writing, prevents issues
    // Connecting to PonyLiving<span id="wait">...</span><br />gamemode: mapname
    var statusInnerHTML = status.innerHTML,
    // Find HTML tags to determine allowed positions for Zalgo text
    tag2, tag3, tag4, tag5, tags =
     [0,
      // <span id="wait">
      statusInnerHTML.indexOf("<"),
      tag2 = statusInnerHTML.indexOf(">"),
      // </span>
      tag3 = statusInnerHTML.indexOf("<", tag2),
      tag4 = statusInnerHTML.indexOf(">", tag3),
      // <br />
      tag5 = statusInnerHTML.indexOf("<", tag4),
      statusInnerHTML.indexOf(">", tag5),
      statusInnerHTML.length],
    /* biasing on Zalgo position
        46/100 chance: between start		 and  <span id="wait">	("Connecting to PonyLiving")
        46/100 chance: between <br />		 and  end		(gamemode: mapname)
         5/100 chance: between <span id="wait">	 and  </span>		(loading dots)
         3/100 chance: between </span>		 and  <br />		(before line break) */
    weighted = rand(100),
    set = (weighted < 46) ? 0 : (weighted < 92) ? 3 : (weighted < 97) ? 1 : 2,
    index = rand(tags[set*2+1]-tags[set*2], tags[set*2]+1);
    // Insert Zalgo, write to page
    statusInnerHTML = statusInnerHTML.substring(0, index) + '<span id="zalgo">' + zalgoText() + "</span>"
     + statusInnerHTML.substring(index);
    status.innerHTML = statusInnerHTML;
   }, 250);
  }

  // Randomise loading dot count
  clearInterval(initial);
  function stringFill(text, n) {
   var string = "";
   while (n > 0) {
    string += text;
    n--;
   }
   return string;
  }
  setInterval(function(){document.getElementById("wait").innerHTML = stringFill(".", rand(9));},500);

  // Randomly selects div backgrounds from standard, flipped, and static
  function divFool(div) {
   var timer0, timer1, timer2, timerArray = [
    timer0 = new Timer(function(){
     div.style.backgroundImage = "url(div_fools1.gif)";
     timerArray[rand(3)].start(Math.random()*2);
    }),
    timer1 = new Timer(function(){
     div.style.backgroundImage = "url(div_fools2.gif)";
     timerArray[rand(3)].start(Math.random()*2);
    }),
    timer2 = new Timer(function(){
     div.style.backgroundImage = "url(div_fools3.gif)";
     // Static background lasts half as long on average
     timerArray[rand(3)].start(Math.random());
    })];
   timerArray[0].start();
  }

  // Rapidly flickers text shadows between -25px and 25px, and between #000 and #900
  function shadowFool(div) {
   // Biases text offset towards 0px
   function offset() {
    return (4 * Math.pow(Math.random() - 0.5, 3) + 0.5) * 50 - 25;
   }
   // Assigns text offset and colour
   setInterval(function(){
    var str = "",
        i = 7;
    do {
     str += offset() + "px "
          + offset() + "px #" + rand(10) + "00,";
    } while(i--);
    div.style.textShadow = str.slice(0, -1);
   }, 150);
  }

  // Apply effects to main div
  divFool(main);
  shadowFool(main);

  // Apply effects to mustitle div if it exists
  if (mustitle !== undefined) {
   divFool(mustitle);
   shadowFool(mustitle);

   // Proper song title for Smile HD (question marks not allowed in file names)
   if (song == "Smile HD") {
    song = "Smile HD (???)";
   }
   // For songs edited from the original, flicker song title between standard and edited names
   // e.g.: "Friendship is Magic - Bats" and "Friendship is Magic - Bats (Reversed)"
   if (song.indexOf("(") != -1) {
    var song2 = song.substring(0, song.indexOf("(")-1),
    timer3 = new Timer(function(){
     mustitle.innerHTML = song;
     timer4.start(0.15);
    }),
    timer4 = new Timer(function(){
     mustitle.innerHTML = song2;
     timer3.start(Math.random()*2);
    });
    timer3.start();
   // Otherwise, just update song title for new song
   } else {
    mustitle.innerHTML = song;
   }
  }

  // Flickers random quotes from entire set
  var quote = document.getElementsByClassName("quote")[0];
  if (quote === undefined) {
   quote = document.createElement("div");
   quote.className = "quote";
   main.insertBefore(quote, document.getElementsByClassName("credit")[0]);
  }
  // db_quotes.txt, the quote database, is stored on the server
  $.get("db_quotes.txt", function(data){
   var quotes = [];
   // Build quote array, triplicating all quote sets except TPP quotes, which greatly outnumber the other quotes
   for (var x in data) {
    if (data.hasOwnProperty(x)) {
     quotes = (x != "helix") ? quotes.concat(data[x],data[x],data[x]) : quotes.concat(data[x]);
    }
   }
   // Triplicating non-TPP quotes makes biasing easier
   setInterval(function(){quote.innerHTML=quotes[rand(quotes.length)];},200);
  }, "json");
  var quote = document.getElementsByClassName("quote")[0];
  if (quote === undefined) {
   quote = document.createElement("div");
   quote.className = "quote";
   main.insertBefore(quote, document.getElementsByClassName("credit")[0]);
  }

  // Adds transparent pulsing overlay of creepy character, not compatible with Gmod
  // Animated by CSS3 in effect_fools.css, uses opacitypulse1 by default, opacitypulse2 offers more opacity
  if (!valve) {
   var bgs = ["foolbg_bloodygir.png",
	      "foolbg_giygas.png",
	      "foolbg_pinkamena.png",
	      "foolbg_pinkiesmilehd.png",
	      "foolbg_slenderman.png",
	      "foolbg_sonicexe.png",
	      "foolbg_tailsdoll.png",
	      "foolbg_flak.png"];
   var bg = bgs[rand(bgs.length)],
   bgcover = document.createElement("div");
   bgcover.className = "bgcover";
   bgcover.style.height = innerHeight + "px";
   bgcover.style.width  = window.innerWidth  + "px";
   bgcover.style.backgroundImage = "url(" + bg + ")";
   document.body.appendChild(bgcover);
   // Extra calibrations and effects for specific images
   switch (bg) {
    // Sonic.EXE uses an animated overlay separated out of the original image, opacitypulse2,
    // and a z-index above all layers including static
    case "foolbg_sonicexe.png":
     var exegif = document.createElement("div");
     exegif.className = "exegifcover";
     exegif.style.height = window.innerHeight + "px";
     exegif.style.width  = window.innerWidth  + "px"; 
     document.body.appendChild(exegif);
     break;
    // Pinkamena is aligned to the bottom, and flickers to Pinkamena-Zalgo
    case "foolbg_pinkamena.png":
     bgcover.style.backgroundPosition = "bottom right 50px";
     bgcover.style.opacity = 0.2; // Pinkamena-Zalgo's opacity
     var timer5 = new Timer(function(){
      bgcover.style.backgroundImage = "url(foolbg_pinkamenazalgo.png)";
      bgcover.style.webkitAnimation = "none";
            bgcover.style.animation = "none";
      timer6.start(0.15);
     }),
     timer6 = new Timer(function(){
      bgcover.style.backgroundImage = "url(foolbg_pinkamena.png)";
      bgcover.style.webkitAnimation = "opacitypulse2 20s linear infinite";
            bgcover.style.animation = "opacitypulse2 20s linear infinite";
      timer5.start(Math.random()*7);
     });
     timer5.start();
     break;
    case "foolbg_giygas.png":
     bgcover.style.webkitAnimation = "opacitypulse2 20s linear infinite";
     bgcover.style.animation       = "opacitypulse2 20s linear infinite";
     break;
   }
  }
 }
 // Fools type 3, static on original theme only
 function foolThird() {
  var timer1 = new Timer(function(){
   skewOn();
   timer2.start(0.15);
  }),
  timer2 = new Timer(function(){
   staticOn();
   timer3.start(0.30);
  }),
  timer3 = new Timer(function(){
   staticOff();
   skewOff();
   // 33% chance of an immediate sequential skew, diminishing chances for subsequent sequential skews
   if (Math.random() <= 0.33) {
    timer1.start(Math.random());
   // Otherwise, 3-7 second pause
   } else {
    timer1.start(Math.random()*4+3);
   }
  });
  timer1.start(5);
 }

}


// StaticGen (by Marek Lenik)
// Adds an old TV-like noise/static effect through a canvas
var StaticGen = (function(){
 "use strict";
 var container,	       // Container element
     c,		       // Main canvas element
     ctx,	       // Main canvas's context
     sprite,	       // Sprite (pre-render) canvas element
     spriteCtx,	       // Sprite (pre-render) canvas context
     tileNumH = 1,     // Amount of Horizontal tile repetitions
     tileNumV = 1,     // Amount of Vertical   tile repetitions 
     currentFrame = 0, // Current assembled frame
     options = {};     // Options, to be set by user

 // Prerenders all unique {options.totalFrames} number of tiles
 function prerenderFrames() {
  var updatedPixelHeight = options.pixelHeight + (options.scanLines ? 1 : 0);
  for (var f = 0; f < options.totalFrames; f++) {
   for (var y = 0; y < Math.ceil(options.tileHeight / updatedPixelHeight); y++) {
    var horizontalOffset = options.randomizeRows ? -Math.round(Math.random() * options.pixelWidth) : 0;
    for (var x = 0; x < Math.ceil(options.tileWidth / options.pixelWidth) + (options.randomizeRows ? 1 : 0); x++) {
     var color = Math.floor(Math.random() * 150);
     spriteCtx.fillStyle = "rgba(" + color + ", " + color + ", " + color + ", 255)";
     spriteCtx.fillRect(
      horizontalOffset + x * options.pixelWidth,
      f * options.tileHeight + y * updatedPixelHeight,
      options.pixelWidth,
      options.pixelHeight
     );
    }
   }
  }
 }

 // Cuts out a tile corresponding to {currentFrame} bit from sprite canvas and fills main canvas with it
 function drawFrame() {
  var actualTileWidth  = options.tileWidth  * (isNaN(options.stretchH) ? 1 : options.stretchH),
      actualTileHeight = options.tileHeight * (isNaN(options.stretchV) ? 1 : options.stretchV);
  for (var x = 0; x < tileNumH; x++) {
   for (var y = 0; y < tileNumV; y++) {
    ctx.drawImage(
     sprite,
     0,					// Sprite X
     currentFrame * options.tileHeight,	// Sprite Y
     options.tileWidth,			// Sprite tile width
     options.tileHeight,		// Sprite tile height
     x * actualTileWidth,		// Canvas X
     y * actualTileHeight,		// Canvas Y
     (options.stretchH === "fit"	// Canvas tile Width
      ? options.width  : ((options.stretchH > 1) ? actualTileWidth  : options.tileWidth)),
     (options.stretchV === "fit"	// Canvas tile Height
      ? options.height : ((options.stretchV > 1) ? actualTileHeight : options.tileHeight))
    );
   }
  }
  currentFrame++;
  if (currentFrame === options.totalFrames) {
   currentFrame = 0;
  }
 }

 /* Generates canvas and optionally inserts it to the DOM, returns canvas element
     width:  Canvas width  (int)
     height: Canvas height (int)
     addToDOM: If it should be injected into DOM (boolean)
     replaceContent: If container element's innerHTML should be inserted into the canvas tag (boolean) */
 function createCanvas(width, height, addToDOM, replaceContent) {
  var canvas = document.createElement("canvas");
  canvas.width  = width;
  canvas.height = height;
  // Grab existing content and inject it into canvas
  if (replaceContent) {
   canvas.innerHTML = container.innerHTML;
   container.innerHTML = "";
  }
  // Insert canvas into DOM
  if (addToDOM) {
   container.appendChild(canvas);
  }
  return canvas;
 }

 // Parses options, updates vars, calls all preparation methods, then inits timer -> animation
 function init(selector, extended) {
  // Retrieve specified container
  container = document.querySelector(selector);
  // Specify options with supplied parameters
  options = extended;
  // Define main canvas dimensions based on window size
  options.width  = window.innerWidth;
  options.height = window.innerHeight;
  // Correct tileSizes if larger than actual canvas
  options.tileWidth  = Math.min(options.tileWidth,  options.width);
  options.tileHeight = Math.min(options.tileHeight, options.height);
  // Calculate amount of tiles per frame
  tileNumH = (options.width  === options.tileWidth  || options.stretchH === "fit")
   ? 1 : Math.ceil(options.width  / options.tileWidth  * options.stretchH);
  tileNumV = (options.height === options.tileHeight || options.stretchV === "fit")
   ? 1 : Math.ceil(options.height / options.tileHeight * options.stretchV);
   // Set up rendering canvas, insert into DOM and replace contents
  c  = createCanvas(options.width, options.height, true, true);
  ctx = c.getContext("2d");
  // Set up the off-screen canvas
  sprite = createCanvas(options.tileWidth, options.tileHeight * options.totalFrames);
  spriteCtx = sprite.getContext("2d");
  // Render frames to off-canvas element
  prerenderFrames();
  // Run it, sister
  window.setInterval(drawFrame, 1000 / options.fps);
 }

 return {
  init:
   function(selector, extended) {
    init(selector, extended);
   }
 };
})();


// Zalgo (by tchouky)
// Invoking the feeling of chaos
function zalgoText() {
 // Data set of Unicode chars
 var zalgoUp = [
  "\u030d", /* ̍ */	"\u030e", /* ̎ */	"\u0304", /* ̄ */	"\u0305", /* ̅ */
  "\u033f", /* ̿ */	"\u0311", /* ̑ */	"\u0306", /* ̆ */	"\u0310", /* ̐ */
  "\u0352", /* ͒ */	"\u0357", /* ͗ */	"\u0351", /* ͑ */	"\u0307", /* ̇ */
  "\u0308", /* ̈ */	"\u030a", /* ̊ */	"\u0342", /* ͂ */	"\u0343", /* ̓ */
  "\u0344", /* ̈́ */	"\u034a", /* ͊ */	"\u034b", /* ͋ */	"\u034c", /* ͌ */
  "\u0303", /* ̃ */	"\u0302", /* ̂ */	"\u030c", /* ̌ */	"\u0350", /* ͐ */
  "\u0300", /* ̀ */	"\u0301", /* ́ */	"\u030b", /* ̋ */	"\u030f", /* ̏ */
  "\u0312", /* ̒ */	"\u0313", /* ̓ */	"\u0314", /* ̔ */	"\u033d", /* ̽ */
  "\u0309", /* ̉ */	"\u0363", /* ͣ */	"\u0364", /* ͤ */	"\u0365", /* ͥ */
  "\u0366", /* ͦ */	"\u0367", /* ͧ */	"\u0368", /* ͨ */	"\u0369", /* ͩ */
  "\u036a", /* ͪ */	"\u036b", /* ͫ */	"\u036c", /* ͬ */	"\u036d", /* ͭ */
  "\u036e", /* ͮ */	"\u036f", /* ͯ */	"\u033e", /* ̾ */	"\u035b", /* ͛ */
  "\u0346", /* ͆ */	"\u031a"  /* ̚ */
 ];
 var zalgoMid = [
  "\u0315", /* ̕ */	"\u031b", /* ̛ */	"\u0340", /* ̀ */	"\u0341", /* ́ */
  "\u0358", /* ͘ */	"\u0321", /* ̡ */	"\u0322", /* ̢ */	"\u0327", /* ̧ */
  "\u0328", /* ̨ */	"\u0334", /* ̴ */	"\u0335", /* ̵ */	"\u0336", /* ̶ */
  "\u034f", /* ͏ */	"\u035c", /* ͜ */	"\u035d", /* ͝ */	"\u035e", /* ͞ */
  "\u035f", /* ͟ */	"\u0360", /* ͠ */	"\u0362", /* ͢ */	"\u0338", /* ̸ */
  "\u0337", /* ̷ */	"\u0361", /* ͡ */	"\u0489"  /* ҉_ */		
 ];
 var zalgoDown = [
  "\u0316", /* ̖ */	"\u0317", /* ̗ */	"\u0318", /* ̘ */	"\u0319", /* ̙ */
  "\u031c", /* ̜ */	"\u031d", /* ̝ */	"\u031e", /* ̞ */	"\u031f", /* ̟ */
  "\u0320", /* ̠ */	"\u0324", /* ̤ */	"\u0325", /* ̥ */	"\u0326", /* ̦ */
  "\u0329", /* ̩ */	"\u032a", /* ̪ */	"\u032b", /* ̫ */	"\u032c", /* ̬ */
  "\u032d", /* ̭ */	"\u032e", /* ̮ */	"\u032f", /* ̯ */	"\u0330", /* ̰ */
  "\u0331", /* ̱ */	"\u0332", /* ̲ */	"\u0333", /* ̳ */	"\u0339", /* ̹ */
  "\u033a", /* ̺ */	"\u033b", /* ̻ */	"\u033c", /* ̼ */	"\u0345", /* ͅ */
  "\u0347", /* ͇ */	"\u0348", /* ͈ */	"\u0349", /* ͉ */	"\u034d", /* ͍ */
  "\u034e", /* ͎ */	"\u0353", /* ͓ */	"\u0354", /* ͔ */	"\u0355", /* ͕ */
  "\u0356", /* ͖ */	"\u0359", /* ͙ */	"\u035a", /* ͚ */	"\u0323"  /* ̣ */
 ];

 // Init and random specifications
 var newtxt  = "",
     numUp   = Math.floor(Math.random() * 64),
     numMid  = Math.floor(Math.random() * 16),
     numDown = Math.floor(Math.random() * 16);

 // Build string from random chars in zalgo char table
 for (var j = 0; j < numUp; j++) {
  newtxt += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
 }
 for (var k = 0; k < numMid; k++) {
  newtxt += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
 }
 for (var l = 0; l < numDown; l++) {
  newtxt += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
 }
 return newtxt;
}


// Timer.js (by Yuriy Husnay)
// Simple and lightweight JavaScript timer
var Timer = function(value) {
 this.onend = value;
};

// Handle code scheduling
Timer.prototype.start = function(duration) {
 // Run code immediately if there's no duration, or a duration of 0
 if (!duration) {
  return this.end();
 }
 // Schedule code to be run later
 var instance = this;
 this.timeout = setTimeout(function(){instance.end.call(instance);}, duration * 1000);
};

// Clear timer and run function
Timer.prototype.end = function() {
 clearTimeout(this.timeout);
 this.onend.apply(this);
};