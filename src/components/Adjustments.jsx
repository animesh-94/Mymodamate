export function Adjustments({ discountPercent, setDiscountPercent, shippingAmount, setShippingAmount }) {
    return (
        <div className="card">
            <div className="card-title">⚙️ Adjustments</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                <div className="editable-field">
                    <label>Discount %</label>
                    <input 
                        type="number" 
                        value={discountPercent} 
                        onChange={e => setDiscountPercent(e.target.value)}
                        min="0" max="100" step="0.5" 
                    />
                    <span className="hint">%</span>
                </div>
                <div className="editable-field">
                    <label>Shipping (USD)</label>
                    <input 
                        type="number" 
                        value={shippingAmount} 
                        onChange={e => setShippingAmount(e.target.value)}
                        min="0" step="0.50" 
                    />
                    <span className="hint">(free if subtotal ≥ $100)</span>
                </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '13px', color: '#6b7a8f', background: '#f8fafd', padding: '8px 14px', borderRadius: '10px' }}>
                ⚡ Discount applies to subtotal before shipping. Shipping is free when subtotal ≥ $100.
            </div>
        </div>
    );
}
