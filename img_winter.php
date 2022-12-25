<?php
 $img_add = array("img_winter/twilight_eats_many_birds.gif",
		  "img_winter/pony_carrot.gif",
		  "img_winter/oc_fast_candycane.gif",
		  "img_winter/pinkie_candycane.gif",
		  "img_winter/twilight_gingerbread_macro.gif");
 if ($rand == 41) {
  $imgtouse = "img_winter/suggestive_derpy.gif";
  $rare = "W1";
 } elseif ($rand == 34) {
  $imgtouse = "img_winter/pinkie_foodplay.gif";
  $rare = "W2";
 }
 $img = array_merge($img, $img_add);
?>