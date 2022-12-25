<?php
 /* Caching Song Handler
    Designed by Valerie Desumo (Ultimaximus)
     Retrieves requested song and sends appropriate headers for the browser to use for caching

     http://www.ponyliving.com/files/loading/music.php
     ?s		song		music[_{THEME}]/{SONG},mute
 */

 // Sanitise $_GET and $_SERVER
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
 if (!is_null($get)) {
  array_walk($get, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
 }
 $server = filter_input_array(INPUT_SERVER, FILTER_SANITIZE_STRING);
 array_walk($get, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});

 // Requested song, defaults to 'Down to Earth'
 $songrequest = $get['s'];
 $ext = substr($songrequest, strlen($songrequest)-3, 3);
 if (file_exists($songrequest) && ($ext == "ogg" || $ext == "mp3")) {
  $song = $songrequest;
 } else {
  $u_agent = isset($server['HTTP_USER_AGENT']) ? $server['HTTP_USER_AGENT'] : 0;
  $ext = (preg_match('/MSIE/i', $u_agent) && !preg_match('/Opera/i', $u_agent)) ? "mp3" : "ogg";
  $song = "music/Jastrian - Down to Earth.$ext";
 }

 // Retrieving and generating cache data
 $tsstring = gmdate('D, d M Y H:i:s ', filemtime($song)) . 'GMT';
 $etag = '"' . filemtime($song) . '"';
 $if_none_match = isset($server['HTTP_IF_NONE_MATCH']) ? $server['HTTP_IF_NONE_MATCH'] : false;
 $if_modified_since = isset($server['HTTP_IF_MODIFIED_SINCE']) ? $server['HTTP_IF_MODIFIED_SINCE'] : false;

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