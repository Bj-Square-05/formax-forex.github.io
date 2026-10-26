const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const input3 = document.getElementById("input3");
const input4 = document.getElementById("input4");
const answer = document.getElementById("answer");
const answer2 = document.getElementById("answer2");

// Input 1 and 3: digits only
function allowNumbersOnly(input) {
    input.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
        calculateDivision();
    });
}

// Input 2 and 4: digits and one decimal point
function allowDecimal(input, calculateFunction) {
    input.addEventListener("input", function () {
        let value = this.value.replace(/[^0-9.]/g, "");
        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts.slice(1).join("");
        }
        this.value = value;
        calculateFunction();
    });
}

// Input 1 ÷ Input 2
function calculateDivision() {
    const a = input1.value;
    const b = input2.value;
    if (a === "" || b === "") {
        answer.textContent = "0";
        return;
    }
    const num1 = Number(a);
    const num2 = Number(b);
    if (num2 === 0) {
        answer.textContent = "0";
        return;
    }
    const result = num1 / num2;
    answer.textContent = Number.isFinite(result)
        ? Math.ceil(parseFloat(result.toFixed(10)).toString())
        : "0";
}

function calculateMultiplication() {
    const input3 = parseFloat(document.getElementById("input3").value) || 0;
    const input4 = parseFloat(document.getElementById("input4").value) || 0;
    const result = input3 * input4;
    document.getElementById("answer2").textContent = result;
    // Amount ko do parts mein divide karna
    const amount1 = Math.min(result, 100000);
    const amount2 = Math.max(result - 100000, 0);
    document.getElementById("gstamountinput1").value = amount1;
    document.getElementById("gstamountinput2").value = amount2;
    // Pehle amount ka GST percentage
    const gstPercentage1 = document.getElementById("gstprecentageinput1");
    if (amount1 <= 25000) {
        gstPercentage1.value = "0.45%";
    } else {
        gstPercentage1.value = "0.18%";
    }
    // Doosre amount ka GST percentage
    const gstPercentage2 = document.getElementById("gstprecentageinput2");
    if (amount2 > 0) {
        gstPercentage2.value = "0.09%";
    } else {
        gstPercentage2.value = "0%";
    }
    // Pehle amount ka GST
    const gstValue1 = amount1 * (parseFloat(gstPercentage1.value) || 0) / 100;
    document.getElementById("gsttotalinput1").value = Math.ceil(gstValue1.toFixed(2));
    // Doosre amount ka GST
    const gstValue2 = amount2 * (parseFloat(gstPercentage2.value) || 0) / 100;
    document.getElementById("gsttotalinput2").value = Math.ceil(gstValue2.toFixed(2));
    // GST Total 1 + GST Total 2 + Fix Charge
    const total1 = parseFloat(document.getElementById("gsttotalinput1").value) || 0;
    const total2 = parseFloat(document.getElementById("gsttotalinput2").value) || 0;
    const fixCharge = parseFloat(document.getElementById("fixCharge").value) || 0;
    const finalGST = total1 + total2 + fixCharge;
    // Calculator panel ke GST mein show karna
    document.getElementById("gst").textContent = Math.ceil(finalGST.toFixed(2));
    const amount = parseFloat(document.getElementById("answer2").textContent) || 0;
    const gst = parseFloat(document.getElementById("gst").textContent) || 0;
    const totalAmount = amount + gst;
    document.getElementById("final").textContent = Math.ceil(totalAmount.toFixed(2));
}

document.getElementById("fixCharge").addEventListener("input", function () {
    calculateMultiplication();
});


// Dono inputs change hone par calculation
input3.addEventListener("input", calculateMultiplication);
input4.addEventListener("input", calculateMultiplication);

// Apply input restrictions
allowNumbersOnly(input1);
allowDecimal(input2, calculateDivision);
allowNumbersOnly(input3);
allowDecimal(input4, calculateMultiplication);


// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
// ===================== GST BOX ========================
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
const gstToggle = document.getElementById("gstToggle");
const gstPanel = document.getElementById("gstPanel");
const closeGst = document.getElementById("closeGst");

gstToggle.addEventListener("click", function () {
    gstPanel.classList.add("active");
});

closeGst.addEventListener("click", function () {
    gstPanel.classList.remove("active");
});


// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
// ===================== CLEAR BUTTON ========================
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
document.getElementById("clearCalculator").addEventListener("click", function () {
    document.getElementById("input1").value = "";
    document.getElementById("input2").value = "";
    document.getElementById("input3").value = "";
    document.getElementById("input4").value = "";
    document.getElementById("fixCharge").value = "200";
    document.getElementById("answer").textContent = "0";
    document.getElementById("answer2").textContent = "0";
    document.getElementById("gst").textContent = "0";
    document.getElementById("final").textContent = "0";
});

// ==================================================================
// ================== NEXT BUTTON ===============================
// =================================================================

const addButton = document.getElementById("addButton");
const nextButton = document.getElementById("nextButton");
const billPanel = document.getElementById("billPanel");
const closeBill = document.getElementById("closeBill");
const billContent = document.getElementById("billContent");
const billGrandTotal = document.getElementById("billGrandTotal");

// Saved currency entries
let currencyEntries = [];

// Calculator se current currency ki details lena
function getCurrentCurrency() {
    return {
        name: document.getElementById("calculatorExtraInput").value.trim(),
        currency: document.getElementById("input3").value,
        rate: document.getElementById("input4").value,
        amount: document.getElementById("answer2").textContent,
        gst: document.getElementById("gst").textContent,
        total: document.getElementById("final").textContent
    };
}

// Check karna ki entry mein data hai
function hasCurrencyData(entry) {
    return entry.name !== "" ||
        entry.currency.trim() !== "" ||
        entry.rate.trim() !== "";
}

// Current entry save karna, duplicate save se bachna
function saveCurrentCurrency() {
    const entry = getCurrentCurrency();

    if (!hasCurrencyData(entry)) {
        return false;
    }

    currencyEntries.push(entry);
    return true;
}

// Bill ko render karna
function renderBill() {
    if (currencyEntries.length === 0) {
        billContent.innerHTML =
            '<p class="bill-empty">No currency added yet.</p>';
        billGrandTotal.textContent = "0.00";
        return;
    }

    let grandTotal = 0;

    billContent.innerHTML = currencyEntries.map((entry, index) => {
        const total = parseFloat(entry.total) || 0;
        grandTotal += total;

        return `
            <div class="bill-entry">
                <div class="bill-entry-header">
                    <h3>Currency ${index + 1}</h3>

                    <button
                        type="button"
                        class="delete-currency"
                        data-index="${index}"
                        aria-label="Delete Currency ${index + 1}"
                        title="Delete this currency">
                        <i class="bx bx-x"></i>
                    </button>
                </div>

                <div class="bill-row">
                    <span>Currency Name</span>
                    <strong>${escapeBillText(entry.name || "-")}</strong>
                </div>

                <div class="bill-row">
                    <span>Currency</span>
                    <strong>${escapeBillText(entry.currency || "0")}</strong>
                </div>

                <div class="bill-row">
                    <span>Rate</span>
                    <strong>${escapeBillText(entry.rate || "0")}</strong>
                </div>

                <div class="bill-row">
                    <span>Amount</span>
                    <strong>${escapeBillText(entry.amount || "0")}</strong>
                </div>

                <div class="bill-row">
                    <span>GST</span>
                    <strong>${escapeBillText(entry.gst || "0")}</strong>
                </div>

                <div class="bill-row">
                    <span>Total Amount</span>
                    <strong>${escapeBillText(entry.total || "0")}</strong>
                </div>
            </div>
        `;
    }).join("");
    billGrandTotal.textContent = grandTotal.toFixed(2);
}

billContent.addEventListener("click", function (event) {
    const deleteButton = event.target.closest(".delete-currency");
    if (!deleteButton) return;
    const index = Number(deleteButton.dataset.index);
    if (index < 0 || index >= currencyEntries.length) return;
    // Selected currency delete karo
    currencyEntries.splice(index, 1);
    // Bill aur Grand Total update karo
    renderBill();
});

// User input ko safe text mein badalna
function escapeBillText(value) {
    const span = document.createElement("span");
    span.textContent = String(value);
    return span.innerHTML;
}

// Input fields ko next currency ke liye clear karna
function clearCurrencyInputs() {
    document.getElementById("calculatorExtraInput").value = "";
    document.getElementById("input3").value = "";
    document.getElementById("input4").value = "";

    document.getElementById("answer2").textContent = "0";
    document.getElementById("gst").textContent = "0";
    document.getElementById("final").textContent = "0";

    document.getElementById("gstamountinput1").value = "0";
    document.getElementById("gstprecentageinput1").value = "0%";
    document.getElementById("gsttotalinput1").value = "0";

    document.getElementById("gstamountinput2").value = "0";
    document.getElementById("gstprecentageinput2").value = "0%";
    document.getElementById("gsttotalinput2").value = "0";

    document.getElementById("fixCharge").value = "200";
}

// Add: save karo, panel open mat karo
addButton.addEventListener("click", function () {
    if (saveCurrentCurrency()) {
        clearCurrencyInputs();
    }
});

// Next: current entry save karo aur combined bill open karo
nextButton.addEventListener("click", function () {
    // Current currency ki details save karo
    saveCurrentCurrency();
    // Sabhi saved currencies ka bill dikhao
    renderBill();
    // Input boxes clear karo
    clearCurrencyInputs();
    // Bill Panel open karo
    billPanel.classList.add("active");
});

// Bill panel close
closeBill.addEventListener("click", function () {
    billPanel.classList.remove("active");
});



// ========================================================

const downloadBillPDF = document.getElementById("downloadBillPDF");

downloadBillPDF.addEventListener("click", async function () {
    const originalHTML = downloadBillPDF.innerHTML;

    try {
        if (!currencyEntries || currencyEntries.length === 0) {
            alert("PDF banane ke liye pehle currency add karo.");
            return;
        }

        if (!window.jspdf || !window.html2canvas) {
            alert("PDF libraries load nahi hui hain.");
            return;
        }

        downloadBillPDF.disabled = true;
        downloadBillPDF.textContent = "PDF ban rahi hai...";

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 12;
        const contentWidth = pageWidth - margin * 2;

        const logo = document.querySelector(
            "#billPanel .bill-logo, #billPanel img"
        );

        const logoHTML = logo
            ? logo.outerHTML
            : "";

        const customerName =
            document.getElementById("customerName")?.value.trim() || "-";

        const customerNumber =
            document.getElementById("customerNumber")?.value.trim() || "-";

        const grandTotal = currencyEntries.reduce(
            (sum, entry) => sum + (parseFloat(entry.total) || 0),
            0
        );

        // Har page par maximum 2 currencies
        const pageCount = Math.ceil(currencyEntries.length / 2);

        for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
            if (pageIndex > 0) {
                pdf.addPage();
            }

            const pageCurrencies = currencyEntries.slice(
                pageIndex * 2,
                pageIndex * 2 + 2
            );

            const pageContainer = document.createElement("div");

            Object.assign(pageContainer.style, {
                position: "fixed",
                left: "-10000px",
                top: "0",
                width: "700px",
                boxSizing: "border-box",
                padding: "24px",
                background: "#ffffff",
                color: "#222222",
                fontFamily: "Arial, sans-serif"
            });

            pageContainer.innerHTML = `
                <div style="text-align:center; margin-bottom:20px;">
                    ${logoHTML}
                </div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:20px;
                    padding:14px;
                    margin-bottom:20px;
                    background:#f7f8fc;
                    border-radius:10px;
                    font-size:17px;
                ">
                    <div>
                        <strong>Customer Name</strong>
                        <div style="margin-top:6px; overflow-wrap:anywhere;">
                            ${escapeBillText(customerName)}
                        </div>
                    </div>
                    <div>
                        <strong>Customer Number</strong>
                        <div style="margin-top:6px; overflow-wrap:anywhere;">
                            ${escapeBillText(customerNumber)}
                        </div>
                    </div>
                </div>

                <div id="pdfCurrencyCards"></div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-top:20px;
                    padding:18px;
                    background:#f7f8fc;
                    border-radius:10px;
                    font-size:22px;
                    font-weight:bold;
                ">
                    <span>Grand Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                </div>

                <div style="
                    margin-top:20px;
                    text-align:center;
                    color:#888888;
                    font-size:16px;
                ">
                    Created By <strong>Bhavesh Jain</strong>
                </div>

                <div style="
                    margin-top:12px;
                    text-align:center;
                    color:#888888;
                    font-size:12px;
                ">
                    Page ${pageIndex + 1} of ${pageCount}
                </div>
            `;

            const cardsContainer =
                pageContainer.querySelector("#pdfCurrencyCards");

            pageCurrencies.forEach((entry, localIndex) => {
                const currencyNumber = pageIndex * 2 + localIndex + 1;

                const card = document.createElement("div");
                Object.assign(card.style, {
                    border: "1px solid #deddf5",
                    borderRadius: "16px",
                    padding: "18px",
                    marginBottom: "16px",
                    background: "#ffffff",
                    pageBreakInside: "avoid"
                });

                card.innerHTML = `
                    <h3 style="
                        color:#6860ff;
                        margin:0 0 16px;
                        font-size:20px;
                    ">Currency ${currencyNumber}</h3>

                    ${[
                        ["Currency Name", entry.name],
                        ["Currency", entry.currency],
                        ["Rate", entry.rate],
                        ["Amount", entry.amount],
                        ["GST", entry.gst],
                        ["Total Amount", entry.total]
                    ].map(([label, value]) => `
                        <div style="
                            display:flex;
                            justify-content:space-between;
                            gap:15px;
                            padding:12px 0;
                            border-bottom:1px solid #deddf5;
                            font-size:16px;
                        ">
                            <span>${label}</span>
                            <strong style="
                                text-align:right;
                                overflow-wrap:anywhere;
                            ">${escapeBillText(value || "0")}</strong>
                        </div>
                    `).join("")}
                `;

                cardsContainer.appendChild(card);
            });

            document.body.appendChild(pageContainer);

            try {
                // Fonts aur logo ko render hone ka samay do
                if (document.fonts?.ready) {
                    await document.fonts.ready;
                }

                const images = [...pageContainer.querySelectorAll("img")];

                await Promise.all(images.map(img => {
                    if (img.complete) {
                        return img.decode?.().catch(() => {});
                    }

                    return new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                }));

                const canvas = await html2canvas(pageContainer, {
                    scale: 2,
                    backgroundColor: "#ffffff",
                    useCORS: true,
                    logging: false
                });

                const imageData = canvas.toDataURL("image/jpeg", 0.95);

                const availableHeight = pageHeight - margin * 2;
                const imageHeight =
                    canvas.height * contentWidth / canvas.width;

                const fitScale = Math.min(
                    1,
                    availableHeight / imageHeight
                );

                const finalWidth = contentWidth * fitScale;
                const finalHeight = imageHeight * fitScale;

                pdf.addImage(
                    imageData,
                    "JPEG",
                    (pageWidth - finalWidth) / 2,
                    margin,
                    finalWidth,
                    finalHeight,
                    undefined,
                    "FAST"
                );
            } finally {
                pageContainer.remove();
            }
        }

        pdf.save("Currency-Bill.pdf");

    } catch (error) {
        console.error("PDF generation error:", error);
        alert("PDF nahi ban payi. Dobara try karo.");
    } finally {
        downloadBillPDF.disabled = false;
        downloadBillPDF.innerHTML = originalHTML;
    }
});
