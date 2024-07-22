import jsPDF from 'jspdf';
import BudgetPage from './BudgetPage';

const MyList = ({ items }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("List of Items", 14, 10);

    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`, 14, 20 + (index * 5));
    });

    doc.save("my_list.pdf");
  };

  return (
    <div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};