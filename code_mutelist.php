<?php
 /* Mutelist
    Designed by Valerie Desumo (Ultimaximus)
     Allows users to disable music on the loading screen
     Should only be accessed by the Gmod server, since there is no authentication to ensure that the user
     is inputting their own SteamID on this page

     http://www.ponyliving.com/files/loading/code_mutelist.php
     ?steamid	SteamID		{STEAMID}
     ?m		mute		enable,disable
 */

 // Sanitise $_GET
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);

 if (isset($get['steamid'])) {
  $steamid = $get['steamid'];
  // Checks that SteamID is a 17-digit number, does no additional authentication
  if (strlen($steamid) == 17 && is_numeric($steamid)) {
   $data = file_get_contents("db_mutelist.log");
   $loc = strpos($data, $steamid);
   // Request to enable music
   if ($get['m'] == "enable") {
    // If SteamID is in mutelist, remove it
    if ($loc === true) {
     $data = substr($data, 0, $loc) . substr($data, $loc + strlen($steamid) + 1);
     file_put_contents("db_mutelist.log", $data, LOCK_EX);
     echo "Music for $steamid enabled.";
    } else {
     echo "Music for $steamid is already enabled.";
    }
   // Request to disable music
   } elseif ($get['m'] == "disable") {
    // If SteamID is not in mutelist, add it
    if ($loc === false) {
     file_put_contents("db_mutelist.log", "$steamid\r\n", FILE_APPEND | LOCK_EX);
     echo "Music for $steamid disabled.";
    } else {
     echo "Music for $steamid is already disabled.";
    }
   }
  }
 }
?>