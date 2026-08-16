import { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from '../data';
import { getProductById, formatCurrency } from '../utils';

export function ProductList({ orderItems, setOrderItems }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const updateItem = (index, key, value) => {
        const newItems = [...orderItems];
        newItems[index][key] = value;
        
        // If product changed, reset package index if out of bounds
        if (key === 'productId') {
            const p = getProductById(value);
            if (p && newItems[index].packageIndex >= p.packages.length) {
                newItems[index].packageIndex = p.packages.length - 1;
            }
        }
        
        setOrderItems(newItems);
    };

    const removeItem = (index) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    const toggleProduct = (productId) => {
        const exists = orderItems.some(item => item.productId === productId);
        if (exists) {
            setOrderItems(orderItems.filter(item => item.productId !== productId));
        } else {
            setOrderItems([...orderItems, { productId, packageIndex: 0, qty: 1 }]);
        }
    };

    return (
        <div className="card">
            <div className="card-title">
                📦 Products
                <span className="count">{orderItems.length}</span>
            </div>

            <div className="multi-select-dropdown" ref={dropdownRef}>
                <button 
                    className={`multi-select-btn ${dropdownOpen ? 'active' : ''}`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <span>{orderItems.length === 0 ? 'Select Medicines...' : `${orderItems.length} Medicine(s) Selected`}</span>
                    <span style={{ fontSize: '12px' }}>▼</span>
                </button>
                
                {dropdownOpen && (
                    <div className="multi-select-menu">
                        {PRODUCTS.map(prod => {
                            const isSelected = orderItems.some(item => item.productId === prod.id);
                            return (
                                <div 
                                    key={prod.id} 
                                    className={`multi-select-option ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleProduct(prod.id)}
                                >
                                    <img src={prod.image} alt={prod.name} />
                                    <span className="name">{prod.name}</span>
                                    <div className="multi-select-checkbox"></div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <div>
                {orderItems.length === 0 ? (
                    <div className="empty-state" style={{ padding: '16px 0' }}>
                        <p style={{ fontSize: '14px', color: '#6b7a8f' }}>No products added yet. Select medicines from the dropdown above.</p>
                    </div>
                ) : (
                    orderItems.map((item, idx) => {
                        const p = getProductById(item.productId);
                        if (!p) return null;
                        
                        return (
                            <div className="product-row" key={idx}>
                                <div className="col">
                                    <label>Product</label>
                                    <div style={{ fontWeight: 600, color: '#1a2639', marginTop: '8px', fontSize: '15px' }}>
                                        {p.name}
                                    </div>
                                </div>
                                <div className="col">
                                    <label>Package</label>
                                    <select 
                                        value={item.packageIndex}
                                        onChange={e => updateItem(idx, 'packageIndex', parseInt(e.target.value))}
                                    >
                                        {p.packages.map((pkg, i) => (
                                            <option key={i} value={i}>
                                                {pkg.label} — {formatCurrency(pkg.price)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-sm">
                                    <label>Qty</label>
                                    <input 
                                        type="number" 
                                        value={item.qty} 
                                        min="1" 
                                        step="1"
                                        onChange={e => {
                                            let val = parseInt(e.target.value) || 1;
                                            if (val < 1) val = 1;
                                            updateItem(idx, 'qty', val);
                                        }}
                                    />
                                </div>
                                <div className="col-xs">
                                    <button className="remove-btn" onClick={() => removeItem(idx)}>✕</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
