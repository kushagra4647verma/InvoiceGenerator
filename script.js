let invoiceCounter = 1;

function generateInvoiceNumber() {
  const d = new Date();
  return `${d.getMonth() + 1}-${d.getFullYear()}-${invoiceCounter}`;
}

document.getElementById("invoiceNum").value = generateInvoiceNumber();

function addItem() {
  const id = Date.now();

  const div = document.createElement("div");
  div.className = "itemRow";
  div.dataset.id = id;

  div.innerHTML = `
        <label>Item Name:</label>
        <input class="itemName">

        <label>Gross WT:</label>
        <input class="grossWt">

        <label>Net WT:</label>
        <input class="netWt">

        <label>Rate:</label>
        <input class="rate">

        <label>Amount:</label>
        <input class="amount">

        <button type="button" class="del-btn" onclick="removeItem(${id})">Delete</button>

        <hr>
    `;

  document.getElementById("itemContainer").appendChild(div);
}

function removeItem(id) {
  const row = document.querySelector(`[data-id='${id}']`);
  if (row) row.remove();
}

function generateInvoice() {
  // Fill Basic Outputs
  document.getElementById("out_invoiceNum").textContent =
    document.getElementById("invoiceNum").value;
  document.getElementById("out_invoiceDate").textContent =
    document.getElementById("invoiceDate").value;
  document.getElementById("out_custName").textContent =
    document.getElementById("custName").value;
  document.getElementById("out_custMobile").textContent =
    document.getElementById("custMobile").value;
  document.getElementById("out_billAddr").textContent =
    document.getElementById("billAddr").value;
  document.getElementById("out_shipAddr").textContent =
    document.getElementById("shipAddr").value;

  // ITEM TABLE OUTPUT
  const names = document.querySelectorAll(".itemName");
  const gross = document.querySelectorAll(".grossWt");
  const net = document.querySelectorAll(".netWt");
  const rate = document.querySelectorAll(".rate");
  const amount = document.querySelectorAll(".amount");

  let tableHTML = "";
  let subtotal = 0;

  for (let i = 0; i < names.length; i++) {
    if (names[i].value.trim() === "") continue;

    tableHTML += `
            <tr>
                <td>${names[i].value}</td>
                <td>${gross[i].value}</td>
                <td>${net[i].value}</td>
                <td>${rate[i].value}</td>
                <td>${amount[i].value}</td>
            </tr>
        `;

    subtotal += Number(amount[i].value);
  }

  document.getElementById("item_out").innerHTML = tableHTML;

  // GST CALCULATION
  const cgstRate = Number(document.getElementById("cgst").value);
  const sgstRate = Number(document.getElementById("sgst").value);
  const igstRate = Number(document.getElementById("igst").value);

  const cgst = subtotal * (cgstRate / 100);
  const sgst = subtotal * (sgstRate / 100);
  const igst = subtotal * (igstRate / 100);

  const total = subtotal + cgst + sgst + igst;

  document.getElementById("out_amount").textContent = subtotal.toFixed(2);
  document.getElementById("out_cgst").textContent = cgst.toFixed(2);
  document.getElementById("out_sgst").textContent = sgst.toFixed(2);
  document.getElementById("out_igst").textContent = igst.toFixed(2);
  document.getElementById("out_total").textContent = total.toFixed(2);

  // Generate PDF
  html2canvas(document.getElementById("invoice")).then((canvas) => {
    const img = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("p", "mm", "a4");

    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save(`Invoice-${document.getElementById("invoiceNum").value}.pdf`);
  });

  invoiceCounter++;
  document.getElementById("invoiceNum").value = generateInvoiceNumber();
}
