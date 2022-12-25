<?php
 $img = array("img_fools/applejack_crystal_berries.gif",
	      "img_fools/pinkie_cake.gif",
	      "img_fools/spike_hay_fries.gif",
	      "img_fools/rainbow_dash_birthday.gif",
	      "img_fools/fluttershy_sundae.gif",
	      "img_fools/twilight_chewing.gif",
	      "img_fools/rarity_yuck.gif",
	      "img_fools/luna_moonpie.gif",
	      "img_fools/wishdream_cupcake.gif",
	      "img_fools/rarity_chocolates.gif",
	      "img_fools/sweetiebelle_.gif");
 $imgtouse = $img[array_rand($img)];
 $rare = false;
 // If requested directly (by effect_fools.js), set header to image
 if (!isset($get)) {
  header("Location: http://www.ponyliving.com/files/loading/" . $imgtouse);
  exit;
 }
?>