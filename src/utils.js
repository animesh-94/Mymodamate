import { PRODUCTS } from './data';

export function formatCurrency(amount, currency = 'USD') {
    if (currency === 'USD') return '$' + amount.toFixed(2);
    if (currency === 'AUD') return 'AUD $' + amount.toFixed(2);
    return '$' + amount.toFixed(2);
}

export function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

export function getPackagePrice(productId, packageIndex) {
    const p = getProductById(productId);
    if (!p) return 0;
    if (packageIndex >= 0 && packageIndex < p.packages.length) {
        return p.packages[packageIndex].price;
    }
    return 0;
}

export function getPackageLabel(productId, packageIndex) {
    const p = getProductById(productId);
    if (!p) return '';
    if (packageIndex >= 0 && packageIndex < p.packages.length) {
        return p.packages[packageIndex].label;
    }
    return '';
}

export function generateEmailHTML(data) {
    const {
        customerName,
        orderRef,
        discountPercent,
        shippingAmount,
        paymentMethod,
        orderItems
    } = data;

    const name = customerName.trim() || 'Customer';
    const ref = orderRef.trim() || '10091';
    const method = paymentMethod;
    const discPct = parseFloat(discountPercent) || 0;
    const shippingVal = parseFloat(shippingAmount) || 0;

    // Calculate
    let subtotal = 0;
    let itemsHtml = '';

    orderItems.forEach((item) => {
        const p = getProductById(item.productId);
        if (!p) return;
        const isFree = item.isFree || (item.productId === 'modafresh200' && item.packageIndex === 2);
        const pkgLabel = isFree ? `${item.qty} Pills` : getPackageLabel(item.productId, item.packageIndex);
        const unitPrice = getPackagePrice(item.productId, item.packageIndex);
        const lineTotal = unitPrice * item.qty;

        if (!isFree) {
            subtotal += lineTotal;
        }

        itemsHtml += `
            <tr>
                <td style="padding: 20px 20px; border-bottom: 1px solid rgb(238, 242, 246);">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                        <tbody>
                            <tr>
                                <td width="70" style="vertical-align: middle; padding-right: 15px;" valign="middle">
                                    <img src="${p.image}" alt="${p.name}" width="70" height="70" style="border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; border-radius: 12px; background: rgb(240, 243, 248); display: block;">
                                </td>
                                <td style="vertical-align: middle;" valign="middle">
                                    <div style="font-weight: 600; color: rgb(30, 43, 79); font-size: 16px;">${p.name}</div>
                                    <div style="color: rgb(107, 122, 143); font-size: 14px; margin-top: 4px;">
                                        ${pkgLabel}
                                        ${isFree ? `<span style="background-color:rgb(39, 174, 96);color:#fff;font-size:11px;padding:3px 10px;border-radius:30px;font-weight:600;margin-left:6px;display:inline-block;">FREE</span>` : ''}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td style="padding: 20px; border-bottom: 1px solid rgb(238, 242, 246); text-align: center; vertical-align: middle; color: rgb(30, 43, 79); font-size: 16px;" align="center" valign="middle">
                    ${isFree ? '-' : item.qty}
                </td>
                <td style="padding: 20px; border-bottom: 1px solid rgb(238, 242, 246); text-align: right; vertical-align: middle; color: ${isFree ? 'rgb(39, 174, 96)' : 'rgb(30, 43, 79)'}; font-size: 18px; font-weight: 600;" align="right" valign="middle">
                    ${isFree ? 'Free' : formatCurrency(lineTotal)}
                </td>
            </tr>
        `;
    });

    const discountAmount = subtotal * (discPct / 100);
    const shippingCharge = subtotal >= 100 ? 0 : shippingVal;
    const total = subtotal - discountAmount + shippingCharge;
    const audTotal = total * 1.455;

    let paymentBlock = '';

    if (method === 'link') {
        paymentBlock = `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background: rgb(240, 245, 254); border-radius: 22px; border-left: 5px solid rgb(79, 70, 229);">
                <tbody>
                    <tr>
                        <td style="padding: 30px 30px 25px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                                <tbody>
                                    <tr>
                                        <td style="vertical-align: middle; padding-right: 12px;" valign="middle">
                                            <span style="font-size:28px;">🔗</span>
                                            <span style="color:rgb(30, 43, 79);font-size:20px;font-weight:600;display:inline-block;vertical-align:middle;margin-left:8px;">Secure Payment Link</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p style="margin: 15px 0px 8px; line-height: 1.6;">
                                <span style="color:rgb(74, 91, 111);font-size:15px;line-height:1.6;">Click the button below to complete your payment securely via our trusted payment partner. You'll be redirected to a safe checkout page where you can pay with your preferred card or method.</span>
                            </p>
                            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%; max-width: 360px; margin: 20px auto 10px;" width="100%">
                                <tbody>
                                    <tr>
                                        <td align="center" style="background: rgb(79, 70, 229); border-radius: 60px; box-shadow: 0 8px 16px -6px;">
                                            <a href="#" style="display: block; padding: 16px 28px; font-size: 18px; font-weight: 600; color: rgb(255, 255, 255); text-decoration: none; letter-spacing: 0.3px; text-align: center;">💳 Pay Now with Payment Link</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style="font-size: 14px; color: rgb(107, 122, 143); text-align: center; margin-top: 12px;">⚡ Instant · Secure · All major cards accepted</div>
                            <div style="font-size: 15px; margin-top: 16px; background: rgb(229, 237, 253); border-radius: 12px; padding: 12px 16px; color: rgb(30, 43, 79);">
                                <div><b>📌 Reference:</b> <span style="background:rgb(254,243,199);color:rgb(146,64,14);padding:2px 10px;border-radius:6px;font-weight:600;">${ref}</span></div>
                                <span style="color:rgb(74,91,111);font-size:14px;display:block;margin-top:4px;">Write only this reference while making the payment. nothing else.</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    } else if (method === 'au') {
        paymentBlock = `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background: rgb(240, 245, 254); border-radius: 22px; border-left: 5px solid rgb(79, 70, 229);">
                <tbody>
                    <tr>
                        <td style="padding: 30px 30px 25px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                                <tbody>
                                    <tr>
                                        <td style="vertical-align: middle; padding-right: 12px;" valign="middle">
                                            <img src="https://e7.pngegg.com/pngimages/382/83/png-clipart-bank-transfer-logo-wire-transfer-electronic-funds-transfer-bank-payment-computer-icons-bank-text-rectangle.png" alt="Bank Transfer" width="48" style="display:block;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;vertical-align:middle;">
                                            <span style="color:rgb(30,43,79);font-size:20px;font-weight:600;display:inline-block;vertical-align:middle;margin-left:8px;">🏦 AU Bank Transfer</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 20px; width: 100%;" width="100%">
                                <tbody>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Account Holder Name:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:17px;font-weight:500;color:rgb(15,26,46);">JCC GENERAL TRADING AND CONTRACTING</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Payment Method:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:17px;font-weight:500;color:rgb(15,26,46);">NPP / BECS / Osko</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">BSB:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:20px;font-family:'Courier New',monospace;letter-spacing:0.5px;color:rgb(15,26,46);font-weight:700;">252000</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Account Number:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:20px;font-family:'Courier New',monospace;letter-spacing:0.5px;color:rgb(15,26,46);font-weight:700;">029784566</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Bank Name:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:17px;font-weight:500;color:rgb(15,26,46);">BC Payments Australia Pty Ltd</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Amount to pay (AUD):</td></tr>
                                    <tr><td style="padding:0 0 10px;font-size:28px;font-weight:700;color:rgb(31,41,55);">AUD ${audTotal.toFixed(2)}</td></tr>
                                    <tr>
                                        <td style="padding:10px 0 0;">
                                            <div style="background:rgb(229,237,253);border-radius:12px;padding:14px 16px;">
                                                <b>📌 Transfer Comment / Reference:</b>
                                                <span style="background:rgb(254,243,199);color:rgb(146,64,14);padding:2px 10px;border-radius:6px;font-weight:600;display:inline-block;margin-top:4px;">${ref}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:14px 0 0;">
                                            <div style="background:rgb(209,250,229);border-radius:12px;padding:14px 16px;border-left:4px solid rgb(5,150,105);color:rgb(6,95,70);font-size:15px;line-height:1.5;">
                                                <b>📌 Important:</b> The bank account name is long, so sometimes it may not fit fully. That's okay. Just make sure the BSB and account number are entered correctly.
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    } else if (method === 'us') {
        paymentBlock = `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background: rgb(240, 245, 254); border-radius: 22px; border-left: 5px solid rgb(79, 70, 229);">
                <tbody>
                    <tr>
                        <td style="padding: 30px 30px 25px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                                <tbody>
                                    <tr>
                                        <td style="vertical-align: middle; padding-right: 12px;" valign="middle">
                                            <span style="font-size:28px;">🏦</span>
                                            <span style="color:rgb(30,43,79);font-size:20px;font-weight:600;display:inline-block;vertical-align:middle;margin-left:8px;">US Bank Transfer</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 20px; width: 100%;" width="100%">
                                <tbody>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Account Holder Name:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:17px;font-weight:500;color:rgb(15,26,46);">JCC GENERAL TRADING AND CONTRACTING</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Bank Name:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:17px;font-weight:500;color:rgb(15,26,46);">Wells Fargo Bank, N.A.</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Routing Number (ABA):</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:20px;font-family:'Courier New',monospace;letter-spacing:0.5px;color:rgb(15,26,46);font-weight:700;">121000248</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Account Number:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:20px;font-family:'Courier New',monospace;letter-spacing:0.5px;color:rgb(15,26,46);font-weight:700;">987654321</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">SWIFT / BIC:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:17px;font-weight:500;color:rgb(15,26,46);">WFBIUS6S</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Amount to pay (USD):</td></tr>
                                    <tr><td style="padding:0 0 10px;font-size:28px;font-weight:700;color:rgb(31,41,55);">${formatCurrency(total)}</td></tr>
                                    <tr>
                                        <td style="padding:10px 0 0;">
                                            <div style="background:rgb(229,237,253);border-radius:12px;padding:14px 16px;">
                                                <b>📌 Reference / Memo:</b>
                                                <span style="background:rgb(254,243,199);color:rgb(146,64,14);padding:2px 10px;border-radius:6px;font-weight:600;display:inline-block;margin-top:4px;">${ref}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:14px 0 0;">
                                            <div style="background:rgb(209,250,229);border-radius:12px;padding:14px 16px;border-left:4px solid rgb(5,150,105);color:rgb(6,95,70);font-size:15px;line-height:1.5;">
                                                <b>📌 Important:</b> Please include the reference number in the memo field. International transfers may take 1-3 business days.
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    } else if (method === 'eu') {
        paymentBlock = `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background: rgb(240, 245, 254); border-radius: 22px; border-left: 5px solid rgb(79, 70, 229);">
                <tbody>
                    <tr>
                        <td style="padding: 30px 30px 25px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                                <tbody>
                                    <tr>
                                        <td style="vertical-align: middle; padding-right: 12px;" valign="middle">
                                            <span style="font-size:28px;">🏦</span>
                                            <span style="color:rgb(30,43,79);font-size:20px;font-weight:600;display:inline-block;vertical-align:middle;margin-left:8px;">EU Bank Transfer (SEPA)</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 20px; width: 100%;" width="100%">
                                <tbody>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Account Holder Name:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:17px;font-weight:500;color:rgb(15,26,46);">JCC GENERAL TRADING AND CONTRACTING</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Bank Name:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:17px;font-weight:500;color:rgb(15,26,46);">Deutsche Bank AG</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">IBAN:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:20px;font-family:'Courier New',monospace;letter-spacing:0.5px;color:rgb(15,26,46);font-weight:700;">DE89370400440532013000</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">BIC / SWIFT:</td></tr>
                                    <tr><td style="padding:0 0 12px;font-size:17px;font-weight:500;color:rgb(15,26,46);">DEUTDEFF</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;color:rgb(45,58,94);">Amount to pay (EUR):</td></tr>
                                    <tr><td style="padding:0 0 10px;font-size:28px;font-weight:700;color:rgb(31,41,55);">€${(total * 0.92).toFixed(2)}</td></tr>
                                    <tr>
                                        <td style="padding:10px 0 0;">
                                            <div style="background:rgb(229,237,253);border-radius:12px;padding:14px 16px;">
                                                <b>📌 Reference / Memo:</b>
                                                <span style="background:rgb(254,243,199);color:rgb(146,64,14);padding:2px 10px;border-radius:6px;font-weight:600;display:inline-block;margin-top:4px;">${ref}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:14px 0 0;">
                                            <div style="background:rgb(209,250,229);border-radius:12px;padding:14px 16px;border-left:4px solid rgb(5,150,105);color:rgb(6,95,70);font-size:15px;line-height:1.5;">
                                                <b>📌 Important:</b> SEPA transfers usually arrive within 1-2 business days. Please use the reference number in the memo field.
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    } else if (method === 'crypto') {
        paymentBlock = `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background: rgb(255, 247, 237); border-radius: 22px; border-left: 5px solid rgb(245, 158, 11);">
                <tbody>
                    <tr>
                        <td style="padding: 30px 30px 25px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                                <tbody>
                                    <tr>
                                        <td style="vertical-align: middle; padding-right: 12px;" valign="middle">
                                            <img src="https://kripto.media/wp-content/uploads/2019/04/USDT-TRON.png" alt="USDT" width="48" style="display:block;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;vertical-align:middle;">
                                            <span style="color:rgb(146,64,14);font-size:20px;font-weight:600;display:inline-block;vertical-align:middle;margin-left:8px;">₮ USDT (TRC20) Crypto</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p style="margin:15px 0px 5px;font-weight:600;color:rgb(120,53,15);font-size:15px;">💼 Wallet Address (TRC20):</p>
                            <div style="background:rgb(255,255,255);border-radius:14px;padding:15px;word-break:break-all;font-family:'Courier New',monospace;font-size:18px;color:rgb(15,26,46);letter-spacing:0.3px;border:1px solid rgb(253,230,138);font-weight:700;">
                                TNTCuY8FnoKuQMYW271uNu2u3B7jjVuhgS
                            </div>
                            <div style="margin-top:16px;font-size:15px;color:rgb(120,53,15);background:rgb(254,243,199);border-radius:12px;padding:12px 16px;">
                                <div>⚡ Send only <b>USDT</b> on the <b>TRC20 (Tron)</b> network.</div>
                                <div><b>📌 Memo/Reference:</b> <span style="background:rgb(254,243,199);color:rgb(146,64,14);padding:2px 10px;border-radius:6px;font-weight:600;">Order No: ${ref}</span> (if field available)</div>
                            </div>
                            <div style="margin-top:12px;font-size:14px;color:rgb(107,122,143);">💡 Amount: ${formatCurrency(total)} USD equivalent in USDT</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Verdana,Arial,Helvetica,sans-serif;font-size:10pt;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#f4f7fb" style="border-collapse:collapse;width:100%;table-layout:fixed;background-color:#f4f7fb;padding:30px 15px;">
<tr><td align="center" style="padding:30px 15px;">
<table cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;margin:0 auto;max-width:600px;width:100%;background:#fff;border-radius:24px;box-shadow:0 8px 24px;border:1px solid #eaece8;" width="100%">
<tr>
    <td style="padding:40px 40px 20px;" align="center">
        <img src="https://mymodamate.com/wp-content/uploads/2025/10/logo.jpeg" alt="MyModaMate" width="220" style="border:0;line-height:100%;outline:none;text-decoration:none;display:block;max-width:220px;height:auto;margin:0 auto;">
    </td>
</tr>
<tr>
    <td style="padding:0 40px 20px;">
        <h1 style="font-size:24px;font-weight:600;color:#1a2639;margin:0 0 8px;">Dear ${name},</h1>
        <p style="margin:0 0 5px;color:#3a4a5c;font-size:16px;">Good Afternoon,</p>
        <p style="line-height:1.6;margin:15px 0 0;color:#4a5b6f;font-size:15px;">
            Thank you for choosing <b style="color:#1e2b4f;">MyModaMate.com</b> — we truly appreciate your trust in us. Your order has been successfully received, and our team is excited to prepare it for you.
        </p>
        <p style="margin:20px 0 5px;color:#3a4a5c;font-size:16px;"><b>To move forward, kindly complete the payment using one of the methods below.</b></p>
    </td>
</tr>
<tr>
    <td style="padding:10px 40px 25px;">
        <!-- Payment details block -->
        ${paymentBlock}
    </td>
</tr>
<tr>
    <td style="padding:0 40px 20px;">
        <h2 style="font-size:18px;font-weight:600;color:#1a2639;margin:0 0 12px;border-bottom:2px solid #eef2f6;padding-bottom:10px;">Order Summary (Ref: ${ref})</h2>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            <thead>
                <tr>
                    <th align="left" style="padding:10px 20px;background:#f8fafd;color:#4a5b6f;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.3px;border-bottom:2px solid #eef2f6;">Product</th>
                    <th align="center" style="padding:10px 20px;background:#f8fafd;color:#4a5b6f;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.3px;border-bottom:2px solid #eef2f6;">Qty</th>
                    <th align="right" style="padding:10px 20px;background:#f8fafd;color:#4a5b6f;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.3px;border-bottom:2px solid #eef2f6;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:15px;">
            <tr>
                <td align="right" style="padding:5px 20px;color:#4a5b6f;font-size:15px;">Subtotal:</td>
                <td align="right" style="padding:5px 20px;font-weight:600;color:#1a2639;font-size:15px;">${formatCurrency(subtotal)}</td>
            </tr>
            <tr>
                <td align="right" style="padding:5px 20px;color:#4a5b6f;font-size:15px;">Discount (${discPct}%):</td>
                <td align="right" style="padding:5px 20px;font-weight:600;color:#27ae60;font-size:15px;">-${formatCurrency(discountAmount)}</td>
            </tr>
            <tr>
                <td align="right" style="padding:5px 20px;color:#4a5b6f;font-size:15px;">Shipping:</td>
                <td align="right" style="padding:5px 20px;font-weight:600;color:#27ae60;font-size:15px;">${subtotal >= 100 ? 'FREE' : formatCurrency(shippingCharge)}</td>
            </tr>
            <tr>
                <td align="right" style="padding:15px 20px 5px;font-size:18px;font-weight:600;color:#1a2639;border-top:2px solid #eef2f6;">Total:</td>
                <td align="right" style="padding:15px 20px 5px;font-size:20px;font-weight:700;color:#4f46e5;border-top:2px solid #eef2f6;">${formatCurrency(total)}</td>
            </tr>
        </table>
    </td>
</tr>
<tr>
    <td style="padding:20px 40px 40px;text-align:center;">
        <p style="color:#6b7a8f;font-size:13px;line-height:1.6;margin:0;">
            Need help? Reply to this email or visit our <a href="https://mymodamate.com/support" style="color:#4f46e5;text-decoration:none;font-weight:500;">Support Center</a>.<br>
            © 2026 MyModaMate. All rights reserved.
        </p>
    </td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`;
    return html;
}
