export function PaymentMethod({ paymentMethod, setPaymentMethod }) {
    return (
        <div className="card">
            <div className="card-title">💳 Payment Method</div>
            <div className="payment-select">
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="link">🔗 Payment Link</option>
                    <option value="au">🏦 AU Bank Transfer</option>
                    <option value="us">🏦 US Bank Transfer</option>
                    <option value="eu">🏦 EU Bank Transfer</option>
                    <option value="crypto">₮ USDT (TRC20)</option>
                </select>
            </div>
        </div>
    );
}
