// rrd imports
import { useLoaderData } from "react-router-dom";

// library
import { toast } from "react-toastify";

// components
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

// helpers
import { createExpense, deleteItem, getAllMatchingItems } from "../helpers";


import React, { useState } from "react";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Your existing imports...

// loader
export async function budgetLoader({ params }) {
  const budget = await getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: params.id,
  })[0];

  const expenses = await getAllMatchingItems({
    category: "expenses",
    key: "budgetId",
    value: params.id,
  });

  if (!budget) {
    throw new Error("The budget you’re trying to find doesn’t exist");
  }

  return { budget, expenses };
}

// action
export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "createExpense") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      return toast.success(`Expense ${values.newExpense} created!`);
    } catch (e) {
      throw new Error("There was a problem creating your expense.");
    }
  }

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      return toast.success("Expense deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();
  const [showPDF, setShowPDF] = useState(false);

  const ExpenseListPDF = ({ expenses, budget }) => 
    { const totalSpent = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  // Calculate remaining budget
  const remainingBudget = parseFloat(budget.amount) - totalSpent;

  return (
    <Document>
      <Page style={styles.page}>
        <View>
          <Text style={styles.title}>{budget.name} Expenses</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Expense Name</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Amount (Rs)</Text>
              </View>
            </View>
            {expenses.map((expense, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text style={styles.expenseName}>{expense.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.amount}>Rs {expense.amount}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Total Spent:</Text>
            <Text style={styles.summaryValue}>Rs {totalSpent.toFixed(2)}</Text>
            <Text style={styles.summaryText}>Remaining Amount:</Text>
            <Text style={styles.summaryValue}>Rs {remainingBudget.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

  return (
    <div
      className="grid-lg"
      style={{
        "--accent": budget.color,
      }}
    >
      <h1 className="h2">
        <span className="accent">{budget.name}</span> Overview
      </h1>
      <div className="flex-lg">
        <BudgetItem budget={budget} showDelete={true} />
        <AddExpenseForm budgets={[budget]} />
      </div>
      {expenses && expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.name}</span> Expenses
          </h2>
          <Table expenses={expenses} showBudget={false} />
          <button onClick={() => setShowPDF(true)}style={styles.generatePDFButton} >
          Generate PDF
          </button>
          {showPDF && (
  <PDFDownloadLink document={<ExpenseListPDF expenses={expenses} budget={budget} />} fileName="expenses.pdf">
    {({ blob, url, loading, error }) =>
      loading ? "Loading PDF..." : "Download PDF"
    }
  </PDFDownloadLink>
)}
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  generatePDFButton: {
    backgroundColor: "#4CAF50", /* Green */
    border: "none",
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: 16,
    margin: "4px 2px",
    cursor: "pointer",
    borderRadius: 8,
  },
  page: {
    flexDirection: "column",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    textDecoration: "underline",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#000",
    borderRightWidth: 0,
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#000",
    borderRightWidth: 1,
    padding: 10,
  },
  lastCol: {
    borderRightWidth: 0,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  expenseName: {
    fontSize: 14,
  },
  amount: {
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
  },
  summary: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 16,
  },
});
export default BudgetPage;