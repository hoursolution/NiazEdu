import React from "react";
import Invoice from "./Invoice";

const FeeInvoice = () => {
  const invoiceData = {
    invoiceNumber: "INV-001",
    date: "2024-02-01",
    dueDate: "2024-02-15",
    items: [
      { description: "Tuition Fee", amount: 500 },
      { description: "Books", amount: 50 },
      // Add more items as needed
    ],
  };

  return <Invoice invoiceData={invoiceData} />;
};

export default FeeInvoice;
