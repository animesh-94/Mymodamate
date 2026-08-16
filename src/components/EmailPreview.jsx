import { useEffect, useRef, useState } from 'react';
import { generateEmailHTML } from '../utils';

export function EmailPreview({ data }) {
    const iframeRef = useRef(null);
    const [html, setHtml] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const generatedHtml = generateEmailHTML(data);
        setHtml(generatedHtml);
        
        if (iframeRef.current) {
            const doc = iframeRef.current.contentWindow.document;
            doc.open();
            doc.write(generatedHtml);
            doc.close();
        }
    }, [data]);

    const showToastMsg = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const copyHtml = () => {
        navigator.clipboard.writeText(html).then(() => {
            showToastMsg('✅ HTML copied to clipboard!');
        }).catch(() => {
            showToastMsg('❌ Failed to copy HTML.');
        });
    };

    const downloadHtml = () => {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = (data.customerName || 'Customer').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `order_${safeName}_${data.orderRef || 'ref'}.html`;
        a.click();
        URL.revokeObjectURL(url);
        showToastMsg('✅ Download started!');
    };

    const refreshPreview = () => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentWindow.document;
            doc.open();
            doc.write(html);
            doc.close();
            showToastMsg('✅ Preview refreshed!');
        }
    };

    return (
        <div>
            <div className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div className="card-title" style={{ margin: 0 }}>📧 Email Preview</div>
                    <div className="preview-actions" style={{ margin: 0 }}>
                        <button className="btn-secondary" onClick={copyHtml}>📋 Copy HTML</button>
                        <button className="btn-success" onClick={downloadHtml}>⬇️ Download .html</button>
                        <button className="btn-primary" onClick={refreshPreview}>⟳ Refresh</button>
                    </div>
                </div>
            </div>

            <div className="preview-wrap">
                <iframe ref={iframeRef} title="Email Preview"></iframe>
            </div>

            <div style={{ marginTop: '12px', fontSize: '13px', color: '#6b7a8f', textAlign: 'center', background: '#fff', borderRadius: '16px', padding: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                ⚡ All changes are reflected in real‑time. Use the buttons above to copy or download the HTML.
            </div>

            <div className={`toast ${showToast ? 'show' : ''}`}>
                {toastMessage}
            </div>
        </div>
    );
}
