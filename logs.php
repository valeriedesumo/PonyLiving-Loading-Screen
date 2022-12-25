<?php
 /* Log Viewer (by Valerie Desumo)
     Parses and displays log data, with generated links for Steam profiles and IP locator

     http://www.ponyliving.com/files/loading/logs.php
     ?f         file            1,2,3,4,5
      Sets title and content based on requested data, default is Joins
      1: Joins
      2: IPs of SteamIDs
      3: IPs With Multiple SteamIDs
      4: 1/10000 Rare Views
      5: Fools Views
 */

 error_reporting(-1);

 // gZIP compression
 if(!ob_start("ob_gzhandler")) {
  ob_start();
 }

 /* UPDATE: FILTER_SANITIZE_STRING is deprecated, now the standard practice is to only filter when input is used as output,
    so that the actual relevant filter (HTML, SQL, etc) can be used.

 // Sanitise $_GET, , $_POST, $_SERVER, and $_COOKIE
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
 $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);
 $cookie = filter_input_array(INPUT_COOKIE, FILTER_SANITIZE_STRING);
 */

 /* UPDATE: This was initially knowingly written with low security, to avoid implementing custom password logic (PHP did not
    have built-in password features at the time) and because the only sensitive data here was IPs (it was debatable how much
    responsibility server operators have to protect that). Also, if a hacker had read access to this file, they could already
    view server logs for IPs.

 $password = "v@l3rie!";
 if (isset($post['pass'])) {
  if ($post['pass'] == $password) {
   setcookie("logaccess", hash("sha512", $password), time()+60*60*24*365, '/');
   $auth = true;
   $title = "Loading...";
  } else {
   $auth = false;
   $title = "Wrong password!";
  }
 } elseif (!isset($cookie['logaccess']) || $cookie['logaccess'] != hash("sha512", $password)) { // Vulnerable to session hijacking
  $auth = false;
  $title = "Password Required!";
 } else {
 */

 // For demonstration purposes, the password is "demo"
 $hash = '$2y$10$QOeEZDYuJmAnrae/1Dl/qOzLJ2/id4T74L.JTJxD22mldWJvWZaBm';
 if (isset($_POST['pass'])) {
  if(password_verify($_POST['pass'], $hash)) {
   setcookie("logaccess", $hash, time()+60*60*24*365, '/');
   $auth = true;
   $title = "Loading...";
  } else {
   $auth = false;
   $title = "Wrong password!";
  }
 } elseif (!isset($_COOKIE['logaccess']) || $_COOKIE['logaccess'] != $hash) { // Vulnerable to session hijacking
  $auth = false;
  $title = "Password Required!";
 } else {
  // Sets and parses requested data
  $f = (isset($_GET['f'])) ? $_GET['f'] : false;
  switch ($f) {
   case 1:
   default:
    $title = "Joins";
    $content = htmlspecialchars(file_get_contents("db/joins.log"));
    $f = 1;
    break;
   // Partial anonymization of IP data for github publication causes some entries to become duplicated, becoming omitted from display
   case 2:
    $title = "IPs of SteamIDs";
    $content = print_r(json_decode(file_get_contents("db/steamid-ip.log"), true), true);
    break;
   case 3:
    $title = "IPs With Multiple SteamIDs";
    $content = print_r(json_decode(file_get_contents("db/ip-steamid.log"), true), true);
    break;
   case 4:
    $title = "1/10000 Rare Views";
    $content = htmlspecialchars(file_get_contents("db/rare.log"));
    break;
   case 5:
    $title = "Fools Views";
    $content = htmlspecialchars(file_get_contents("db/fools.log"));
    break;
  }
 }
 // unset($password);
?>
<!DOCTYPE html>
<!-- Designed by Valerie Desumo (Ultimaximus) -->
<html lang="en">
<head>
<meta charset="utf-8">
<title>PL Logs: <?=$title?></title>
<style>
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
 input {
  margin: 10px;
 }
</style>
</head>
<body>
<h1><?=$title?></h1>
<div><br>
<?php
 if (isset($auth)) {
  if ($auth) {
   echo '<script>location = location.href;</script>';
   exit;
  } else {
   echo '<form method="POST" action="logs.php">
 <input type="password" name="pass"><input type="submit" name="submit" value="Submit">
</form>
</div>
<div style="margin-top:15px">(For demonstration purposes, the password is "demo")</div>
</body>
</html>';
  exit;
  }
 } else {
  // Displays links for other data, excluding current page
  $ahref = array('<a href="?f=1">Joins</a>',
                 '<a href="?f=2">IPs of SteamIDs</a>',
                 '<a href="?f=3">IPs With Multiple SteamIDs</a>',
                 '<a href="?f=4">1/10000 Rare Views</a>',
                 '<a href="?f=5">Fools Views</a>');
  unset($ahref[$f-1]);
  echo implode(" &ndash; ", $ahref) . "\n<br>\n";

  // Linkify IP addresses and Steam IDs for redirecting to whatsmyip.org and Steam profiles via /l/ directory
  $content = preg_replace('/(\d+\.\d+\.\d+\.\d+|\d{17})/',
                          '<a href="l/?u=$1">$1</a>',
                          $content);

  echo "<pre>$content</pre>\n";
 }
?>
</div>
</body>
</html>