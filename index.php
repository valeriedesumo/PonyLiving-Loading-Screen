<?php
 /* Main Loading Screen File
     Handles most code
     Javascript effects, global and theme-specific image and music handlers, and CSS are external

     http://www.ponyliving.com/files/loading/
     ?t		theme		spring,summer,autumn,fall,winter,halloween,standard,fools
     ?s		song		music[_{THEME}]/{SONG}.ogg,mute
     ?i		image		img[_{THEME}]/{IMAGE}.gif

     ?h		TPP anniversary	on,off
      Twitch Plays Pokemon quotes and Helix fossil
     ?b		PL anniversary	on,off
      Birthday message and cupcake
     ?d		debug		on,off
      Debug mode, showing PHP errors and variables, jPlayer Inspector
     ?date	date		MMDD
      Date, in 2-digit month and date format
     ?v		Valve		on,off
      If browser is Gmod (or Steam), when enabled, logs more data, when disabled, displays example server data
     ?r		random number	{1-100}
      Used for rare images, specified or overridden by theme-specific code
     ?f		Fools type	0,1,2,3
      Fools effect, a creepy static-covered theme with jitters, text corruption, and background imagery
      0: Disabled
      1: Enabled, transitions from original theme
      2: Enabled, no transition
      3: Static on original theme only

     ?steamid	SteamID		{STEAMID}
      Used for avatar display, song disabling via mutelist, logging data
 */
?>
<!DOCTYPE html>
<!-- Designed by Valerie Desumo (Ultimaximus) -->
<html>
<head>
<meta charset="utf-8" />
<title>PonyLiving</title>
<script type="text/javascript" src="code_jquery_2.1.1.min.js"></script>
<?php
 // Sanitise $_GET and $_SERVER
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
 if (!is_null($get)) {
  array_walk($get, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
 }
 $server = filter_input_array(INPUT_SERVER, FILTER_SANITIZE_STRING);

 // Debug mode
 $debug = (isset($get['d']) && $get['d'] == "on");
 if ($debug) {
  error_reporting(-1);
 }

 if (isset($get['steamid'])) {
  $steamid = $get['steamid'];
  // If SteamID is in mutelist, music is disabled
  if (strpos(file_get_contents("db_mutelist.log"),$steamid) !== false) {
   $songrequest = "mute";
  }
 }

 // Song override
 if (!isset($songrequest)) {
  $songrequest = (isset($get['s'])) ? $get['s'] : "";
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
 if (($month == 10 && $date >= 5) || ($month == 11 && $date <= 7)) {
  if (rand(1, 2000) == 13) {
   $fool = 3;
  }
 }
 // Enable 1/10000 chance for Fools when it's not Halloween theme, can override Fools type 3 during pre-Halloween theme
 if (!($month == 10 && $date >= 17) || !($month == 11 && $date <= 7)) {
  /* if (rand(1,10000) == 13) {  TODO
   $fool = 1;
  } */
 } else {
  // Enable increasing chance for Fools during Halloween theme, can override Fools type 3
  $prob = array(144,255,512,666,777,999,1313,2584,2718,3141,4825,6666,8128,8191,9001,10000);
  if (rand(1, $prob[($month == 10) ? 31 - $date : $date]) == 13) {
   $fool = 1;
  }
 }

 // Random value override (for rare images)
 $sfm = false;
 if (isset($get['r']) && is_numeric($get['r'])) {
  $rand = $get['r'];
  if ($rand == 69 && $steamid != 76561198056672127) {
   $sfm = true;
  }
 // 1/10000 chance for Gfycat rare
 } elseif (rand(1,10000) == 69) {
  $sfm = true;
 }

 // Theme calculator, $hemisphere should be "south" for southern hemisphere
 function getSeason($hemisphere) {
  global $month, $date, $sfm;
  $season = array("winter","spring","summer","autumn","winter");
  // Holiday Themes
  if (($month == 10 && $date >= 17) || ($month == 11 && $date <= 7)) {
   return "halloween";
  } elseif ($month == 2 && $date >=  7 && $date <= 16) {
   // Enable increasing chance for SFM during Valentine theme
   $prob = array(144,255,512,777,969,1313,2718,4825);
   if (!$sfm && (rand(1, $prob[abs(14 - $date)]) == 69)) {
    $sfm = true;
   }
   return "valentine";
  } elseif ($month == 6 && $date >= 25 && $date <= 29) {
   return "standard";
  } else {
   // Seasonal Themes (based on month)
   // Seasons technically start on the 21st, this is ignored for simplification and to match real-world weather
   /* Months    North   South
      01,02,12  Winter  Summer
      03,04,05  Spring  Autumn
      06,07,08  Summer  Winter
      09,10,11  Autumn  Spring */
   $m = $month;
   if ($hemisphere == "south") {
    $m += 6;
    if ($m > 12) {
     $m -= 12;
    }
   }
   $m = floor($m / 3);
   return $season[$m];
  }
  return false;
 }

 // Enable Fools type 2 on April 1st
 if ($month == 4 && $date == 1) {
  $fool = 2;
 }

 // Gets contents from address, using cURL PHP extension if enabled on the server
 function http_get_contents($url) {
  if (in_array("curl", get_loaded_extensions())) {
   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $url);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
   $data = curl_exec($ch);
   curl_close($ch);
   return $data;
  } else {
   return @file_get_contents($url);
  }
 }

 // Uses geoPlugin service to detect hemisphere, then determines theme
 $ip = $server['REMOTE_ADDR'];
 $geo = http_get_contents("http://www.geoplugin.net/php.gp?ip=$ip");
 $geo = unserialize($geo);
 unset($geo['geoplugin_credit']);
 $theme = ($geo['geoplugin_latitude'] < 0) ? getSeason("south") : getSeason("north");

 // Theme override ("fall" is an alias for "autumn"), will disable randomly-occurring Fools
 if (isset($get['t'])) {
  $themerequest = $get['t'];
  if ($themerequest == "fall") {
   $theme = "autumn";
   $fool = 0;
  } elseif (file_exists("theme_$themerequest.css")) {
   $theme = $themerequest;
   $fool = 0;
  }
 }

 // Fools override
 if (isset($get['f']) && is_numeric($get['f'])) {
  if (floor($get['f']/4) == 0) {
   $fool = $get['f'];
  }
 }
 // Fools type 2 overrides theme
 if ($fool == 2) {
  $theme = "fools";
 }

 // Twitch Plays Pokemon anniversary
 $helix = false; // Apologies, Helix is always true
 if (($month == 2 && $date >= 23) || ($month == 3 && $date == 1)) {
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

 // Imports necessary Javascript files into <head>
 // jPlayer Javascript
 if ($songrequest != "mute") {
  echo '<script type="text/javascript" src="code_jquery_jplayer.min.js"></script>' . "\n";
  if ($debug) {
   echo '<script type="text/javascript" src="code_jquery_jplayer_inspector.js"></script>' . "\n";
  }
 }
 // Gfycat Javascript
 if ($sfm) {
  echo '<script type="text/javascript" src="code_gfycat.min.js"></script>' . "\n";
 }
 // Fools Javascript
 if ($fool) {
  echo '<script type="text/javascript" src="effect_caman.min.js"></script>
<script type="text/javascript" src="effect_fools.js"></script>' . "\n";
 }
 // Seasonal effects Javascript/CSS
 switch ($theme) {
  case "spring":
   echo '<script type="text/javascript" src="effect_birds.js"></script>' . "\n";
   break;
  case "autumn":
   echo '<script type="text/javascript" src="effect_falling_leaves.js"></script>' . "\n";
   break;
  case "winter":
   echo '<script type="text/javascript" src="effect_snowstorm.js"></script>' . "\n";
   break;
  case "halloween":
   echo '<script type="text/javascript" src="effect_bloodshot.js"></script>' . "\n";
   break;
  case "valentine":
   echo '<script type="text/javascript" src="effect_rising_hearts.js"></script>' . "\n";
   break;
  case "summer":
   echo '<link type="text/css" rel="stylesheet" href="effect_sunrays.css" />' . "\n";
   break;
 }
 // Theme CSS
 echo '<link type="text/css" rel="stylesheet" href="theme_' . $theme . '.css"';
 // Attribute for Fools
 if ($fool == 1) {
  echo ' id="theme" />' . "\n";
 } else {
  echo " />\n";
 }
 if ($fool != 0) {
  echo '<link type="text/css" rel="stylesheet" href="effect_fools.css" />' . "\n";
 }
?>
</head>
<body>
<?php
 // Retrieve Steam user information
 if (isset($steamid)) {
  $data = http_get_contents(
   "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=XXX&steamids=$steamid");
  $data = json_decode($data, true);
  if (!array_key_exists(0, $data['response']['players'])) {
   $data['response']['players'][0] = null;
  }
  $avatar = $data['response']['players'][0]['avatarmedium'];
 }

 // Display Helix Fossil for TPP, cupcake for anniversary, or avatar otherwise (if available)
 if ($helix) {
  $avadiv = '<div class="ava"><img src="effect_helix.png" alt=""';
 } elseif ($birthday) {
  $avadiv = '<div class="ava"><img src="effect_cupcake.png" alt=""';
 } elseif (isset($avatar) && !is_null($avatar)) {
  $avadiv = '<div class="ava"><img src="' . $avatar . '" class="round" alt=""';
 }
 // Attribute for Fools' CamanJS
 if (isset($avadiv)) {
  if ($fool == 1 || $fool == 2) {
   $avadiv .= ' id="sincity"';
  }
  echo "$avadiv /></div>\n";
  unset($avadiv);
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
  echo '<div class="hyudoro" style="text-align: left; left: 0px;"><img src="effect_hyudoro_left.gif" alt="" /></div>
<div class="hyudoro" style="text-align: right; right: 0px;"><img src="effect_hyudoro_right.gif" alt="" /></div>' . "\n";
 }
?>
<div class="main">
<span id="status">Connecting to PonyLiving<span id="wait"></span></span>
<script type="text/javascript">
 // Displays loading dots
 var initial = setInterval(
  function() {
   var wait = document.getElementById("wait");
   wait.innerHTML = (wait.innerHTML.length >= 3) ? "" : wait.innerHTML += ".";
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
  status.innerHTML += "<br />" + gamemode + ": " + mapname;
 }
<?php
 // Uses example values for display in web browser
 if (!$valve) {
  echo 'GameDetails("PonyLiving.com PonyRP City |OC Creator|", "http://www.ponyliving.com/files/loading/",
	    "gm_example", 60, "76561198025003452", "webtest");' . "\n";
 }

 // Activate Fools, inputs Fools song to Javascript for transition
 if ($fool != 0) {
  echo "$(function(){fool($fool";
  if ($fool == 1 && $songrequest != "mute") {
   echo ', "' . randSong("fools") . '"';
  }
  echo ");});\n";
 }
?>
</script><br />
<?php
 // Generates log data for joins and views
 // Example: 31 Dec '69 23:59	127.0.0.1	76561100000000000	City		Username
 $log = gmdate('d M \'y H:i') . "\t$ip";
 // Further processing for more data only for Gmod users
 if ($valve) {
  // 1/100 chance to schedule join database pruning, only keep joins for 6 days
  // (Easier than scheduling prunes per viewcount, less cpu/memory-intensive than pruning during every view)
  if (rand(1,100) == 63) {
   $joinlist = file("db_joins.log");
   // Gets representative time for age of oldest joins, processing due to date format
   // Prunes old joins in chunks of 150
   $reptime = array_key_exists(150, $joinlist) ? $joinlist[150] : end($joinlist);
   $reptime = strtotime(str_replace("'", "20", substr($reptime, 0, 16)));
   if ($joinlist !== false && (time()-$reptime > 518400)) {
    file_put_contents("db_joins.log", implode(array_slice($joinlist, 150)), LOCK_EX);
   }
   unset($joinlist);
  }
  // Records SteamID and username, uses second variable for formatting
  $log2 = "";
  if (isset($steamid)) {
   $log .= "\t$steamid";
   $log2 = "\t\t" . $data['response']['players'][0]['personaname'];
   // Writes to db_steamid-ip.log (IPs of SteamIDs) if not already logged in the past
   $iplist = json_decode(file_get_contents("db_steamid-ip.log"), true);
   if (array_key_exists($steamid,$iplist) && !in_array($ip,$iplist[$steamid],true)) {
    $iplist[$steamid][] = $ip;
    file_put_contents("db_steamid-ip.log", json_encode($iplist), LOCK_EX);
    // Writes to db_ip-steamid.log (IPs With Multiple SteamIDs) if IP address is associated with more than 1 SteamID
    $steamofip = array_filter($iplist,function($ary)use($ip){return in_array($ip,$ary,true);});
    if (count($steamofip) > 1) {
     $steamlist = json_decode(file_get_contents("db_ip-steamid.log"), true);
     if (!is_null($steamlist)) {
      $steamlist[$ip] = array_keys($steamofip);
      file_put_contents("db_ip-steamid.log", json_encode($steamlist), LOCK_EX);
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
  unset($log2);
 }
 // After processing, append log data
 file_put_contents("db_joins.log", "$log\r\n", FILE_APPEND | LOCK_EX);
 // Write log to db_fools.log if Fools is activated by chance (not by override)
 if ($fool != 0 && $fool != 2 && !is_string($fool)) {
  // Add Fools type
  $logfool = substr_replace($log, "\t$fool", stripos($log, "\t", 40), 0);
  file_put_contents("db_fools.log", "$logfool\r\n", FILE_APPEND | LOCK_EX);
 }

 // Create random number (1/100) if it isn't overridden
 if(!isset($rand)) {
  $rand = rand(1,100); 
 }

 // Include code for determining image, with global and theme-specific images
 // Themes may override global images, and will handle rare image chances with accompanying labels
 $rare = false;
 include("img_global.php");
 if (file_exists("img_$theme.php")) {
  include("img_$theme.php");
 }

 // Image override (disables rare images and label, Gfycat rare (Gfycat Javascript will still be imported on page))
 if (isset($get['i']) && file_exists($get['i']) && exif_imagetype($get['i'])) {
  $imgtouse = $get['i'];
  $rare = false;
  $sfm = false;
 } elseif ($sfm) {
  // Gfycat rare label
  $rare = "*";
  // Write log to db_intimate.log if Gfycat rare is activated by chance (not by override)
  if (!is_string($rand)) {
   file_put_contents("db_intimate.log", "$log\r\n", FILE_APPEND | LOCK_EX);
  }
 }

 // Determine image from generated array if image is not rare or overridden
 if (!isset($imgtouse)) {
  $imgtouse = $img[array_rand($img)];
 }

 // Display SFM Gfycat or image
 if ($sfm) {
  echo '<img class="gfyitem cen" data-id="ComfortableSlightBlackrussianterrier" data-controls="false" />' . "\n";
 } else {
  echo '<img src="' . $imgtouse . '" alt="" class="cen" />' . "\n";
 }

 // Rare label
 if ($rare !== false) {
  echo '<span class="rare">' . "$rare</span>\n";
 }

 // Returns random song from global and/or theme-specific set (configured by music theme code)
 // Songs will always end in .ogg until used in jPlayer
 function randSong($type) {
  global $rand;
  $music = array();
  $musadd = true;
  if (file_exists("music_$type.php")) {
   include("music_$type.php");
  }
  // Include global songs unless music theme specifies otherwise
  if ($musadd) {
   $music = array_merge($music, include("music_global.php"));
  }
  return $music[array_rand($music)]; 
 }

 $song = randSong($theme);

 // Song URL formatting, overridden by song override, mute, or Gfycat rare
 if ($songrequest == "mute") {
  $song = "";
 } elseif ($sfm) {
  $song = "music.php?s=music/George Michael - Careless Whisper (Instrumental).ogg";
 } elseif (file_exists($songrequest) && (substr($songrequest,strlen($songrequest)-4,4) == ".ogg")) {
  $song = "music.php?s=" . $songrequest;
 } else {
  $song = "music.php?s=" . $song;
 }

 // jPlayer code
 if (!empty($song)): ?>
<script type="text/javascript">
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
   videoPlay: "",
   play: "",
   pause: "",
   stop: "",
   seekBar: "",
   playBar: "",
   mute: "",
   unmute: "",
   volumeBar: "",
   volumeBarValue: "",
   volumeMax: "",
   playbackRateBar: "",
   playbackRateBarValue: "",
   currentTime: "",
   duration: "",
   title: "",
   fullScreen: "",
   restoreScreen: "",
   repeat: "",
   repeatOff: "",
   gui: ""
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
  // Enables jPlayer Inspector if debug mode is enabled
  if ($debug) {
   echo ' $("#jplayer_inspector").jPlayerInspector({jPlayer:$("#jquery_jplayer")});' . "\n";
  }
  echo "});
</script>\n";
 endif;

 // Determines message/quote type
 switch ($theme) {
  case "valentine":
   if ($date != 14) {
    break;
   }
  case "standard":
  case "halloween":
   $msg = $theme;
   break;
 }
 if ($helix) {
  $msg = "helix";
 } elseif ($birthday) {
  $msg = "birthday";
 }

 if ($month == 2 && $date == 11) {
  $msg = "standard";
 } elseif ($month == 2 && $date == 13) {
  $msg = "standard";
 }
 // Retrives and displays message from quote database
 if (isset($msg)) {
  $msglist = json_decode(file_get_contents("db_quotes.txt"), true);
  if (!is_null($msglist)) {
   $msg = $msglist[$msg][array_rand($msglist[$msg])];
   if ($msg == "valentine" && rand(1,10) == 1) {
    $msg = "HAPPY SINGLES AWARENESS DAY!";
   }
   if ($month == 2 && $date == 11) {
    $msg = "HAPPY BIRTHDAY REORP!";
   } elseif ($month == 2 && $date == 13) {
    $msg = "HAPPY BIRTHDAY VALERIE!";
   }
   echo '<div class="quote">' . "$msg</div>\n";
  }
  unset($msglist);
 }

 // Supporting jPlayer HTML
 if (!empty($song)): ?>
<div id="jquery_jplayer"></div>
<div id="jp_container_1">
 <div class="jp-no-solution">
  Update Required<br />
  To play the background music, you may need to update your browser
 </div>
</div>
<?php
  if ($debug):
   echo '<div id="jplayer_inspector"></div>' . "\n";
  endif;
 endif;
?>
<div class="credit">Designed By: Valerie Desumo (Ultimaximus)</div>
<?php
 // PHP variable display for debug mode
 if ($debug) {
  // Removes redundant data
  unset($server, $get);
  $vars = get_defined_vars();
  unset($vars['GLOBALS']);
  // Formats ampersands for HTML validation
  $vars['_SERVER']['QUERY_STRING'] = htmlspecialchars($vars['_SERVER']['QUERY_STRING']);
  $vars['_SERVER']['REQUEST_URI'] = htmlspecialchars($vars['_SERVER']['REQUEST_URI']);
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
  echo "<pre>" . print_r($vars, true) . "</pre>\n";
 }
?>
</div>
<?php
 // Display formatted music title
 if (!empty($song)) {
  echo '<div class="mustitle">' . urldecode(substr($song, strpos($song,"/")+1, -4)) . "</div>\n";
 }
?>
</body>
</html>