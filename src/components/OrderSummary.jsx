import { getProductById, getPackageLabel, getPackagePrice, formatCurrency } from '../utils';

export function OrderSummary({ orderItems, discountPercent, shippingAmount }) {
    
    if (orderItems.length === 0) {
        return (
            <div className="card">
                <div className="card-title">🧾 Order Summary</div>
                <div className="empty-state">
                    <div className="icon">🛒</div>
                    <p>Add a product above to see the summary.</p>
                </div>
            </div>
        );
    }

    let subtotal = 0;
    
    const itemsHtml = orderItems.map((item, idx) => {
        const p = getProductById(item.productId);
        if (!p) return null;
        
        const pkgLabel = getPackageLabel(item.productId, item.packageIndex);
        const unitPrice = getPackagePrice(item.productId, item.packageIndex);
        const lineTotal = unitPrice * item.qty;
        subtotal += lineTotal;

        const isFree = (item.productId === 'modafresh200' && item.packageIndex === 2);

        return (
            <tr key={idx}>
                <td>
                    <div className="product-cell">
                        <img src={p.image} alt={p.name} loading="lazy" />
                        <div className="info">
                            <span className="name">{p.name}</span>
                            <span className="variant">{pkgLabel} × {item.qty}</span>
                        </div>
                    </div>
                </td>
                <td className="text-center">{item.qty}</td>
                <td className="text-right price">{formatCurrency(lineTotal)}</td>
            </tr>
        );
    });

    const discPct = parseFloat(discountPercent) || 0;
    const discountAmount = subtotal * (discPct / 100);
    const shippingVal = parseFloat(shippingAmount) || 0;
    const shippingCharge = subtotal >= 100 ? 0 : shippingVal;
    const total = subtotal - discountAmount + shippingCharge;

    return (
        <div className="card">
            <div className="card-title">🧾 Order Summary</div>
            <div>
                <table className="summary-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th className="text-center">Qty</th>
                            <th className="text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsHtml}
                    </tbody>
                </table>

                <div className="totals">
                    <div className="row label">
                        <span>Subtotal</span>
                        <span className="value">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="row label discount">
                        <span>Discount ({discPct}%)</span>
                        <span className="value">-{formatCurrency(discountAmount)}</span>
                    </div>
                    <div className="row label shipping">
                        <span>Shipping</span>
                        <span className="value">{subtotal >= 100 ? 'FREE' : formatCurrency(shippingCharge)}</span>
                    </div>
                    <div className="row total">
                        <span>Total (USD)</span>
                        <span className="value">{formatCurrency(total)}</span>
                    </div>
                    <div style={{
                        textAlign: 'right', 
                        marginTop: '6px', 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        color: '#b85e00', 
                        background: '#fef9e7', 
                        padding: '4px 14px', 
                        borderRadius: '30px', 
                        display: 'inline-block', 
                        float: 'right'
                    }}>
                        AUD {(total * 1.455).toFixed(2)}
                    </div>
                    <div style={{ clear: 'both' }}></div>
                </div>
            </div>
        </div>
    );
}
