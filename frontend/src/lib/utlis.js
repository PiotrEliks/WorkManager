import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const replacePolishChars = (str) => {
  if (!str) return '';
  return str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (char) => {
    const map = {
      ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
      Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ó: 'O', Ś: 'S', Ź: 'Z', Ż: 'Z',
    };
    return map[char] || char;
  });
};

const clean = (val) => {
  return typeof val === 'string'
    ? replacePolishChars(val)
    : val;
};

export const exportToExcel = (headers, data, fileName = 'eksport') => {
  const tableColumns = headers.map(h => clean(h.label));
  const tableData = data.map(item =>
    headers.reduce((row, h) => {
      row[h.label] = clean(item[h.key]);
      return row;
    }, {})
  );
  
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const fullFileName = `${fileName}-${dateStr}`;

  const ws = XLSX.utils.json_to_sheet(tableData, { header: tableColumns });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dane');
  XLSX.writeFile(wb, `${fullFileName}.xlsx`);
};

export const exportToPDF = (headers, data, fileName = 'eksport') => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(12);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const fullFileName = `${fileName}-${dateStr}`;

  doc.setProperties({
    title: fullFileName,
    subject: 'Eksport danych',
    author: 'Twoja aplikacja',
    keywords: 'eksport, dane, PDF',
  });

  const tableColumns = headers.map(h => clean(h.label));
  const tableData = data.map(item =>
    headers.map(h => clean(item[h.key]))
  );

  autoTable(doc, {
    head: [tableColumns],
    body: tableData,
    startY: 20,
    margin: { top: 20, left: 10, right: 10 },
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  const pdfOutput = doc.output('bloburl');
  const link = document.createElement('a');
  link.href = pdfOutput;
  link.target = '_blank';
  link.click();
};
