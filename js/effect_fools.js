/* Fools Theme (by Valerie Desumo)
    Code for the Fools theme, a creepy static-covered theme with jitters, text corruption, and background imagery

    http://www.ponyliving.com/files/loading/?f=1
    fool(type, camanjs, valve, song)
    type        1,2,3
     1: Transitions from original theme
     2: No transition, main theme
     3: Static on original theme only
    camanjs     true,false
     true/false: Enable or disable CamanJS image editing for avatar
    valve       true,false
     true/false: Disable Gmod-incompatible features
    song        music/{THEME}/{SONG}.ogg
*/

function fool(type, camanjs, valve, song) {

 // Retrieves elements of page
 var main = document.getElementsByClassName("main")[0],
     mustitle = document.getElementsByClassName("mustitle")[0],
     ava = document.getElementsByClassName("ava")[0],
     music = document.getElementsByTagName("audio")[0],
     staticsfx = document.getElementById("staticsfx");

 // Static overlay
 var staticdiv = document.createElement("div");
 staticdiv.id = "static";
 staticdiv.style.opacity = 1.00;
 document.body.appendChild(staticdiv);
 StaticGen.init("#static",{
  tileWidth:  400,    // Unique tile width
  tileHeight: 200,    // Unique tile height
  totalFrames: 4,     // Number of total static frames
  fps: 6,             // Number of frames per second
  pixelWidth:  2,     // Single static grain width
  pixelHeight: 2,     // Single static grain height
  stretchH: 2,        // Amount of horizontal stretching applied to each static grain; "fit" to fit container width  or int>1
  stretchV: 1,        // Amount of vertical   stretching applied to each static grain; "fit" to fit container height or int>1
  scanLines: true,    // Leave a 1px high gap between {pixelHeight}px pixel rows
  randomizeRows: true // Randomly offset each row by a fraction of {pixelWidth}
 });

 // Static SFX, active only if sound is enabled
 // var muted = (document.getElementById("jquery_jplayer") === null);
 var muted = (music === undefined);
 if (!muted) {
  /* UPDATE: Autoplay audio is no longer allowed
  $("#jplayer_static").jPlayer({
   ready: function() {
    $(this).jPlayer("setMedia", {
     oga: "misc/effect_static.ogg",
     mp3: "misc/effect_static.mp3"
    });
    // Automatically plays for Fools type 2
    if (type == 2) {
     $(this).jPlayer("volume", 0.02);
     $(this).jPlayer("play");
    }
   },
   // Empty CSS selectors, required
   cssSelector: {
    videoPlay:"",play:"",pause:"",stop:"",seekBar:"",playBar:"",mute:"",unmute:"",volumeBar:"",
    volumeBarValue:"",volumeMax:"",playbackRateBar:"",playbackRateBarValue:"",currentTime:"",
    duration:"",title:"",fullScreen:"",restoreScreen:"",repeat:"",repeatOff:"",gui:""
   },
   // jPlayer settings
   solution: "html",
   supplied: "oga, mp3",
   loop: true,
   volume: 0.3,
   errorAlerts: true,
   warningAlerts: true
  });
  */
  staticsfx.volume = 0.12;
 }
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
  main.className = main.className.replace(/ skew| pulse| wobble/, "");
  if (mustitle !== undefined) {
  mustitle.className = mustitle.className.replace(/ skew| pulse| wobble/, "");
  }
  if (ava !== undefined) {
   ava.className = "ava";
  }
 }

 // Toggles static overlay, plays static SFX only if user is playing music
 function staticOn() {
  staticdiv.style.display = "block";
  if (!muted && !music.paused) {
   // $("#jquery_jplayer").jPlayer("pause");
   // $("#jplayer_static").jPlayer("play");
   music.pause();
   staticsfx.play();
  }
 }
 function staticOff() {
  staticdiv.style.display = "none";
  if (!muted && !staticsfx.paused) {
   // $("#jplayer_static").jPlayer("stop");
   // $("#jquery_jplayer").jPlayer("play");
   music.play();
   staticsfx.pause();
  }
 }

 // Fools type 1, transitions from original theme to Fools type 2 using skew and static effects
 function foolFirst() {
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
   timer6.start(4.50);
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
   // Change to fools image
   $.get("php/img_fools.php", function(data) {
    $(".main img").attr("src", data); // Puts proper image URL into DOM
   });
   timer12.start(4.00);
  }),
  // Final timer before transfer to Fools type 2
  timer12 = new Timer(function(){
   // Change to Fools theme
   document.getElementById("theme").href = "css/theme_fools.css";
   // Remove Javascript effects
   $("#birds").remove();
   $(".sunray").remove();
   $("img").filter("[id^=leaves]").remove();
   $(".snowstorm").remove();
   $("#bloodshot").remove();
   $(".hyudoro").remove();
   $("img").filter("[id^=hearts]").remove();
   // Change to Fools music, passed in by PHP
   if (!muted) {
    /* jPlayer isn't used because autoplay audio is no longer allowed
    $("#jquery_jplayer")
     .jPlayer("setMedia", {
      oga: "php/music.php?s=" + song,
      mp3: "php/music.php?s=" + song.slice(0, -3) + "mp3"
     })
     .jPlayer("play")
     // Volume fade plugin in jPlayer file
     .jPlayerFade().in(8000);
    $("#jplayer_static").jPlayerFade().out(8000, 0.3, 0.01);
    */
    music.getElementsByTagName("source")[0].src = "php/music.php?s=" + song;
    music.getElementsByTagName("source")[1].src = "php/music.php?s=" + song.slice(0, -3) + "mp3";
    music.load();
    // If static SFX is playing, user has played music, so fade in new song and (mostly) fade out static
    if (!staticsfx.paused) {
     music.volume = 0;
     music.play();
     var fademusic = setInterval(function(){
      if (music.volume <= 0.4) {
       music.volume += 0.01;
      } else {
       clearInterval(fademusic);
      }
     }, 200),
     fadesfx = setInterval(function(){
      if (staticsfx.volume >= 0.02) {
       staticsfx.volume -= 0.004;
      } else {
       clearInterval(fadesfx);
      }
     }, 200);
    } else {
     staticsfx.volume = 0.02;
    }
   }
   // Proceed to Fools type 2
   foolSecond();
  });

  // Run set of Timers
  timer1.start(3);
 }

 // Fools type 2, main theme
 function foolSecond() {
  // Initiates static and song title based on Fools type (Static already faded out from Fools type 1)
  if (type == 2) {
   staticdiv.style.display = "block";
   staticdiv.style.opacity = 0.28;
   if (!muted) {
    staticsfx.volume = 0.02;
    song = mustitle.innerText;
   }
  } else {
   if (!muted) {
    song = song.substring(song.indexOf("/fools/")+7, song.indexOf(".ogg"));
   }
  }

  // Sync static SFX with music
  if (!muted) {
   music.onplay  = function(){staticsfx.play();};
   music.onpause = function(){staticsfx.pause();};
  }

  // "Snowstorm" of 0s and 1s, too CPU-intensive for Gmod when combined with other effects
  if (!valve) {
   var js = document.createElement("script");
   js.type = "text/javascript";
   js.src = "js/effect_fools_snowstorm.js";
   document.head.appendChild(js);
  }

  // Skewing, pulsing, or wobbling at random intervals anywhere from 0 to 4 seconds
  function randOn() {
   var effects = ["skew", "pulse", "wobble"];
   main.className += " " + effects[rand(effects.length)];
   if (mustitle !== undefined) {
    mustitle.className += " " + effects[rand(effects.length)];
   }
   if (ava !== undefined) {
    ava.className += " " + effects[rand(effects.length)];
   }
  }
  var timer1 = new Timer(function(){
   randOn();
   timer2.start(0.05);
  }),
  timer2 = new Timer(function(){
   skewOff(); // Equivalent to randOff();
   timer1.start(Math.random()*4);
  });
  timer1.start();

  // Randomly fade in and out opacity of static overlay
  function opacityFade(opacity) {
   var direction = (opacity > staticdiv.style.opacity),
       fade = setInterval(function(){
    if (opacity == Number(staticdiv.style.opacity)) {
     clearInterval(fade);
     opacityFadeRun();
    } else {
     staticdiv.style.opacity = (direction) ?
      (Number(staticdiv.style.opacity) + 0.01).toPrecision(2) : // Gmod has floating point imprecision
      (Number(staticdiv.style.opacity) - 0.01).toPrecision(2);
     }
   }, 60);
  }
  // Random opacity values between 0.18 and 0.47, biased towards 0.28, via cubic function
  function opacityFadeRun() {
   opacityFade((0.6 * Math.pow(1.23 * Math.random() - 0.55, 3) + 0.28).toPrecision(2));
  }
  opacityFadeRun();

  // Edit avatar with CamanJS
  if (ava !== undefined) {
   if (!camanjs) {
    console.warn("Notice: CamanJS image editor disabled, most likely due to the webserver needing to enable PHP's OpenSSL extension. Visit " + 
    window.location.href.split('?')[0] + "php/code_caman_proxy.php?camanProxyUrl=" + ava.getElementsByTagName("img")[0].src + 
    " for more information.");
   } else {
    Caman.remoteProxy = "php/code_caman_proxy.php";
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
  }

  // Zalgo strings randomly flicker into text, incompatible with Gmod due to Unicode 
  if (!valve) {
   var status = document.getElementById("status");
   setInterval(function(){
    var zalgo = document.getElementById("zalgo");
    // Remove existing Zalgo text
    if (zalgo !== null) {
     zalgo.parentNode.removeChild(zalgo);
    }
    // Connecting to PonyLiving<span id="wait">...</span><br>gamemode: mapname
    var statusstr = status.innerHTML,
    // Find HTML tags to determine allowed positions for Zalgo text
    tag2, tag3, tag4, tag5, tags =
     [0,
      // <span id="wait">
      statusstr.indexOf("<"),
      tag2 = statusstr.indexOf(">"),
      // </span>
      tag3 = statusstr.indexOf("<", tag2),
      tag4 = statusstr.indexOf(">", tag3),
      // <br>
      tag5 = statusstr.indexOf("<", tag4),
      statusstr.indexOf(">", tag5),
      statusstr.length],
    /* Biasing on Zalgo position
       46/100 chance: between start             and  <span id="wait">  ("Connecting to PonyLiving")
       46/100 chance: between <br>              and  end               (gamemode: mapname)
        5/100 chance: between <span id="wait">  and  </span>           (loading dots)
        3/100 chance: between </span>           and  <br>              (before line break) */
    weighted = rand(100),
    set = (weighted < 46) ? 0 : (weighted < 92) ? 3 : (weighted < 97) ? 1 : 2,
    index = rand(tags[set*2+1]-tags[set*2], tags[set*2]+1);
    // Insert Zalgo, write to page
    status.innerHTML = statusstr.substring(0, index) + '<span id="zalgo">' + zalgoText() +
     "</span>" + statusstr.substring(index);
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
  setInterval(function(){document.getElementById("wait").innerText = stringFill(".", rand(9));},500);

  // Randomly selects div backgrounds from standard, flipped, and static
  function divFool(div) {
   var timerArray = [
    new Timer(function(){
     // div.style.backgroundImage = "url(img/div_fools1.gif)"; // Browser refetches image if it's not present on page
     div.className = div.className.replace(/foolsdiv\d/, "foolsdiv1");
     timerArray[rand(3)].start(Math.random()*2);
    }),
    new Timer(function(){
     div.className = div.className.replace(/foolsdiv\d/, "foolsdiv2");
     timerArray[rand(3)].start(Math.random()*2);
    }),
    new Timer(function(){
     div.className = div.className.replace(/foolsdiv\d/, "foolsdiv3");
     // Static background lasts half as long on average
     timerArray[rand(3)].start(Math.random());
    })];
   timerArray[0].start();
  }

  // Rapidly flickers text shadows between -25px and 25px, and between #000 and #900
  function shadowFool(div) {
   // Bias text offset towards 0px
   function offset() {
    return (4 * Math.pow(Math.random() - 0.5, 3) + 0.5) * 50 - 25;
   }
   // Assigns text offset and color
   setInterval(function(){
    var str = "",
        i = 7;
    do {
     str += offset() + "px " +
            offset() + "px #" + rand(10) + "00,";
    } while(i--);
    div.style.textShadow = str.slice(0, -1);
   }, 150);
  }

  // Apply effects to main div
  main.className += " foolsdiv1";
  divFool(main);
  shadowFool(main);

  // Apply effects to mustitle div if it exists
  if (mustitle !== undefined) {
   mustitle.className += " foolsdiv1";
   divFool(mustitle);
   shadowFool(mustitle);

   // Alternate title for Rainbow Tylenol (Equestria font doesn't support ²)
   if (song == "Kitsune² - Rainbow Tylenol (Slow Black MIDI)") {
    song = "Kitsune^2 - Rainbow Tylenol (Slow Black MIDI)";
   }
   // For songs edited from the original, flicker song title between standard and edited names
   // e.g.: "Friendship is Magic - Bats" and "Friendship is Magic - Bats (Reversed)"
   if (song.indexOf("(") != -1) {
    var song2 = song.substring(0, song.indexOf("(")-1),
    timer3 = new Timer(function(){
     mustitle.innerText = song;
     timer4.start(0.15);
    }),
    timer4 = new Timer(function(){
     mustitle.innerText = song2;
     timer3.start(Math.random()*2);
    });
    timer3.start();
   // Otherwise, just update song title for new song
   } else {
    mustitle.innerText = song;
   }
  }

  // Flickers random quotes from entire set
  var quote = document.getElementsByClassName("quote")[0];
  if (quote === undefined) {
   quote = document.createElement("div");
   quote.className = "quote";
   main.insertBefore(quote, document.getElementsByClassName("credit")[0]);
  }
  $.get("misc/quotes.txt", function(data){
   var quotes = [];
   // Remove duplicated Valentine quotes that were used to bias against last quote
   data["valentine"] = data["valentine"].slice(-3);
   // Build quote array, triplicating all quote sets except TPP quotes, which greatly outnumber the other quotes
   // Triplicating non-TPP quotes is an easy biasing method
   Object.keys(data).forEach(function(x){quotes = (x != "helix") ? quotes.concat(data[x],data[x],data[x]) : quotes.concat(data[x]);});
   setInterval(function(){quote.innerText=quotes[rand(quotes.length)];},200);
  }, "json");

  // Adds transparent pulsing overlay of creepy character
  // Animated by CSS3 in css/effect_fools.css, uses opacitypulse1 by default, opacitypulse2 offers more opacity
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
  bgcover.style.backgroundImage = "url(img/" + bg + ")";
  document.body.appendChild(bgcover);
  // Extra calibrations and effects for specific images
  switch (bg) {
   // Sonic.EXE has an animated overlay that's separated out of the original image,
   // which uses opacitypulse2 and a z-index above the static layer
   case "foolbg_sonicexe.png":
    var exegif = document.createElement("div");
    exegif.className = "exegifcover";
    exegif.style.height = window.innerHeight + "px";
    exegif.style.width  = window.innerWidth  + "px";
    document.body.appendChild(exegif);
    break;
   // Pinkamena is aligned to bottom, flickers to Pinkamena-Zalgo, uses className to prevent re-fetching
   case "foolbg_pinkamena.png":
    bgcover.style.backgroundImage = "";
    var timer5 = new Timer(function(){
     bgcover.className = "bgcover zpinkamenacover";
     timer6.start(0.15);
    }),
    timer6 = new Timer(function(){
     bgcover.className = "bgcover pinkamenacover";
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


/* StaticGen (by Marek Lenik)
   Adds an old TV-like noise/static effect through a canvas
  (c) @criography Marek Lenik MIT License
*/
var StaticGen = (function(){
 "use strict";
 var container,        // Container element
     c,                // Main canvas element
     ctx,              // Main canvas's context
     sprite,           // Sprite (pre-render) canvas element
     spriteCtx,        // Sprite (pre-render) canvas context
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
     0,                                 // Sprite X
     currentFrame * options.tileHeight, // Sprite Y
     options.tileWidth,                 // Sprite tile width
     options.tileHeight,                // Sprite tile height
     x * actualTileWidth,               // Canvas X
     y * actualTileHeight,              // Canvas Y
     (options.stretchH === "fit"        // Canvas tile Width
      ? options.width  : ((options.stretchH > 1) ? actualTileWidth  : options.tileWidth)),
     (options.stretchV === "fit"        // Canvas tile Height
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
  "\u030d", /* ̍ */    "\u030e", /* ̎ */    "\u0304", /* ̄ */    "\u0305", /* ̅ */
  "\u033f", /* ̿ */    "\u0311", /* ̑ */    "\u0306", /* ̆ */    "\u0310", /* ̐ */
  "\u0352", /* ͒ */    "\u0357", /* ͗ */    "\u0351", /* ͑ */    "\u0307", /* ̇ */
  "\u0308", /* ̈ */    "\u030a", /* ̊ */    "\u0342", /* ͂ */    "\u0343", /* ̓ */
  "\u0344", /* ̈́ */    "\u034a", /* ͊ */    "\u034b", /* ͋ */    "\u034c", /* ͌ */
  "\u0303", /* ̃ */    "\u0302", /* ̂ */    "\u030c", /* ̌ */    "\u0350", /* ͐ */
  "\u0300", /* ̀ */    "\u0301", /* ́ */    "\u030b", /* ̋ */    "\u030f", /* ̏ */
  "\u0312", /* ̒*/    "\u0313", /* ̓ */    "\u0314", /* ̔ */    "\u033d", /* ̽ */
  "\u0309", /* ̉ */    "\u0363", /* ͣ */    "\u0364", /* ͤ */    "\u0365", /* ͥ */
  "\u0366", /* ͦ */    "\u0367", /* ͧ */    "\u0368", /* ͨ */    "\u0369", /* ͩ */
  "\u036a", /* ͪ */    "\u036b", /* ͫ */    "\u036c", /* ͬ */    "\u036d", /* ͭ */
  "\u036e", /* ͮ */    "\u036f", /* ͯ */    "\u033e", /* ̾ */    "\u035b", /* ͛ */
  "\u0346", /* ͆ */    "\u031a"  /* ̚ */
 ];
 var zalgoMid = [
  "\u0315", /* ̕ */    "\u031b", /* ̛ */    "\u0340", /* ̀ */    "\u0341", /* ́ */
  "\u0358", /* ͘ */    "\u0321", /* ̡ */    "\u0322", /* ̢ */    "\u0327", /* ̧ */
  "\u0328", /* ̨ */    "\u0334", /* ̴ */    "\u0335", /* ̵ */    "\u0336", /* ̶ */
  "\u034f", /* ͏ */    "\u035c", /* ͜ */    "\u035d", /* ͝ */    "\u035e", /* ͞ */
  "\u035f", /* ͟ */    "\u0360", /* ͠ */    "\u0362", /* ͢ */    "\u0338", /* ̸ */
  "\u0337", /* ̷ */    "\u0361", /* ͡ */    "\u0489"  /* ҉_ */        
 ];
 var zalgoDown = [
  "\u0316", /* ̖ */    "\u0317", /* ̗ */    "\u0318", /* ̘ */    "\u0319", /* ̙ */
  "\u031c", /* ̜ */    "\u031d", /* ̝ */    "\u031e", /* ̞ */    "\u031f", /* ̟ */
  "\u0320", /* ̠ */    "\u0324", /* ̤ */    "\u0325", /* ̥ */    "\u0326", /* ̦ */
  "\u0329", /* ̩ */    "\u032a", /* ̪ */    "\u032b", /* ̫ */    "\u032c", /* ̬ */
  "\u032d", /* ̭ */    "\u032e", /* ̮ */    "\u032f", /* ̯ */    "\u0330", /* ̰ */
  "\u0331", /* ̱ */    "\u0332", /* ̲ */    "\u0333", /* ̳ */    "\u0339", /* ̹ */
  "\u033a", /* ̺ */    "\u033b", /* ̻ */    "\u033c", /* ̼ */    "\u0345", /* ͅ */
  "\u0347", /* ͇ */    "\u0348", /* ͈ */    "\u0349", /* ͉ */    "\u034d", /* ͍ */
  "\u034e", /* ͎ */    "\u0353", /* ͓ */    "\u0354", /* ͔ */    "\u0355", /* ͕ */
  "\u0356", /* ͖ */    "\u0359", /* ͙ */    "\u035a", /* ͚ */    "\u0323"  /* ̣ */
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


/* Timer.js (by Yuriy Husnay)
   Simple and lightweight JavaScript timer
   MIT
*/
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
 this.timeout = setTimeout(function(){instance.end.call(instance);},duration * 1000);
};

// Clear timer and run function
Timer.prototype.end = function() {
 clearTimeout(this.timeout);
 this.onend.apply(this);
};