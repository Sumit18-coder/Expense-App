import React from "react";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const DownloadExpensesPdf = ({ expenses }) => {
  const generatePdf = () => {
    const pdfDoc = {
      content: [
        {
          text: "Expenses",
          style: "header",
        },
        {
          table: {
            widths: ["*", "*"],
            body: expenses.map((expense) => [
              expense.name,
              expense.amount,
            ]),
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 16,
          margin: [0, 10],
        },
      },
    };

    pdfMake.createPdf(pdfDoc).download("expenses.pdf");
  };

  return (
    <button className="button" onClick={generatePdf}>
      Download Expenses (PDF)
    </button>
  );
};

export default DownloadExpensesPdf;