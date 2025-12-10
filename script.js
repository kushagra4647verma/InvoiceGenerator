let invoiceCounter = 1;

function generateInvoiceNumber() {
  const d = new Date();
  return `${d.getMonth() + 1}-${d.getFullYear()}-${invoiceCounter}`;
}

document.getElementById("invoiceNum").value = generateInvoiceNumber();

function addItem() {
  const container = document.getElementById("itemContainer");

  const itemHTML = `
    <div class="item-block">

      <label>Item Name:</label>
      <input class="itemName" />

      <label>Gross Weight:</label>
      <input class="grossWt" />

      <label>Net Weight:</label>
      <input class="netWt" />

      <label>Rate (INR):</label>
      <input class="rate" />

      <label>Amount (INR):</label>
      <input class="amount" />

      <hr />

      <h4><b>Gold Details</b></h4>
      <label>Purity:</label>
      <select class="goldPurity">
        <option value="18kt">18kt</option>
        <option value="14kt">14kt</option>
        <option value="22kt">22kt</option>
      </select>

      <label>Gold Weight (gm):</label>
      <input class="goldWeight" />

      <label>Gold Amount (₹):</label>
      <input class="goldAmount" />

      <hr />

      <h4><b>Diamond Details</b></h4>
      <label>Carat List (comma separated):</label>
      <input class="diamondCarats" placeholder="5-0.02ct,3-0.02ct,4-0.05" />

      <label>Diamond Amount (₹):</label>
      <input class="diamondAmount" />

      <hr />

      <label><b>Making Charges (₹):</b></label>
      <input class="makingAmount" />

      <hr />
    </div>
  `;

  container.insertAdjacentHTML("beforeend", itemHTML);
}

function generateInvoice() {
  // ===== BASIC DETAILS =====
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

  // ===== COLLECT ITEM VALUES =====
  const itemNames = [...document.querySelectorAll(".itemName")].map(
    (i) => i.value
  );
  const grossWts = [...document.querySelectorAll(".grossWt")].map(
    (i) => i.value
  );
  const netWts = [...document.querySelectorAll(".netWt")].map((i) => i.value);
  const rates = [...document.querySelectorAll(".rate")].map((i) => i.value);
  const amounts = [...document.querySelectorAll(".amount")].map((i) => i.value);
  const goldPurity = [...document.querySelectorAll(".goldPurity")].map(
    (i) => i.value
  );
  const goldWeight = [...document.querySelectorAll(".goldWeight")].map(
    (i) => i.value
  );
  const goldAmount = [...document.querySelectorAll(".goldAmount")].map(
    (i) => i.value
  );

  const diamondCarats = [...document.querySelectorAll(".diamondCarats")].map(
    (i) => i.value
  );
  const diamondAmount = [...document.querySelectorAll(".diamondAmount")].map(
    (i) => i.value
  );

  const makingAmount = [...document.querySelectorAll(".makingAmount")].map(
    (i) => i.value
  );

  // NEW BREAKDOWN FIELDS
  const goldBreak = [...document.querySelectorAll(".goldBreak")].map(
    (i) => i.value
  );
  const diaBreak = [...document.querySelectorAll(".diaBreak")].map(
    (i) => i.value
  );
  const makingBreak = [...document.querySelectorAll(".makingBreak")].map(
    (i) => i.value
  );

  let tableHTML = "";
  let subtotal = 0;

  // ===== BUILD ITEM TABLE WITH BREAKDOWN =====
  for (let i = 0; i < itemNames.length; i++) {
    if (itemNames[i].trim() === "") continue;

    tableHTML += `
<tr>
  <td>${itemNames[i]}</td>
  <td>${grossWts[i]}</td>
  <td>${netWts[i]}</td>
  <td>${rates[i]}</td>
  <td>
    ₹${amounts[i]}

    <div style="font-size:12px; margin-top:6px;">

      <div><b>Gold:</b> ${goldPurity[i]}, ${goldWeight[i]}g = ₹${goldAmount[i]}</div>

      <div><b>Diamond:</b> (${diamondCarats[i]}) = ₹${diamondAmount[i]}</div>

      <div><b>Making:</b> ₹${makingAmount[i]}</div>

    </div>
  </td>
</tr>
`;

    subtotal += Number(amounts[i]);
  }

  document.getElementById("item_out").innerHTML = tableHTML;

  // ===== GST CALCULATION =====
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

  // ===== GENERATE PDF =====
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
