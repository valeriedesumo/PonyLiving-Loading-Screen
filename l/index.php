<?php
 /* Log Redirector (by Valerie Desumo)
     Redirects viewer to whatsmyip.org or Steam profiles

     http://www.ponyliving.com/files/loading/l/
     ?u         URL             {STEAMID},{IP}
 */

 // UPDATE: FILTER_SANITIZE_STRING is deprecated
 // Sanitise $_GET
 // $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);

 if (isset($_GET['u'])) {
  array_walk($_GET, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
  // If input is IP address, redirect to whatsmyip.org for geographical location
  if (preg_match('/\d+\.\d+\.\d+\.\d+/', $_GET['u'], $matches)) {
   header("Location: https://www.whatsmyip.org/ip-geo-location/?ip=$matches[0]");
   exit;
  // If input is SteamID, redirect to Steam profile
  } elseif (preg_match('/\d{17}/', $_GET['u'], $matches)) {
   header("Location: https://steamcommunity.com/profiles/$matches[0]");
   exit;
  }
 }

 // Redirect to logs.php if there is no input that matches IP or SteamID format
 header('Location: ../logs.php')
?>