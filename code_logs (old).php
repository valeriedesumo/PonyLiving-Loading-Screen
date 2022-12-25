<?php
 /* Log Viewer
     Parses and displays log data, with generated links for Steam profiles and IP locator

     http://www.ponyliving.com/files/loading/code_logs.php
     ?f		file		1,2,3,4,5
      Sets title and content based on requested data, default is Joins
      1: Joins
      2: IPs of SteamIDs
      3: IPs With Multiple SteamIDs
      4: SFM_Intimate Views
      5: Fools Views
 */
?>
<!DOCTYPE html>
<!-- Designed by Valerie Desumo (Ultimaximus) -->
<html>
<head>
<meta charset="utf-8" />
<?php
 error_reporting(-1);

 // gZIP compression
 if(!ob_start("ob_gzhandler")) {
  ob_start();
 }

 // Sanitise $_GET and $_SERVER
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
 $server = filter_input_array(INPUT_SERVER, FILTER_SANITIZE_STRING);

 // Sets and parses requested data
 $f = (isset($get['f'])) ? $get['f'] : false;
 switch ($f) {
  case 1:
  default:
   $title = "Joins";
   $content = htmlspecialchars(file_get_contents("db_joins.log"));
   $f = 1;
   break;
  case 2:
   $title = "IPs of SteamIDs";
   $content = print_r(json_decode(file_get_contents("db_steamid-ip.log"), true), true);
   break;
  case 3:
   $title = "IPs With Multiple SteamIDs";
   $content = print_r(json_decode(file_get_contents("db_ip-steamid.log"), true), true);
   break;
  case 4:
   $title = "SFM_Intimate Views";
   $content = htmlspecialchars(file_get_contents("db_intimate.log"));
   break;
  case 5:
   $title = "Fools Views";
   $content = htmlspecialchars(file_get_contents("db_fools.log"));
   break;
 }
?>
<title>PL Logs: <?=$title?></title>
<script type="text/javascript" src="code_jquery_2.1.1.min.js"></script>
<style type="text/css">
 h1 {
  display: inline;
 }
 a {
  text-decoration: none;
 }
 a:hover {
  text-decoration: underline;
 }
 a:visited {
  color: #0000FF;
 }
 button {
  display: block;
  float: right;
  margin-right: 50px;
 }
</style>
</head>
<body>
<h1><?=$title?></h1>
<div><br />
<?php
 // Displays links for other data, excluding current page
 $ahref = array('<a href="?f=1">Joins</a>',
		'<a href="?f=2">IPs of SteamIDs</a>',
		'<a href="?f=3">IPs With Multiple SteamIDs</a>',
 		'<a href="?f=4">SFM_Intimate Views</a>',
 		'<a href="?f=5">Fools Views</a>');
 unset($ahref[$f-1]);
 echo implode(" &ndash; ", $ahref) . "\n<br />\n";

 // Linkify IP addresses and Steam IDs for redirecting to whatsmyip.org and Steam profiles
 $content = preg_replace('/(\d+\.\d+\.\d+\.\d+|\d{17})/',
			 '<a href="l/?u=$1">$1</a>',
			 $content);

 echo "<pre>$content</pre>\n";
?>
</div>
</body>
</html>