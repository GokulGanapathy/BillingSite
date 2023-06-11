<?php
$billData = json_decode(file_get_contents('php://input'), true);

$billItems = $billData['billItems'];
$totalAmount = $billData['totalAmount'];
$date = $billData['date'];

$billNumber = 'BILL_' . date('YmdHis');

$filename = $billNumber . '.txt';
$fileContent = "Bill Number: $billNumber\n";
$fileContent .= "Date: $date\n";
$fileContent .= "Total Amount: $totalAmount\n\n";

foreach ($billItems as $index => $item) {
  $itemName = $item['name'];
  $quantity = $item['quantity'];
  $price = $item['price'];
  $total = $item['total'];

  $fileContent .= "Item " . ($index + 1) . ":\n";
  $fileContent .= "Name: $itemName\n";
  $fileContent .= "Quantity: $quantity\n";
  $fileContent .= "Price: $price\n";
  $fileContent .= "Total: $total\n\n";
}

$fileContent .= "-----------------------\n\n";

file_put_contents('transactions/' . $filename, $fileContent);
?>
