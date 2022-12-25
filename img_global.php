<?php
 $img = array("img/twilight_eats_butterfly.gif",
	      "img/applejack_crystal_berries.gif",
	      "img/pinkie_cake.gif",
	      "img/scootaloo_toast.gif",
	      "img/spike_hay_fries.gif",
	      "img/pinkie_pie_and_princess_celestia_eating.gif",
	      "img/princess_luna_eating_apple.gif",
	      "img/rainbow_dash_birthday.gif",
	      "img/fluttershy_sundae.gif",
	      "img/twilight_chewing.gif",
	      "img/rarity_yuck.gif",
	      "img/twilight_hamburger.gif",
	      "img/luna_moonpie.gif",
	      "img/wishdream_cupcake.gif",
	      "img/rarity_chocolates.gif",
	      "img/sweetiebelle_.gif");
 if ($rand % 25 == 0) {
  switch ($rand) {
   case 25:
    $imgtouse = "img/pinkie_pie_suggestive.gif";
    $rare = "#1";
    break;
   case 50:
    $imgtouse = "img/twilight_eats_butterfly_surprise.gif";
    $rare = "#2";
    break;
   case 75:
    $imgtouse = "img/celestia_banana.gif";
    $rare = "#3";
    break;
   default:
    $imgtouse = "img/coco_pommel_ice_cream.gif";
    $rare = "#4";
    break;
  }
 }
?>