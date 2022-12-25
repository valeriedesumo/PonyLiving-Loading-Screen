<?php
 $img = array("img_valentine/caramac.gif",
	      "img_valentine/chrysalis_heart_nom.gif",
	      "img_valentine/chrysipuff.gif",
 	      "img_valentine/heart_chewing.gif",
	      "img_valentine/licking_drool.gif");
 if ($rand % 20 == 0) {
  $imgtouse = "img_valentine/octavia_heart.gif";
  $rare = "♥";
 } else {
  $imgtouse = $img[array_rand($img)];
  $rare = false;
 }
?>