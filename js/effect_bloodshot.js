/* Bloodshot (by Suraj Thapar)
    Displays an animated spatter of blood
*/

$(function() {
 // Customisable parameters
 var image  = "img/effect_spatter.png",
     width  = 300,
     height = 500;

 // Create and insert bloodshot canvas
 var c = document.createElement('canvas');
 c.id = "bloodshot";
 c.width  = width;
 c.height = height;
 document.body.insertBefore(c, document.body.firstChild);

 // Gmod requires webkit prefix
 window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

 // Returns random number with three decimal places
 function randNum(min, max) {
  return (Math.random()*(max-min)+min).toFixed(3);
 }

 // Returns random red color
 function bloodColor() {
  return 'rgb(' + parseInt(randNum(135, 200)) + ', 20, 20)';
 }

 // Creates red circle
 var ctx = c.getContext('2d'),
     numberOfBlood = 0;
 function theRedThing(x, y, newBloodColor) {
  var filler = ctx.createRadialGradient(x, y, randNum(10, 15), x, y, randNum(15, 35));
  filler.addColorStop(0.5, newBloodColor);
  filler.addColorStop(0.75, 'transparent');
  ctx.fillStyle = filler;
  ctx.fillRect(0, 0, 300, 300);
  numberOfBlood++;
 }

 // Creates drip under circle
 function drip(x, y1, time, dripColor) {
  x += parseInt(randNum(-10, 10), 10);
  var y2 = y1 + parseInt(randNum(80, 190)), // Drip length
      dy = y2 - y1,
      pi = Math.PI,
      startTime = Date.now(),
  f = function() {
   var y = y1 + (Date.now() - startTime) / time * dy,
       r = randNum(1, 5);
   ctx.beginPath();
   ctx.arc(x, y1, r, pi, 0);
   ctx.rect(x - r, y1, r * 2, y - y1);
   ctx.arc(x, y, r, 0, -pi);
   ctx.fillStyle = dripColor;
   ctx.fill();
   if (y < y2) {
    requestAnimationFrame(f);
   }
  };
  f();
 }

// Draws spatter image into canvas
 var img = new Image();
 img.onload = function() {
   ctx.drawImage(img, 0, 0, width, height);
 };
 img.src = image;


 // Main code
 var area_radius = 80, tries = 75, x_pos, y_pos, last_x = 0;
 for (var loop = 0; loop < tries; loop++) {
  x_pos = parseInt(randNum(0, 300));
  y_pos = parseInt(randNum(0, 300));
  if ((((x_pos-150)*(x_pos-150)+(y_pos-100)*(y_pos-150)) < area_radius*area_radius) && (x_pos > last_x + 18)) {
   var bloodishColor = bloodColor();
   drip(x_pos, y_pos, 2000, bloodishColor);
   theRedThing(x_pos, y_pos, bloodishColor);
   // last_x biases x_pos towards right
   last_x = x_pos;
   // tries biases numberOfBlood towards 3 to 5
   if (numberOfBlood < 3) {
    tries += 10;
   } else if (numberOfBlood > 5) {
    break;
   }
  }
 }
});