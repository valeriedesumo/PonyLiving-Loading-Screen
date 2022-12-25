<?php
 $img = array("img/global/twilight_butterfly.gif",
              "img/global/applejack_crystal_berries.gif",
              "img/global/pinkie_cake.gif",
              "img/global/scootaloo_toast.gif",
              "img/global/spike_hay_fries.gif",
              "img/global/pinkie_chewing.gif",
              "img/global/luna_apple.gif",
              "img/global/rainbow_dash_birthday.gif",
              "img/global/fluttershy_milkshake.gif",
              "img/global/twilight_chewing.gif",
              "img/global/rarity_yuck.gif",
              "img/global/twilight_hamburger.gif",
              "img/global/luna_moonpie.gif",
              "img/global/pony_cupcake.gif",
              "img/global/rarity_chocolates.gif",
              "img/global/sweetiebelle_.gif");
 switch ($rand) {
  case 25:
   $imgtouse = "img/global/pinkie_suggestive_cupcake.gif";
   $rare = "#1";
   break;
  case 50:
   $imgtouse = "img/global/twilight_butterfly_surprise.gif";
   $rare = "#2";
   break;
  case 75:
   $imgtouse = "img/global/celestia_banana.gif";
   $rare = "#3";
   break;
  case 100:
   $imgtouse = "img/global/coco_pommel_ice_cream.gif";
   $rare = "#4";
   break;
  default:
   $rare = false;
   break;
 }
?>