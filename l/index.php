<?php
 /* Log Redirector
    Designed by Valerie (Ultimaximus)
     Redirects viewer to whatsmyip.org or Steam profiles

     http://www.ponyliving.com/files/loading/l/
     ?u		URL		{STEAMID},{IP}
 */

 // Sanitise $_GET
 $fget = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);

 if (isset($fget['u'])) {
  array_walk($fget, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
  // If input is IP address, redirect to whatsmyip.org for geographical location
  if (preg_match('/\d+\.\d+\.\d+\.\d+/', $fget['u'], $matches)) {
   header("Location: http://www.whatsmyip.org/ip-geo-location/?ip=$matches[0]");
   exit;
  // If input is SteamID, redirect to Steam profile
  } elseif (preg_match('/\d{17}/', $fget['u'], $matches)) {
   header("Location: http://steamcommunity.com/profiles/$matches[0]");
   exit;
  }
 }

 // Redirect to code_logs.php if there is no input that matches IP or SteamID format
 header('Location: http://www.ponyliving.com/files/loading/code_logs.php');
?>