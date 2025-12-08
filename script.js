let invoiceCounter = 1;

function generateInvoiceNumber() {
  const d = new Date();
  return `${d.getMonth() + 1}-${d.getFullYear()}-${invoiceCounter}`;
}

// Set default invoice number on page load
document.getElementById("invoiceNum").value = generateInvoiceNumber();

function generateInvoice() {
  // Fill invoice output fields
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

  document.getElementById("out_itemName").textContent =
    document.getElementById("itemName").value;

  document.getElementById("out_grossWt").textContent =
    document.getElementById("grossWt").value;

  document.getElementById("out_netWt").textContent =
    document.getElementById("netWt").value;

  document.getElementById("out_rate").textContent =
    document.getElementById("rate").value;

  document.getElementById("out_amount").textContent =
    document.getElementById("amount").value;

  const amount = Number(document.getElementById("amount").value);
  const cgst = Number(document.getElementById("cgst").value);
  const sgst = Number(document.getElementById("sgst").value);
  const igst = Number(document.getElementById("igst").value);

  const cgstVal = (amount * cgst) / 100;
  const sgstVal = (amount * sgst) / 100;
  const igstVal = (amount * igst) / 100;

  const total = amount + cgstVal + sgstVal + igstVal;

  document.getElementById("out_cgst").textContent = cgstVal.toFixed(2);
  document.getElementById("out_sgst").textContent = sgstVal.toFixed(2);
  document.getElementById("out_igst").textContent = igstVal.toFixed(2);
  document.getElementById("out_total").textContent = total.toFixed(2);

  // PDF generation
  html2canvas(document.getElementById("invoice")).then((canvas) => {
    const img = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("p", "mm", "a4");

    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save(`Invoice-${document.getElementById("invoiceNum").value}.pdf`);
  });

  // Increment invoice number for next use
  invoiceCounter++;
  document.getElementById("invoiceNum").value = generateInvoiceNumber();
}
