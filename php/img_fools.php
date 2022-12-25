<?php
 $img = array("img/fools/applejack_crystal_berries.gif",
              "img/fools/pinkie_cake.gif",
              "img/fools/spike_hay_fries.gif",
              "img/fools/rainbow_dash_birthday.gif",
              "img/fools/fluttershy_milkshake.gif",
              "img/fools/twilight_chewing.gif",
              "img/fools/rarity_yuck.gif",
              "img/fools/luna_moonpie.gif",
              "img/fools/pony_cupcake.gif",
              "img/fools/rarity_chocolates.gif",
              "img/fools/sweetiebelle_.gif");
 $imgtouse = $img[array_rand($img)];
 $rare = false;
 // If requested directly (by js/effect_fools.js), output URL
 if (!isset($get)) {
  echo $imgtouse;
 }
?>