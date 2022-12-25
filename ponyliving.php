<?php
 /* Index Redirector
    Designed by Valerie Desumo (Ultimaximus)
     Original loading screen file, redirects viewers to index.php, in addition to any $_GET parameters

     http://www.ponyliving.com/files/loading/ponyliving.php
 */

 // Sanitise $_GET
 $get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);

 // Just redirect if there's no $_GET parameters
 if (is_null($get)) {
  header("Location: http://www.ponyliving.com/files/loading/");
  exit;
 }

 // URL formatting to redirect to main file with all $_GET parameters
 array_walk($get, function(&$val){$val=htmlspecialchars_decode($val,ENT_QUOTES);});
 $str = "?";
 foreach ($get as $k => $g) {
  $str .= $k . "=" . $g . "&";
 }
 $str = substr($str, 0, -1);
 header("Location: http://www.ponyliving.com/files/loading/" . $str);
?>