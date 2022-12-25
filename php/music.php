<?php
 /* Caching Song Handler (by Valerie Desumo)
     Retrieves requested song and sends appropriate headers for the browser to use for caching

     http://www.ponyliving.com/files/loading/php/music.php
     ?s         song            music/{THEME}/{SONG},mute
 */

 /* UPDATE: FILTER_SANITIZE_STRING is deprecated
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
 if (!is_null($get)) {
  array_walk($get, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
 }
 $server = filter_input_array(INPUT_SERVER, FILTER_SANITIZE_STRING);
 array_walk($server, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
 */

 // Requested song, defaults to 'Down to Earth'
 if (!isset($_GET['s'])) {
  echo "This script requires a song path in ?s.";
  exit;
 }
 $songrequest = $_GET['s'];
 $ext = pathinfo($songrequest, PATHINFO_EXTENSION);
 if (file_exists($songrequest) && ($ext == "ogg" || $ext == "mp3")) {
  $song = $songrequest;
 } elseif (file_exists("../$songrequest") && ($ext == "ogg" || $ext == "mp3")) {
  $song = "../$songrequest";
 } else {
  $u_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 0;
  $ext = (preg_match('/MSIE/i', $u_agent) && !preg_match('/Opera/i', $u_agent)) ? "mp3" : "ogg";
  $song = "../music/main/Jastrian - Down to Earth.$ext";
 }

 // Retrieving and generating cache data
 $tsstring = gmdate('D, d M Y H:i:s ', filemtime($song)) . 'GMT';
 $etag = '"' . filemtime($song) . '"';
 $if_none_match = isset($_SERVER['HTTP_IF_NONE_MATCH']) ? $_SERVER['HTTP_IF_NONE_MATCH'] : false;
 $if_modified_since = isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) ? $_SERVER['HTTP_IF_MODIFIED_SINCE'] : false;

 // Cache headers
 header("Cache-Control: private, must-revalidate, max-age=2592000");
 header("Content-Length: " . filesize($song));
 header("Content-Type: audio/$ext");
 if (($if_none_match === $etag || !$if_none_match) && ($if_modified_since === $tsstring)) {
  header("HTTP/1.1 304 Not Modified");
 } else {
  header("ETag: $etag");
  header("Expires: " . gmdate('D, d M Y H:i:s ', time() + 60*60*24*30) . "GMT");
  header("Last-Modified: $tsstring");
 }

 // Send music data
 $fp = fopen($song, 'rb');
 fpassthru($fp);
 exit;
?>