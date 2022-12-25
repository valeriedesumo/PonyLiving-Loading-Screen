<?php
 $img = array("img/valentine/caramac_drink.gif",
              "img/valentine/chrysalis_heart_nom.gif",
              "img/valentine/chrysipuff.gif",
              "img/valentine/fluffle_puff_licking_drool.gif",
              "img/valentine/chrysalis_heart_chewing.gif");
 if ($rand % 20 == 0) {
  $imgtouse = "img/valentine/octavia_suggestive_heart.gif";
  $rare = "♥";
 } else {
  $imgtouse = $img[array_rand($img)];
  $rare = false;
 }
?>