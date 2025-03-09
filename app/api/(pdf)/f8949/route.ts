const { PDFDocument } = require('pdf-lib');

type TxMetadata = {
    id: string;
    userId: string;
    wallet: string;
    address: string;
    tokenName: string;
    tokenSymbol: string;
    tokenLogo: string;
    fromAddress: string;
    toAddress: string;
    tx_hash: string;
    log_index: number;
    block_timestamp: string;
    value_decimal: number;
    usdPrice: number | null;
    historicalTokenPrice: number | null;
    salePrice: number | null;
    costBasis: number | null;
};

async function fillForm8949(dataArray: TxMetadata[]) {
    // Load the existing PDF
    const url = 'path_to_your_8949_form.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Get the form from the PDF
    const form = pdfDoc.getForm();

    // Perform calculations based on dataArray
    // For example, you could aggregate data from each TxMetadata object
    // and then set these aggregated values to the form fields

    // Example of setting text to a field
    form.getTextField('totalTransactions').setText(dataArray.length.toString());

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    // Return the modified PDF bytes
    return pdfBytes;
}

export default async function handler(req: Request, res: Response) {
    try {
        const dataArray: TxMetadata[] = req.body;
        console.log("Body Response from the 8949 route: ", req.body)

        if (!dataArray || dataArray.length === 0) {
            return new Response(JSON.stringify({ error: "Array of TxMetadata is required" }), { status: 400 });
        }

        const pdfBytes = await fillForm8949(dataArray);

        // Set headers for file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=filledForm8949.pdf');
        
        // Send the PDF in the response
        return res.status(200).send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}