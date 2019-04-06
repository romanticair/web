1.两维数组
<?php
$cars = array
  (
  array("Volvo",22,18),
  array("BMW",15,13),
  array("Saab",5,2),
  array("Land Rover",17,15)
  );

echo $cars[0][0].": 库存：".$cars[0][1].", 销量：".$cars[0][2].".<br>";
echo $cars[1][0].": 库存：".$cars[1][1].", 销量：".$cars[1][2].".<br>";
echo $cars[2][0].": 库存：".$cars[2][1].", 销量：".$cars[2][2].".<br>";
echo $cars[3][0].": 库存：".$cars[3][1].", 销量：".$cars[3][2].".<br>";
?>

2.for遍历
<?php
for ($row = 0; $row < 4; $row++) {
  echo "<p><b>Row number $row</b></p>";
  echo "<ul>";
  for ($col = 0; $col < 3; $col++) {
    echo "<li>".$cars[$row][$col]."</li>";
  }
  echo "</ul>";
}
?>