<?php
  // jsonp 只能是 GET 请求
  $cbStr = $_GET['callback'];
  $data = array('a', 'b', 'c');
  echo $cbStr.'('.json.encode($data).')';
