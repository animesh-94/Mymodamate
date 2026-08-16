import { useState } from 'react';
import './index.css';

import { Header } from './components/Header';
import { CustomerForm } from './components/CustomerForm';
import { ProductList } from './components/ProductList';
import { OrderSummary } from './components/OrderSummary';
import { PaymentMethod } from './components/PaymentMethod';
import { Adjustments } from './components/Adjustments';
import { EmailPreview } from './components/EmailPreview';

function App() {
    const [customerName, setCustomerName] = useState('Jerome');
    const [orderRef, setOrderRef] = useState('10091');
    const [orderItems, setOrderItems] = useState([]);
    const [discountPercent, setDiscountPercent] = useState('20');
    const [shippingAmount, setShippingAmount] = useState('14.00');
    const [paymentMethod, setPaymentMethod] = useState('link');

    const data = {
        customerName,
        orderRef,
        discountPercent,
        shippingAmount,
        paymentMethod,
        orderItems
    };

    return (
        <div className="app">
            <Header />

            <div className="builder-grid">
                <div>
                    <CustomerForm 
                        customerName={customerName} 
                        setCustomerName={setCustomerName}
                        orderRef={orderRef}
                        setOrderRef={setOrderRef}
                    />

                    <ProductList 
                        orderItems={orderItems} 
                        setOrderItems={setOrderItems} 
                    />

                    <OrderSummary 
                        orderItems={orderItems}
                        discountPercent={discountPercent}
                        shippingAmount={shippingAmount}
                    />

                    <PaymentMethod 
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                    <Adjustments 
                        discountPercent={discountPercent}
                        setDiscountPercent={setDiscountPercent}
                        shippingAmount={shippingAmount}
                        setShippingAmount={setShippingAmount}
                    />
                </div>

                <div>
                    <EmailPreview data={data} />
                </div>
            </div>
        </div>
    );
}

export default App;
