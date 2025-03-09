import { useEffect, useState } from 'react';
import apiClient from '@/libs/api';

const YourComponent = ({ TxMetadata }: { TxMetadata: typeof TxMetadata[]}) => {
    const [walletHoldings, setWalletHoldings] = useState(null);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await apiClient.post('/api/8949', TxMetadata, {
                    responseType: 'blob', // Important for handling the PDF data
                });

                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                setWalletHoldings(URL.createObjectURL(pdfBlob));
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        };

        if (TxMetadata) {
            fetchPdf();
        }
    }, [TxMetadata]);

    return (
        <div>
            {/* Render your PDF or related components here */}
            {walletHoldings && <iframe src={walletHoldings} style={{ width: '100%', height: '500px' }} />}
        </div>
    );
};

export default YourComponent;
