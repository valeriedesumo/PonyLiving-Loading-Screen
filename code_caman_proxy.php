<?php
 /* CamanJS Proxy (by Ryan LeFevre)
     Original loading screen file, redirects viewers to index.php, in addition to any $_GET parameters

     http://www.ponyliving.com/files/loading/code_caman_proxy.php
     ?camanProxyUrl	theme	{IMAGE PATH}
      URL path to an image hosted on another domain
 */

 // Set this to true if you want to be able to load images from a url that doesn't
 // end in an image file extension. E.g. through another proxy of kinds.
 define("ALLOW_NO_EXT", false);

 // Sanitise $_GET
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
 if (!is_null($get)) {
  array_walk($get, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
 }

 // Requires ?camanProxyUrl to exist
 if (!$get['camanProxyUrl']) {
  exit;
 }

 // Grab and parse the URL
 $url = trim(urldecode($get['camanProxyUrl']));
 $urlinfo = parse_url($url, PHP_URL_PATH);
 $ext = array_reverse(explode(".", $urlinfo));

 // Determine image type
 $ctype = null;
 switch ($ext[0]) {
 case "gif": $ctype = "image/gif"; break;
 case "png": $ctype = "image/png"; break;
 case "jpeg":
 case "jpg": $ctype = "image/jpg"; break;
 default:
  if (ALLOW_NO_EXT) {
    $ctype = "application/octet-stream";
  } else {
    exit;
  }
 }

 // Route the image through this script
 header("Content-Type: $ctype");
 readfile($url);
?>