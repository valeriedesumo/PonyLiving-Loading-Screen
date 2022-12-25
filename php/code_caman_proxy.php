<?php
 /* CamanJS Proxy (by Ryan LeFevre)
     Proxy script for CamanJS to access images from other servers
     Edited for URL validation and error reporting

     http://www.ponyliving.com/files/loading/php/code_caman_proxy.php
     ?camanProxyUrl     theme   {IMAGE PATH}
      URL path to an image hosted on another domain

      Copyright (c) 2010-2016, Ryan LeFevre | BSD 3-Clause
 */

 // Set this to true if you want to be able to load images from a url that doesn't
 // end in an image file extension. E.g. through another proxy of kinds.
 define("ALLOW_NO_EXT", false);

 /* UPDATE: FILTER_SANITIZE_STRING is deprecated
 // Sanitise $_GET
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
 if (!is_null($get)) {
  array_walk($get, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
 }
 */

 // Grab and parse the URL
 if (!array_key_exists("camanProxyUrl", $_GET)) {
  echo "This script requires an image URL in ?camanProxyUrl.";
  exit;
 }
 $url = $_GET['camanProxyUrl'];
 // URLs with non-ASCII characters will fail validation, due to not being allowed by RFC 3986
 // E.g.: https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_São_Tomé_and_Príncipe.svg/2560px-Flag_of_São_Tomé_and_Príncipe.svg.png
 if (!ctype_print($url)) {
  $url = str_replace("%3A", ":", implode("/", array_map("rawurlencode", explode("/", $url))));
 }
 $url = filter_var($url, FILTER_VALIDATE_URL);
 if (!$url || preg_match("@^https?@", parse_url($url, PHP_URL_SCHEME)) === 0) {
  echo "This script requires an image URL in ?camanProxyUrl.";
  exit;
 }
 if ((parse_url($url, PHP_URL_SCHEME) == "https") && !in_array("openssl", get_loaded_extensions())) {
  echo "This script requires PHP's OpenSSL extension to be enabled on the webserver for URLs starting with HTTPS.";
  exit;
 }

 // Determine image type
 $ctype = null;
 switch (pathinfo($url, PATHINFO_EXTENSION)) {
  case "gif": $ctype = "image/gif"; break;
  case "png": $ctype = "image/png"; break;
  case "jpeg":
  case "jpg": $ctype = "image/jpg"; break;
  default:
   if (ALLOW_NO_EXT) {
    $ctype = "application/octet-stream";
   } else {
    echo "This script requires an image URL in ?camanProxyUrl.";
    exit;
   }
 }

 // Route the image through this script
 $data = @file_get_contents($url);
 if ($data !== false) {
  header("Content-Type: $ctype");
  echo $data;
 } else {
  echo "<b>Warning</b>:  " . error_get_last()["message"];
 }
?>