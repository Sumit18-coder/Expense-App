import { createAction } from "@remix-run/router";
import pdfMake from "pdfmake/build/pdfmake";
import htmlToPdfmake from "html-to-pdfmake";

export const printExpensesPdf = createAction("printExpensesPdf");

export async function printExpensesPdfAction({ request }) {
  const formData = await request.formData();
  const expenses = formData.get("expenses");

  const pdfDoc = {
    content: [
      {
        text: "Expenses",
        style: "header",
      },
      {
        table: {
          widths: ["*", "*"],
          body: JSON.parse(expenses).map((expense) => [
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

  return { success: true };
}