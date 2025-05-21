import PdfPrinter from "pdfmake";
import fs from "fs";
import path from "path";

const fonts = {
  Roboto: {
    normal: path.join("node_modules/pdfmake/fonts/Roboto-Regular.ttf"),
    bold: path.join("node_modules/pdfmake/fonts/Roboto-Medium.ttf"),
    italics: path.join("node_modules/pdfmake/fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(
      "node_modules/pdfmake/fonts/Roboto-MediumItalic.ttf"
    ),
  },
};

const printer = new PdfPrinter(fonts);

export const generateInvoicePDF = (order, products, filePath) => {
  const logoPath = path.resolve("assets/logo.png"); // Path to your logo

  const docDefinition = {
    content: [
      {
        columns: [
          {
            image: logoPath,
            width: 120,
            alignment: "left",
            margin: [0, 0, 0, 10],
          },
          {
            text: "INVOICE",
            style: "invoiceTitle",
            alignment: "right",
          },
        ],
      },
      {
        columns: [
          {
            width: "*",
            text: `Customer:\n${order.delivery_address[0].first_name} ${order.delivery_address[0].last_name}\n${order.delivery_address[0].address}, ${order.delivery_address[0].city}, ${order.delivery_address[0].state}, ${order.delivery_address[0].country}\nPhone: ${order.delivery_address[0].email}\nEmail: ${order.delivery_address[0].phone}`,
            alignment: "left",
            margin: [0, 20, 0, 10],
          },
          {
            width: "*",
            text: `Invoice ID: ${order.order_id}\nDate: ${new Date(
              order.created_at
            ).toLocaleDateString()}`,
            alignment: "right",
            margin: [0, 20, 0, 10],
          },
        ],
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto"],
          body: [
            [
              { text: "Product", bold: true, fillColor: "#eeeeee" },
              { text: "Qty", bold: true, fillColor: "#eeeeee" },
              { text: "Unit Price", bold: true, fillColor: "#eeeeee" },
              { text: "Total", bold: true, fillColor: "#eeeeee" },
            ],
            ...order.products.map((item) => {
              const product = products.find(
                (p) => p._id.toString() === item.product_id
              );
              return [
                product?.name || "N/A",
                item.quantity,
                `${order.currency || "₹"} ${item.price}`,
                `${order.currency || "₹"} ${item.quantity * item.price}`,
              ];
            }),
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? null : "#f9f9f9"),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#cccccc",
          vLineColor: () => "#cccccc",
        },
        margin: [0, 10, 0, 20],
      },
      {
        columns: [
          { width: "*", text: "" },
          {
            width: "auto",
            table: {
              body: [
                [
                  "Subtotal:",
                  `${order.currency || "₹"} ${order.sub_total.toFixed(2)}`,
                ],
                [
                  "Discount:",
                  `${order.currency || "₹"} ${order.discount || 0}`,
                ],
                [
                  "Delivery:",
                  `${order.currency || "₹"} ${order.delivery_charge}`,
                ],
                [
                  { text: "Total:", bold: true },
                  {
                    text: `${order.currency || "₹"} ${order.total.toFixed(2)}`,
                    bold: true,
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
        ],
        margin: [0, 0, 0, 20],
      },
      {
        text: "Thank you for your purchase!",
        alignment: "center",
        italics: true,
        margin: [0, 10, 0, 0],
      },
    ],
    styles: {
      invoiceTitle: {
        fontSize: 22,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();
};
