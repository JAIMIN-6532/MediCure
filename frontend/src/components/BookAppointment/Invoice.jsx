import { FaFileInvoice, FaUser, FaCreditCard } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function Invoice({ invoice, doctor, patient, form }) {
  // function to generate pdf
  const formatDateInIST = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(20);
    doc.text("MEDICURE", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice from: ${doctor.name}`, 20, 30);
    doc.text(`${doctor.clinicaddress}`, 20, 35);
    doc.text(`${doctor.city}`, 20, 40);

    // Add Invoice Details
    doc.text(`Order: #${invoice.orderId}`, 150, 30);
    doc.text(`Issued: ${invoice.issueDate}`, 150, 35);

    // Add Patient Details
    doc.text(`Invoice To: ${patient.name}`, 20, 50);
    doc.text(`${patient.email}`, 20, 55);
    doc.text(`${patient.phone || "N/A"}`, 20, 60);

    // Add Payment Details
    doc.text(`Payment Method: ${form.paymentMethod || "N/A"}`, 150, 50);
    doc.text(
      `Appointment-Date: ${formatDateInIST(form.selectedDate) || "N/A"}`,
      150,
      55
    );
    doc.text(`TimeSlot: ${form.selectedSlot || "N/A"}`, 150, 60);

    const tableData = [
      [form.serviceType, `${"1"}`, `${"0"}`, `${doctor?.consultationFee}`],
    ];

    // Add Table with items
    doc.autoTable({
      head: [["Description", "Quantity", "VAT", "Total"]],
      body: tableData,
      startY: 70, // this is where the table will start
      theme: "striped",
    });

    const tableEndY = doc.lastAutoTable.finalY;

    doc.text(`Subtotal:  ${doctor.consultationFee}`, 150, tableEndY + 10);
    doc.text(`Total Amount:  ${doctor.consultationFee}`, 150, tableEndY + 25);

    doc.save("invoice.pdf");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center gap-3">
            <FaFileInvoice />
            MEDICURE
          </h1>
          <div className="text-gray-600">
            <p className="font-semibold mb-1 text-primary">Invoice From</p>
            <div className="space-y-1">
              <p className="font-medium">{doctor.name}</p>
              <p>{doctor.clinicaddress}</p>
              <p>{doctor.city}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">
              Order: <span className="font-semibold">#{invoice.orderId}</span>
            </p>
            <p className="text-gray-600">
              Issued: <span className="font-semibold">{invoice.issueDate}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
        <div className="flex-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="font-semibold mb-3 text-primary flex items-center gap-2">
              <FaUser />
              Invoice To
            </p>
            <div className="space-y-1 text-gray-600">
              <p className="font-medium">{patient.name}</p>
              <p>{patient.email}</p>
              <p>{patient.phone || 17362736236}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-4 px-6">Description</th>
              <th className="text-center py-4 px-6">Quantity</th>
              <th className="text-center py-4 px-6">VAT</th>
              <th className="text-right py-4 px-6">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="py-4 px-6">{form.serviceType}</td>
              <td className="text-center py-4 px-6">{"1"}</td>
              <td className="text-center py-4 px-6">₹{"0"}</td>
              <td className="text-right py-4 px-6 font-medium">
                ₹{doctor?.consultationFee}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-80 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold">₹{doctor?.consultationFee}</span>
          </div>
          <div className="flex justify-between text-gray-600"></div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">
              ₹{doctor?.consultationFee}
            </span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6 text-right">
        <button
          onClick={generatePDF}
          className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary-dark"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}
