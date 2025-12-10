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

      <label><b>Gold Breakdown:</b></label>
      <input class="goldBreak" placeholder="Gold (18kt, 5.20gm) = ₹24500" />

      <label><b>Diamond Breakdown:</b></label>
      <input class="diaBreak" placeholder="Diamond (0.20ct, 0.05ct) = ₹12300" />

      <label><b>Making Charges:</b></label>
      <input class="makingBreak" placeholder="₹1950" />

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
        <td>${amounts[i]}</td>
      </tr>

      <tr class="detail-row">
        <td colspan="5" style="padding-left: 10px; font-size: 13px;">
          ${goldBreak[i] ? `<div><b>${goldBreak[i]}</b></div>` : ""}
          ${diaBreak[i] ? `<div><b>${diaBreak[i]}</b></div>` : ""}
          ${
            makingBreak[i]
              ? `<div><b>Making Charges:</b> ${makingBreak[i]}</div>`
              : ""
          }
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
