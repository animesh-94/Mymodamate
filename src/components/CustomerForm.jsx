export function CustomerForm({ customerName, setCustomerName, orderRef, setOrderRef }) {
    return (
        <div className="card">
            <div className="card-title">👤 Customer</div>
            <div className="customer-field">
                <label>Name</label>
                <input 
                    type="text" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                    placeholder="Customer name" 
                />
                <label style={{ marginLeft: '8px' }}>Order Ref</label>
                <input 
                    type="text" 
                    value={orderRef} 
                    onChange={e => setOrderRef(e.target.value)} 
                    placeholder="Reference" 
                    style={{ width: '120px', fontFamily: "'Courier New', monospace", fontWeight: 700 }} 
                />
            </div>
        </div>
    );
}
