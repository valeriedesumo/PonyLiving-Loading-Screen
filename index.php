<?php
 /* PonyLiving Loading Screen (by Valerie Desumo)
     Handles most code
     Javascript effects, global and theme-specific image and music handlers, and CSS are include files

     http://www.ponyliving.com/files/loading/

     URL Parameters:
     ?steamid   Steam ID        {STEAMID64}
      Used for avatar display, song disabling via mutelist, logging data, usually passed in by Gmod
     ?mapname   map             {mapname}
      Used for server identification for logs, usually passed in by Gmod
     ?d         debug           on,off
      Debug mode, showing PHP errors and variables, previously included jPlayer Inspector

     Overrides:
     ?t         theme           spring,summer,autumn,fall,winter,halloween,valentine,standard,fools
     ?date      date            {MMDD}
      Date, in 2-digit month and date format
     ?r         random number   {1-100}
      Used for rare images, specified or overridden by theme-specific code
     ?b         PL anniversary  on,off
      Birthday message and cupcake
     ?h         TPP anniversary on,off
      Twitch Plays Pokemon quotes and Helix fossil
     ?s         song            music/{THEME}/{SONG}.ogg,mute
     ?i         image           img/{THEME}/{IMAGE}.gif
     ?v         Valve           on,off
      If browser is Gmod (or Steam), logs more data when enabled, displays example server data when disabled
     ?f         Fools type      0,1,2,3
      Fools effect, a creepy static-covered theme with jitters, text corruption, and background imagery
      0: Disabled
      1: Enabled, transitions from original theme
      2: Enabled, no transition
      3: Static on original theme only

     Example URL: http://www.ponyliving.com/files/loading/?t=spring&steamid=76561198025003452&d=on
 */
?>
<!DOCTYPE html>
<!-- Designed by Valerie Desumo (Ultimaximus) -->
<html lang="en">
<head>
<meta charset="utf-8">
<title>PonyLiving</title>
<link rel="icon" href="favicon.ico">
<script src="js/code_jquery_2.1.1.min.js"></script>
<?php
 // https://steamcommunity.com/dev/apikey
 $key = "XXX";

 /* UPDATE: FILTER_SANITIZE_STRING is deprecated, now the standard practice is to only filter when input is used as output,
 so that the actual relevant filter (HTML, SQL, etc) can be used.

 // Sanitise $_GET and $_SERVER
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
 if (!is_null($get)) {
  array_walk($get, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
 }
 $server = filter_input_array(INPUT_SERVER, FILTER_SANITIZE_STRING);
 */

 $get = $_GET;
 $server = $_SERVER;

 // Debug mode
 $debug = (isset($get['d']) && $get['d'] == "on");
 if ($debug) {
  error_reporting(-1);
 }

 if (isset($get['steamid'])) {
  $steamid = $get['steamid'];
  // If SteamID is in mutelist, music is disabled
  if (strpos(file_get_contents("db/mutelist.log"), $steamid) !== false) {
   $songrequest = "mute";
  }
 }

 // Song override
 if (!isset($songrequest)) {
  $songrequest = isset($get['s']) ? $get['s'] : "";
 }

 // Checks if viewer is using Gmod browser
 // "Valve Steam GameOverlay" will match Steam browser
 $valve = isset($server['HTTP_USER_AGENT']) ? preg_match('/Valve Source Client/i', $server['HTTP_USER_AGENT']) : 0;

 // Gmod browser override
 if (isset($get['v'])) {
  if ($get['v'] == "on") {
   $valve = 1;
  } elseif ($get['v'] == "off") {
   $valve = 0;
  }
 }

 // Date override
 if (isset($get['date']) && strlen($get['date']) == 4 && is_numeric($get['date']) &&
 checkdate(substr($get['date'],0,2), substr($get['date'],2,2), 2000)) {
  $month = substr($get['date'], 0, 2);
  $date = substr($get['date'], 2, 2);
 } else {
  $month = date('n');
  $date = date('j');
 }

 $fool = 0;
 // Enable 1/2000 chance for Fools type 3 (static) slightly before and during Halloween theme
 if (($month == 10 && $date >= 12) || ($month == 11 && $date <= 7)) {
  if (rand(1,2000) == 13) {
   $fool = 3;
  }
 }
 // Enable 1/10000 chance for Fools type 1 (transition) when it's not Halloween theme, can override type 3 during pre-Halloween
 if (!($month == 10 && $date >= 17) && !($month == 11 && $date <= 7)) {
  if (rand(1,10000) == 13) {
   $fool = 1;
  }
 } else {
  // Enable increasing chance for Fools type 1 during Halloween theme, can override Fools type 3
  $probhallow = array(144,255,512,666,777,999,1313,2584,2718,3141,4825,6666,8128,8191,9001,10000);
  if (rand(1, $probhallow[($month == 10) ? 31 - $date : $date]) == 13) {
   $fool = 1;
  }
 }

 // Random value override (for rare images and log pruning)
 $img3d = false;
 if (isset($get['r']) && is_numeric($get['r'])) {
  $rand = $get['r'];
  if ($rand == 69) {
   $img3d = true;
  }
 // 1/10000 chance for Gfycat rare
 } elseif (rand(1,10000) == 69) {
  $img3d = true;
 }

 // Create random number (1/100) if it isn't overridden
 if(!isset($rand)) {
  $rand = rand(1,100);
 }

 // Enable Fools type 2 on April 1st
 if ($month == 4 && $date == 1) {
  $fool = 2;
 }

 // Gets contents from address, using PHP's cURL extension if enabled on the server
 function http_get_contents($url) {
  if (in_array("curl", get_loaded_extensions())) {
   $handle = curl_init();
   curl_setopt($handle, CURLOPT_URL, $url);
   curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 3);
   //curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);
   $data = curl_exec($handle);
   $errnum = curl_errno($handle);
   $errmsg = curl_error($handle);
   curl_close($handle); // No longer necessary in PHP 8
   // If data couldn't be fetched, set variable for display in debug mode and retry
   if ($errnum) {
    global $curlerrors;
    $curlerrors[parse_url($url, PHP_URL_HOST)] = "ERROR $errnum" . ((empty($errmsg)) ? "" : " - $errmsg");
    return @file_get_contents($url);
   }
   return $data;
  } else {
   return @file_get_contents($url);
  }
 }

 // Uses geoPlugin service to detect hemisphere
 $ip = $server['REMOTE_ADDR'];
 $geo = http_get_contents("http://www.geoplugin.net/php.gp?ip=$ip");
 $geo = unserialize($geo);
 if (is_array($geo) && array_key_exists('geoplugin_latitude', $geo)) {
  $hemi = ($geo['geoplugin_latitude'] < 0) ? "south" : "north";
 } else {
  $hemi = "north";
 }

 // Determines theme
 // Holiday Themes
 if (($month == 10 && $date >= 17) || ($month == 11 && $date <= 7)) {
  $theme = "halloween";
 } elseif ($month == 2 && $date >= 10 && $date <= 16) {
  // Increasing chance for Gfycat rare during Valentine theme
  $probgfy = array(512,969,1313,2718,4825);
  if (rand(1, $probgfy[abs(14 - $date)]) == 69) {
   $img3d = true;
  }
  $theme = "valentine";
 } elseif ($month == 6 && $date >= 25 && $date <= 29) {
  $theme = "standard";
 } else {
  // Seasonal Themes (based on month)
  // Seasons technically start on the 21st, this is ignored for simplification and to match real-world weather
  /* Months   North   South
   01,02,12  Winter  Summer
   03,04,05  Spring  Autumn
   06,07,08  Summer  Winter
   09,10,11  Autumn  Spring */
  $season = array("winter","spring","summer","autumn","winter","spring","summer");
  if ($hemi == "north") {
   $theme = $season[floor($month / 3)];
  } else {
   $theme = $season[floor($month / 3) + 2];
  }
 }

 // Theme override ("fall" is an alias for "autumn"), will disable randomly-occurring and April 1st Fools
 if (isset($get['t'])) {
  $themerequest = $get['t'];
  if ($themerequest == "fall") {
   $theme = "autumn";
   $fool = 0;
  } elseif (file_exists("css/theme_$themerequest.css")) {
   $theme = $themerequest;
   $fool = 0;
  }
 }

 // Fools override (enforces 0, 1, 2, or 3)
 if (isset($get['f']) && ctype_digit($get['f']) && floor($get['f']/4) == 0) {
  $fool = $get['f'];
 }
 // Fools type 2 overrides theme, Fools theme overrides Fools type
 if ($fool == 2) {
  $theme = "fools";
 } elseif ($theme == "fools") {
  $fool = 2;
 }

 // Twitch Plays Pokemon anniversary
 $helix = false; // Apologies, Helix is always true
 if ($month == 3 && $date == 1) {
  $helix = true;
 }
 // TPP override
 if (isset($get['h'])) {
  if ($get['h'] == "on") {
   $helix = true;
  } elseif ($get['h'] == "off") {
   $helix = false;
  }
 }

 // PonyLiving anniversary
 $birthday = false;
 if ($month == 6 && $date == 27) {
  $birthday = true;
 }
 // Anniversary override
 if (isset($get['b'])) {
  if ($get['b'] == "on") {
   $birthday = true;
  } elseif ($get['b'] == "off") {
   $birthday = false;
  }
 }

 /* UPDATE: Autoplay audio is no longer allowed
 // jPlayer Javascript
 if ($songrequest != "mute") {
  echo '<script src="js/code_jquery_jplayer.min.js"></script>' . "\n";
  if ($debug) {
   echo '<script src="js/code_jquery_jplayer_inspector.js"></script>' . "\n";
  }
 }
 */

 /* UPDATE: Gfycat cajax endpoint is no longer available
 // Gfycat Javascript
 if ($img3d) {
  echo '<script src="js/code_gfycat.min.js"></script>' . "\n";
 }
 */

 // Fools Javascript
 if ($fool) {
  echo '<script src="js/code_caman.min.js"></script>
<script src="js/effect_fools.js"></script>' . "\n";
 }

 // Seasonal effects Javascript/CSS
 switch ($theme) {
  case "spring":
   echo '<script src="js/effect_birds.js"></script>' . "\n";
   break;
  case "autumn":
   echo '<script src="js/effect_falling_leaves.js"></script>' . "\n";
   break;
  case "winter":
   echo '<script src="js/effect_snowstorm.js"></script>' . "\n";
   break;
  case "halloween":
   echo '<script src="js/effect_bloodshot.js"></script>' . "\n";
   break;
  case "valentine":
   echo '<script src="js/effect_rising_hearts.js"></script>' . "\n";
   break;
  case "summer":
   echo '<link type="text/css" rel="stylesheet" href="css/effect_sunrays.css">' . "\n";
   break;
 }

 // Theme CSS
 echo '<link type="text/css" rel="stylesheet" href="css/theme_' . $theme . '.css"';
 // Attribute for Fools
 if ($fool == 1) {
  echo ' id="theme">' . "\n";
 } else {
  echo ">\n";
 }
 if ($fool) {
  echo '<link type="text/css" rel="stylesheet" href="css/effect_fools.css">' . "\n";
 }
?>
</head>
<body>
<?php
 // Retrieve Steam user information
 if (isset($steamid)) {
  $data = http_get_contents("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$key&steamids=$steamid");
  $data = json_decode($data, true);
  if (!is_null($data) && array_key_exists(0, $data['response']['players'])) {
   $avatar = $data['response']['players'][0]['avatarmedium'];
  } else {
   $avatar = "img/avatar_unknown.jpg";
  }
 } else {
  // A default avatar for demonstration purposes, usually wouldn't be set
  $avatar = "img/avatar_default.jpg";
 }
 unset($key);

 // Display Helix Fossil for TPP, cupcake for anniversary, or avatar otherwise (if available)
 if ($helix) {
  $avadiv = '<div class="ava"><img src="img/avatar_helix.png" alt=""';
 } elseif ($birthday) {
  $avadiv = '<div class="ava"><img src="img/avatar_cupcake.png" alt=""';
 } elseif (isset($avatar) && !is_null($avatar)) {
  $avadiv = '<div class="ava"><img src="' . $avatar . '" class="round" alt=""';
 }
 // Attribute for Fools' CamanJS
 if (isset($avadiv)) {
  if ($fool == 1 || $fool == 2) {
   $avadiv .= ' id="sincity"';
  }
  echo "$avadiv></div>\n";
 }

 // Theme-specific HTML
 // Summer: Sunrays
 if ($theme == "summer") {
  echo '<div class="sunray">
<div class="outer">
<b></b><b></b><b></b>
<b></b><b></b><b></b>
<b></b><b></b><b></b>
</div>
</div>' . "\n";
 // Halloween: Ghosts
 } elseif ($theme == "halloween") {
  echo '<div class="hyudoro" style="text-align: left; left: 0px;"><img src="img/effect_hyudoro_left.gif" alt=""></div>
<div class="hyudoro" style="text-align: right; right: 0px;"><img src="img/effect_hyudoro_right.gif" alt=""></div>' . "\n";
 }
?>
<div class="main">
<span id="status">Connecting to PonyLiving<span id="wait"></span></span>
<script>
 // Displays loading dots
 var initial = setInterval(
  function() {
   var wait = document.getElementById("wait");
   wait.textContent = (wait.textContent.length >= 3) ? "" : wait.textContent += ".";
  }, 800);
 
 // Shows server information, automatically run by Gmod client
 function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
  var status = document.getElementById("status");
  // Renames TTT and ZS for readability
  if (gamemode == "terrortown") {
   gamemode = "Trouble in Terrorist Town";
  } else if (gamemode == "zombiesurvival") {
   gamemode = "Zambie Survival";
  }
  status.innerHTML += "<br>" + gamemode + ": " + mapname;
 }
<?php
 // Uses example values for display in web browser
 if (!$valve) {
  echo ' // Example values
 GameDetails("PonyLiving.com PonyRP City |OC Creator|", "http://www.ponyliving.com/files/loading/",
             "gm_example", 60, "76561198025003452", "webtest");' . "\n";
 }

 // Returns random song from global and/or theme-specific set (configured by music theme code)
 // Song variable will always end in .ogg
 function randSong($type) {
  $music = array();
  $musadd = true;
  if (file_exists("php/music_$type.php")) {
   include("php/music_$type.php");
  }
  // Include global songs unless music theme specifies otherwise
  if ($musadd) {
   $music = array_merge($music, include("php/music_global.php"));
  }
  return $music[array_rand($music)];
 }
 
 // Makes song URL, overridden by song request, mute, or Gfycat rare
 if (file_exists($songrequest) && (substr($songrequest,strlen($songrequest)-4,4) == ".ogg")) {
  $song = "php/music.php?s=$songrequest";
 } elseif ($songrequest == "mute" || $valve) { // Audio is no longer possible in Gmod
  $song = "";
 } elseif ($img3d) {
  $song = "php/music.php?s=music/main/George Michael - Careless Whisper (Instrumental).ogg";
 } elseif ($helix && !$fool) {
  $song = "php/music.php?s=" . randSong("helix");
 } else {
  $song = "php/music.php?s=" . randSong($theme);
 }

 // Adjust music volume
 if (!empty($song)) {
  echo ' window.onload = function(){document.getElementsByTagName("audio")[0].volume=0.4;};' . "\n";
 }

 // Sends javascript parameters to effect_fools.js: fool(type, camanjs, valve, song)
 if ($fool) {
  echo " $(function(){fool($fool, ";
  if ((parse_url($avatar, PHP_URL_SCHEME) == "https") && !in_array("openssl", get_loaded_extensions())) {
   echo "false, ";
  } else {
   echo "true, ";
  }
  echo ($valve ? "true" : "false");
  if ($fool == 1 && !empty($song)) {
   echo ', "' . randSong("fools") . '"';
  }
  echo ");});\n";
 }
?>
</script><br>
<?php
 // Generates log data for joins and views (human-readable flat-file)
 // Example: 31 Dec '69 23:59	127.0.0.1	76561190000000000	City		Username
 $log = gmdate('d M \'y H:i') . "\t$ip";
 // Further processing for more data only for Gmod users
 if ($valve) {
  // 1/100 chance to schedule join database pruning, only keep joins for 6 days
  // (Easier than scheduling prunes per viewcount, less cpu/memory-intensive than pruning during every view)
  if ($rand == 63) {
   $joinlist = file("db/joins.log");
   // Gets representative time for age of oldest joins, processing due to date format
   // Prunes old joins in chunks of 150
   $reptime = array_key_exists(150, $joinlist) ? $joinlist[150] : end($joinlist);
   $reptime = strtotime(str_replace("'", "20", substr($reptime, 0, 16)));
   if ($joinlist !== false && (time()-$reptime > 518400)) {
    file_put_contents("db/joins.log", implode(array_slice($joinlist, 150)), LOCK_EX);
   }
  }
  // Records SteamID and username, associates SteamID with IP in json files
  $log2 = "";
  if (isset($steamid)) {
   $log .= "\t$steamid";
   if (!is_null($data) && array_key_exists(0, $data['response']['players'])) {
    $log2 = "\t\t" . $data['response']['players'][0]['personaname'];
   }
   // Writes to db/steamid-ip.log (IPs of SteamIDs) if not already logged in the past
   $iplist = json_decode(file_get_contents("db/steamid-ip.log"), true);
   if (array_key_exists($steamid,$iplist) && !in_array($ip,$iplist[$steamid],true)) {
    $iplist[$steamid][] = $ip;
    file_put_contents("db/steamid-ip.log", json_encode($iplist), LOCK_EX);
    // Writes to db/ip-steamid.log (IPs With Multiple SteamIDs) if IP address is associated with more than 1 SteamID
    $steamofip = array_filter($iplist,function($ary)use($ip){return in_array($ip,$ary,true);});
    if (count($steamofip) > 1) {
     $steamlist = json_decode(file_get_contents("db/ip-steamid.log"), true);
     if (!is_null($steamlist)) {
      $steamlist[$ip] = array_keys($steamofip);
      file_put_contents("db/ip-steamid.log", json_encode($steamlist), LOCK_EX);
     }
    }
   }
  } else {
   $log .= "\t\t\t";
  }
  // Records server based on current map
  if (isset($get['mapname'])) {
   // When server is identifiable by first two letters of map name
   switch (substr($get['mapname'], 0, 2)) {
    case "rp":
     $log .= "\tCity";
     break;
    case "gm":
     $log .= "\tIslands";
     break;
    case "th":
     $log .= "\tCinema";
     break;
    case "tt":
     $log .= "\tTTT";
     break;
    case "cs":
     $log .= "\tZambie";
     break;
    // When server isn't identifiable by just first two letters of map name
    default:
     if ($get['mapname'][0] == "z") {
      $log .= "\tZambie";
     } elseif (strpos($get['mapname'], "cinema") !== false) {
      $log .= "\tCinema";
     } else {
      // Records map name if no match is found
      $log .= "\t" . $get['mapname'];
      $log2 = substr($log2, 1);
     }
     break;
   }
  } else {
   // Under normal circumstances, there should be a map name provided by Gmod
   // This should only run if the User Agent is spoofed and map name isn't provided
   $log .= "\t???";
  }
  $log .= $log2;
 }
 // After processing, append log data
 file_put_contents("db/joins.log", "$log\r\n", FILE_APPEND | LOCK_EX);
 // Write log to db/fools.log if Fools is activated by chance (not by override)
 if ($fool && $fool != 2 && !is_string($fool)) {
  // Add Fools type
  $log = substr_replace($log, "\t$fool", (isset($steamid) ? stripos($log, "\t", 40) : stripos($log, "\t\t\t\t") + 3), 0);
  file_put_contents("db/fools.log", "$log\r\n", FILE_APPEND | LOCK_EX);
 }

 // Include code for determining image, with global and theme-specific images
 // Themes may override global images, and will handle rare image chances with accompanying labels
 include("php/img_global.php");
 if (file_exists("php/img_$theme.php")) {
  include("php/img_$theme.php");
 }

 // Image override (disables rare images and label, Gfycat rare (Gfycat Javascript will still be imported on page))
 if (isset($get['i']) && file_exists($get['i']) && (pathinfo($get['i'], PATHINFO_EXTENSION) == "gif")) {
  $imgtouse = $get['i'];
  $rare = false;
  $img3d = false;
 } elseif ($img3d) {
  // Gfycat rare label
  $rare = "! ! !";
  // Write log to db/rare.log if Gfycat rare is activated by chance (not by override)
  if (!is_string($rand)) {
   file_put_contents("db/rare.log", "$log\r\n", FILE_APPEND | LOCK_EX);
  }
 }

 // Determine image from generated array if image is not rare or overridden
 if (!isset($imgtouse)) {
  $imgtouse = $img[array_rand($img)];
 }

 /*  Gfycat cajax endpoint is no longer available
 // Display Gfycat rare or image
 if ($img3d) {
  echo '<img class="gfyitem cen" data-id="ComfortableSlightBlackrussianterrier" data-controls="false">' . "\n";
 } else {
  echo '<img src="' . $imgtouse . '" alt="" class="cen">' . "\n";
 }
 */

 // Display rare or image
 echo '<img src="' . ($img3d ? "img/global/fluttershy_grass.gif" : $imgtouse) . '" alt="" class="cen">';

 // Rare label
 if ($rare !== false) {
  echo '<span class="rare">' . "$rare</span><br>\n";
 } else {
  echo "<br>\n";
 }

 // Determines message type
 if ($birthday) {
  $msg = "birthday";
 } elseif ($month == 2 && $date == 13) {
  $msg = "birthdayvalerie";
 } elseif ($month == 2 && $date == 11) {
  $msg = "birthdayreorp";
 } elseif ($helix) {
  $msg = "helix";
  // Check both theme and month+date in case of overrides
 } elseif (($theme == "valentine" && $month ==  2 && $date == 14) ||
 ($theme == "halloween" && $month == 10 && $date == 31) || $theme == "standard") {
  $msg = $theme;
 }
 
 // Retrives and displays message from quote file
 if (isset($msg)) {
  $msglist = json_decode(file_get_contents("misc/quotes.txt"), true);
  if (!is_null($msglist)) {
   $msg = $msglist[$msg][array_rand($msglist[$msg])];
   echo '<div class="quote">' . "$msg</div>\n";
  }
 }

 /* Autoplay audio is no longer allowed
 // Enables jPlayer Inspector if debug mode is enabled
 if ($debug) {
  echo '<div id="jplayer_inspector"></div>' . "\n";
 }
 */
?>
<div class="credit">Designed By: Valerie Desumo (Ultimaximus)</div>
<?php
 // PHP variable display for debug mode
 if ($debug) {
  // Unsets large, redundant, or pre-processing variables
  unset($server, $get, $season, $avadiv, $joinlist, $iplist, $log2, $img, $msglist);
  $vars = get_defined_vars();
  unset($vars['GLOBALS']);
  // Formats ampersands for HTML validation
  $vars['_SERVER']['QUERY_STRING'] = htmlspecialchars($vars['_SERVER']['QUERY_STRING']);
  $vars['_SERVER']['REQUEST_URI'] = htmlspecialchars($vars['_SERVER']['REQUEST_URI']);
  // Formats geoPlugin array to remove link that was inheriting CSS
  if (is_array($geo) && array_key_exists('geoplugin_credit', $geo)) {
   $vars['geo']['geoplugin_credit'] = strip_tags($vars['geo']['geoplugin_credit']);
  }
  // Formats true, false, and null as text for display
  array_walk($vars, $disp = function(&$val) use(&$disp) {
   if ($val === true) {
    $val = "true";
   } elseif ($val === false) {
    $val = "false";
   } elseif (is_null($val)) {
    $val = "null";
   } elseif (is_array($val)) {
    array_walk($val,function(&$val)use($disp){$disp($val);});
   }
  });
  // unset($vars['_SERVER']); // Comment out for debugging, uncomment for security
  echo "<pre>" . print_r($vars, true) . "</pre>\n";
 }
?>
</div>
<?php
 // Audio HTML and JS
 if (!empty($song)) {
  // Display formatted music title
  echo '<div class="mustitle">' . urldecode(substr($song, strpos($song,"/",25)+1, -4)) . "</div>\n";
  // Fix ampersands
  $song = str_replace("&", "%26", $song);
  /* Autoplay audio is no longer allowed
  // jPlayer code
  echo '<div id="jquery_jplayer"></div>' . "\n";
  if ($fool) {
   echo '<div id="jplayer_static"></div>' . "\n";
  }  ?>
<script>
$(document).ready(function() {
 $("#jquery_jplayer").jPlayer({
  ready: function() {
   $(this).jPlayer("setMedia", {
    // Sets song, ogg and mp3 file format
    oga: "<?=$song?>",
    mp3: "<?=substr($song,0,-3)."mp3"?>"
   // Automatically plays song
   }).jPlayer("play");
  },
  // Empty CSS selectors, required
  cssSelector: {
   videoPlay:"",play:"",pause:"",stop:"",seekBar:"",playBar:"",mute:"",unmute:"",volumeBar:"",
   volumeBarValue:"",volumeMax:"",playbackRateBar:"",playbackRateBarValue:"",currentTime:"",
   duration:"",title:"",fullScreen:"",restoreScreen:"",repeat:"",repeatOff:"",gui:""
  },
  // jPlayer settings
  solution: "html",
  supplied: "oga, mp3",
  loop: true,
  volume: 0.7,
  errorAlerts: true,
  warningAlerts: true
 });
<?php
  if ($debug) {
   echo ' $("#jplayer_inspector").jPlayerInspector({jPlayer:$("#jquery_jplayer")});' . "\n";
  }
  echo "});
</script>\n";
 */
  echo '<div class="audio">
<audio controls loop preload="metadata">
<source src="' . $song . '" type="audio/ogg">
<source src="' . substr($song, 0, -4) . '.mp3" type="audio/mpeg">
</audio>' . "\n";
  if ($fool) {
   echo '<audio id="staticsfx" loop preload="auto">
<source src="misc/effect_static.ogg" type="audio/ogg">
<source src="misc/effect_static.mp3" type="audio/mpeg">
</audio>' . "\n";
  }
 }
?>
</body>
</html>