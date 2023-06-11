// Food items for each meal type
var menuItems = {
  breakfast: [
    { name: "IDLI", price: 5 },
    { name: "Pongal", price: 35 },
    { name: "Dosa", price: 25 },
    { name: "Vada", price: 8 },
    { name: "Kesari", price: 20 },
    { name: "Poori", price: 25 },
    { name: "MasalaDosa", price: 35 },
    { name: "GheeRoast", price: 40 }
  ],
  lunch: [
    { name: "Meals", price: 100 },
    { name: "Parotta", price: 12.50 },
    { name: "ChickedFriedRice", price: 100 },
    { name: "EggFriedRice", price: 80 },
    { name: "Chapathi", price: 20 },
    { name: "ChickedNoodles", price: 100 },
    { name: "EggNoodles", price: 80 },
    { name: "ChickenBiriyani", price: 100 },
    { name: "ChickedGravy", price: 80 },
    { name: "Biriyani-Kuska", price: 75 },
    { name: "KothuParotta", price: 75 },
    { name: "kalakki", price: 20 },
  ],
  dinner: [
    { name: "Parotta", price: 12.50 },
    { name: "Naan", price: 50 },
    { name: "ChickedFriedRice", price: 100 },
    { name: "EggFriedRice", price: 80 },
    { name: "Chapathi", price: 20 },
    { name: "ChickedNoodles", price: 100 },
    { name: "EggNoodles", price: 80 },
    { name: "kalakki", price: 20 },
    { name: "ChickedGravy", price: 80 },
    { name: "KothuParotta", price: 75 }
  ],
  misc: [
    { name: "Tea", price: 10 },
    { name: "Coffee", price: 15 },
    { name: "Vada", price: 8 },
    { name: "Juice10Rs", price: 10 },
    { name: "Juice20Rs", price: 20 },
    { name: "Juice35Rs", price: 35 },
    { name: "Juice50Rs", price: 50 }
  ]
};
// Get the current date
var currentDate = new Date();

// Format the date as desired (e.g., "June 4, 2023")
var formattedDate = currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

// Set the date element's text content to the formatted date
document.getElementById("date").textContent = formattedDate;
var selectedMeal = "";
var selectedFoodItem = null;
var billItems = [];
var totalAmount = 0;


function selectMeal(meal) {
  selectedMeal = meal;
  updateFoodItems();
}
function printItems() {
  var billItemsList = document.getElementById('billItemsList').innerHTML;
  var totalAmount = document.getElementById('totalAmount').textContent;

  // Remove the "Remove" button from the bill items list
  var printableBillItemsList = billItemsList.replace(/<button.*<\/button>/g, '');

  var printWindow = window.open('', '', 'width=600,height=600');
  printWindow.document.write('<html><head><title>Bill Items</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('.bill-container { max-width: 600px; margin: 0 auto; }');
  printWindow.document.write('.bill-container ul { list-style-type: none; padding: 0; }');
  printWindow.document.write('.bill-container li { margin-bottom: 10px; }');
  printWindow.document.write('.bill-container .total-amount { text-align: right; }');
  printWindow.document.write('</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write('<div class="bill-container">');
  printWindow.document.write('<h2>Bill Items</h2>');
  printWindow.document.write(printableBillItemsList);
  printWindow.document.write('<div class="total-amount">');
  printWindow.document.write('<label>Total Amount:</label>');
  printWindow.document.write('<span>' + totalAmount + '</span>');
  printWindow.document.write('</div>');
  printWindow.document.write('</div>');
  printWindow.document.write('</body></html>');

  printWindow.document.close();
  printWindow.print();
}


function updateFoodItems() {
  var foodItemSelect = document.getElementById("foodItem");
  foodItemSelect.innerHTML = "";

  if (selectedMeal !== "") {
    var items = menuItems[selectedMeal];

    for (var i = 0; i < items.length; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.text = items[i].name;
      foodItemSelect.appendChild(option);
    }
  }
}

function calculatePrice() {
  var quantity = parseInt(document.getElementById("quantity").value);
  var price = selectedFoodItem.price;
  var totalPrice = quantity * price;

  document.getElementById("price").value = totalPrice.toFixed(2);
}

function addItem() {
  if (selectedFoodItem === null) {
    alert("Please select a food item.");
    return;
  }

  var itemName = selectedFoodItem.name;
  var quantity = parseInt(document.getElementById("quantity").value);
  var price = selectedFoodItem.price;
  var itemTotal = quantity * price;

  var item = {
    name: itemName,
    quantity: quantity,
    price: price,
    total: itemTotal
  };

  billItems.push(item);
  totalAmount += itemTotal;

  updateBillItems();
  updateTotalAmount();
}

function updateBillItems() {
  var billItemsList = document.getElementById("billItemsList");
  billItemsList.innerHTML = "";

  for (var i = 0; i < billItems.length; i++) {
    var item = billItems[i];

    var li = document.createElement("li");
    li.innerHTML = item.name + " x " + item.quantity + " = $" + item.total.toFixed(2);

    var removeBtn = document.createElement("button");
    removeBtn.innerHTML = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.setAttribute("data-index", i);
    removeBtn.addEventListener("click", removeItem);

    li.appendChild(removeBtn);
    billItemsList.appendChild(li);
  }
}

function updateTotalAmount() {
  document.getElementById("totalAmount").textContent = "$" + totalAmount.toFixed(2);
}

function removeItem(event) {
  var index = event.target.getAttribute("data-index");
  var item = billItems[index];

  totalAmount -= item.total;
  billItems.splice(index, 1);

  updateBillItems();
  updateTotalAmount();
}

var billNumber = localStorage.getItem("billNumber") || 0;

// Display the current bill number
document.getElementById("billNumber").textContent = "Bill Number: " + billNumber;

function saveTransaction() {
  if (billItems.length === 0) {
    alert("Please add items to the bill before saving.");
    return;
  }

  var billData = {
    billItems: billItems,
    totalAmount: totalAmount.toFixed(2),
    date: new Date().toISOString()
  };

  // Send the billData to PHP for saving locally
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "saveTransaction.php", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(billData));
  // Increment the bill number by 1
  billNumber++;

  // Save the updated bill number to local storage
  localStorage.setItem("billNumber", billNumber);

  // Update the displayed bill number
  document.getElementById("billNumber").textContent = "Bill Number: " + billNumber;
  alert("Transaction saved successfully!");
  clearAllItems();


}

function clearAllItems() {
  billItems = [];
  totalAmount = 0;

  updateBillItems();
  updateTotalAmount();
  document.getElementById("mealType").reset();
}

window.addEventListener("load", function() {
  var foodItemSelect = document.getElementById("foodItem");
  foodItemSelect.addEventListener("change", function() {
    var selectedIndex = foodItemSelect.value;
    var items = menuItems[selectedMeal];
    selectedFoodItem = items[selectedIndex];
    calculatePrice();
  });
});
