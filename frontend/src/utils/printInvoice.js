/**
 * printInvoice.js
 * Opens a clean A4 printable invoice in a new browser window,
 * completely isolated from the dark gaming theme.
 */

import html2pdf from 'html2pdf.js';

export function printInvoice(order, logoUrl = '/ady-logo.png') {
  if (!order) return;

  const invoiceNumber = `FAC-${order._id.substring(0, 8).toUpperCase()}`;
  const orderRef = `CMD-${order._id.substring(0, 8).toUpperCase()}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-DZ', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const printDate = new Date().toLocaleDateString('fr-DZ', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const addr = order.shippingAddress || {};
  const fullName = `${addr.prenom || ''} ${addr.nom || ''}`.trim();
  const deliveryMethodLabel = addr.deliveryMethod === 'Office'
    ? 'Retrait Bureau Yalidine'
    : 'Livraison à Domicile';

  const statusLabels = {
    'En attente': 'En attente',
    'Confirmée': 'Confirmée ✓',
    'Préparation': 'En Préparation',
    'Prête': 'Prête',
    'Expédiée': 'Expédiée',
    'Livrée': 'Livrée ✓',
    'Annulée': 'Annulée ✗',
  };

  // Build product rows
  const productRows = (order.orderItems || []).map((item, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; font-size: 12px; vertical-align: middle;">
        <div style="display: flex; align-items: center; gap: 10px;">
          ${item.image
            ? `<img src="${item.image}" alt="" style="width: 40px; height: 40px; object-fit: contain; border: 1px solid #e2e8f0; border-radius: 4px;" />`
            : `<div style="width: 40px; height: 40px; background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 4px;"></div>`}
          <div>
            <div style="font-weight: 700;">${item.name}</div>
            ${item.color ? `<div style="font-size: 10px; color: #718096;">Couleur: ${item.color}</div>` : ''}
          </div>
        </div>
      </td>
      <td style="padding: 10px 12px; text-align: center; font-size: 12px; white-space: nowrap;">${Number(item.price).toLocaleString('fr-DZ')} DA</td>
      <td style="padding: 10px 12px; text-align: center; font-size: 12px;">${item.qty}</td>
      <td style="padding: 10px 12px; text-align: right; font-size: 12px; font-weight: 700; white-space: nowrap;">${(Number(item.price) * Number(item.qty)).toLocaleString('fr-DZ')} DA</td>
    </tr>
  `).join('');

  const discount = Math.max(0, (order.itemsPrice || 0) + (order.shippingPrice || 0) - (order.totalPrice || 0));

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Facture ${invoiceNumber} – ADY Store</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background: #ffffff;
      color: #1a202c;
      font-size: 13px;
      line-height: 1.5;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 18mm 18mm 15mm 18mm;
      background: #ffffff;
      position: relative;
    }

    /* ── Header ── */
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #1a202c;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .brand-block { display: flex; align-items: center; gap: 12px; }
    .brand-logo { height: 48px; width: auto; }
    .brand-name { font-size: 26px; font-weight: 900; letter-spacing: 1px; color: #1a202c; }
    .brand-sub { font-size: 10px; color: #4a5568; margin-top: 3px; }
    .brand-contact { font-size: 10px; color: #718096; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-size: 28px; font-weight: 900; color: #1a202c; letter-spacing: 2px; }
    .invoice-meta p { font-size: 11px; color: #4a5568; margin-top: 4px; }
    .invoice-meta .status-badge {
      display: inline-block;
      margin-top: 8px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      border: 2px solid #1a202c;
    }

    /* ── Two-column info grid ── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .info-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 14px;
    }
    .info-card-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #718096;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }
    .info-row { margin-bottom: 5px; font-size: 12px; }
    .info-label { font-weight: 700; color: #4a5568; }
    .info-value { color: #1a202c; }

    /* ── Products table ── */
    .section-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #4a5568;
      margin-bottom: 8px;
      margin-top: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    thead tr {
      background: #1a202c;
      color: #ffffff;
    }
    thead th {
      padding: 10px 12px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    thead th:first-child { text-align: left; }
    thead th:not(:first-child) { text-align: center; }
    thead th:last-child { text-align: right; }
    tbody tr:nth-child(even) { background: #f7fafc; }
    tbody tr:last-child { border-bottom: 2px solid #1a202c; }

    /* ── Totals ── */
    .totals-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    .totals-box {
      width: 280px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 9px 14px;
      font-size: 12px;
      border-bottom: 1px solid #edf2f7;
    }
    .totals-row:last-child {
      border-bottom: none;
      background: #1a202c;
      color: #ffffff;
      font-weight: 800;
      font-size: 14px;
    }
    .totals-row.discount { color: #2f855a; }

    /* ── Signatures ── */
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
    }
    .sig-box {
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      padding: 10px 12px;
      min-height: 80px;
    }
    .sig-label {
      font-size: 10px;
      font-weight: 700;
      color: #718096;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sig-line {
      border-bottom: 1px solid #cbd5e0;
      margin-top: 40px;
    }

    /* ── Footer ── */
    .invoice-footer {
      margin-top: 24px;
      text-align: center;
      border-top: 2px solid #1a202c;
      padding-top: 14px;
    }
    .invoice-footer p { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
    .invoice-footer small { font-size: 10px; color: #718096; }

    /* ── Print settings ── */
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      html, body { background: #ffffff !important; }
      .page { margin: 0; padding: 14mm; box-shadow: none; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- Header -->
    <div class="invoice-header">
      <div>
        <div class="brand-block">
          <img src="${logoUrl}" alt="ADY Store" class="brand-logo" onerror="this.style.display='none'" />
          <div>
            <div class="brand-name">ADY STORE</div>
            <div class="brand-sub">Matériel High-Tech &amp; Gaming Premium</div>
          </div>
        </div>
        <div class="brand-contact" style="margin-top: 8px;">
          📍 Algérie &nbsp;|&nbsp; 📞 0555 123 456 &nbsp;|&nbsp; ✉ contact@adystore.dz
        </div>
      </div>
      <div class="invoice-meta">
        <h2>FACTURE</h2>
        <p><strong>N° Facture :</strong> ${invoiceNumber}</p>
        <p><strong>N° Commande :</strong> ${orderRef}</p>
        <p><strong>Date Commande :</strong> ${orderDate}</p>
        <p><strong>Date Impression :</strong> ${printDate}</p>
        <div class="status-badge">${statusLabels[order.status] || order.status}</div>
      </div>
    </div>

    <!-- Info Grid: Customer + Delivery -->
    <div class="info-grid">
      <div class="info-card">
        <div class="info-card-title">👤 Informations Client</div>
        <div class="info-row"><span class="info-label">Nom complet : </span><span class="info-value">${fullName}</span></div>
        <div class="info-row"><span class="info-label">Téléphone : </span><span class="info-value">${addr.telephone || '—'}</span></div>
        <div class="info-row"><span class="info-label">Email : </span><span class="info-value">${addr.email || '—'}</span></div>
        <div class="info-row"><span class="info-label">Wilaya : </span><span class="info-value">${addr.wilaya || '—'}</span></div>
        <div class="info-row"><span class="info-label">Commune : </span><span class="info-value">${addr.commune || '—'}</span></div>
        <div class="info-row"><span class="info-label">Adresse : </span><span class="info-value">${addr.adresse || '—'}</span></div>
        ${addr.postalCode ? `<div class="info-row"><span class="info-label">Code Postal : </span><span class="info-value">${addr.postalCode}</span></div>` : ''}
      </div>
      <div class="info-card">
        <div class="info-card-title">🚚 Informations Livraison</div>
        <div class="info-row"><span class="info-label">Mode de livraison : </span><span class="info-value">${deliveryMethodLabel}</span></div>
        <div class="info-row"><span class="info-label">Frais de livraison : </span><span class="info-value">${Number(order.shippingPrice || 0).toLocaleString('fr-DZ')} DA</span></div>
        <div class="info-row"><span class="info-label">Méthode de paiement : </span><span class="info-value">${order.paymentMethod === 'Cash On Delivery' ? 'Paiement à la livraison' : order.paymentMethod}</span></div>
        <div class="info-row"><span class="info-label">Statut : </span><span class="info-value"><strong>${statusLabels[order.status] || order.status}</strong></span></div>
        ${order.customerNotes ? `<div class="info-row" style="margin-top: 8px; font-style: italic; color: #718096; font-size: 11px;">"${order.customerNotes}"</div>` : ''}
      </div>
    </div>

    <!-- Products Table -->
    <div class="section-title">📦 Détail des Produits</div>
    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Article</th>
          <th style="text-align:center;">Prix Unitaire</th>
          <th style="text-align:center;">Qté</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${productRows}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals-wrapper">
      <div class="totals-box">
        <div class="totals-row">
          <span>Sous-total</span>
          <span>${Number(order.itemsPrice || 0).toLocaleString('fr-DZ')} DA</span>
        </div>
        <div class="totals-row">
          <span>Frais de livraison</span>
          <span>${Number(order.shippingPrice || 0).toLocaleString('fr-DZ')} DA</span>
        </div>
        ${discount > 0 ? `
        <div class="totals-row discount">
          <span>Réduction</span>
          <span>− ${discount.toLocaleString('fr-DZ')} DA</span>
        </div>` : ''}
        <div class="totals-row">
          <span>TOTAL</span>
          <span>${Number(order.totalPrice || 0).toLocaleString('fr-DZ')} DA</span>
        </div>
      </div>
    </div>

    <!-- Signatures -->
    <div class="signatures">
      <div class="sig-box">
        <div class="sig-label">Signature Client</div>
        <div class="sig-line"></div>
      </div>
      <div class="sig-box">
        <div class="sig-label">Signature Livreur</div>
        <div class="sig-line"></div>
      </div>
      <div class="sig-box">
        <div class="sig-label">Cachet du Magasin</div>
        <div class="sig-line"></div>
      </div>
    </div>

    <!-- Footer -->
    <div class="invoice-footer">
      <p>Merci pour votre confiance en ADY Store !</p>
      <small>Pour toute réclamation, conservez ce document et référencez le numéro de facture <strong>${invoiceNumber}</strong>.</small>
    </div>
  </div>


</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    // eslint-disable-next-line no-alert
    alert('Veuillez autoriser les popups pour imprimer la facture.');
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}


/**
 * generatePDF — uses html2pdf.js to download an invoice PDF
 * Opens the same clean invoice window and triggers PDF generation.
 */
export function generatePDF(order, logoUrl = '/ady-logo.png') {
  if (!order) return;
  // Build invoice HTML (same as printInvoice but without print script)
  const invoiceNumber = `FAC-${order._id.substring(0, 8).toUpperCase()}`;
  const orderRef = `CMD-${order._id.substring(0, 8).toUpperCase()}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const printDate = new Date().toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const addr = order.shippingAddress || {};
  const fullName = `${addr.prenom || ''} ${addr.nom || ''}`.trim();
  const deliveryMethodLabel = addr.deliveryMethod === 'Office' ? 'Retrait Bureau Yalidine' : 'Livraison à Domicile';
  const statusLabels = {
    'En attente': 'En attente',
    'Confirmée': 'Confirmée ✓',
    'Préparation': 'En Préparation',
    'Prête': 'Prête',
    'Expédiée': 'Expédiée',
    'Livrée': 'Livrée ✓',
    'Annulée': 'Annulée ✗',
  };
  const productRows = (order.orderItems || []).map(item => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; font-size: 12px; vertical-align: middle;">
        <div style="display: flex; align-items: center; gap: 10px;">
          ${item.image ? `<img src="${item.image}" alt="" style="width: 40px; height: 40px; object-fit: contain; border: 1px solid #e2e8f0; border-radius: 4px;" />` : `<div style="width: 40px; height: 40px; background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 4px;"></div>`}
          <div>
            <div style="font-weight: 700;">${item.name}</div>
            ${item.color ? `<div style="font-size: 10px; color: #718096;">Couleur: ${item.color}</div>` : ''}
          </div>
        </div>
      </td>
      <td style="padding: 10px 12px; text-align: center; font-size: 12px; white-space: nowrap;">${Number(item.price).toLocaleString('fr-DZ')} DA</td>
      <td style="padding: 10px 12px; text-align: center; font-size: 12px;">${item.qty}</td>
      <td style="padding: 10px 12px; text-align: right; font-size: 12px; font-weight: 700; white-space: nowrap;">${(Number(item.price) * Number(item.qty)).toLocaleString('fr-DZ')} DA</td>
    </tr>`).join('');
  const discount = Math.max(0, (order.itemsPrice || 0) + (order.shippingPrice || 0) - (order.totalPrice || 0));

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Facture ${invoiceNumber} – ADY Store</title><style>* {margin:0;padding:0;box-sizing:border-box;}body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#fff;color:#1a202c;font-size:13px;line-height:1.5}.page{width:210mm;min-height:297mm;margin:0 auto;padding:18mm 18mm 15mm 18mm;background:#fff;position:relative}.invoice-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1a202c;padding-bottom:14px;margin-bottom:20px}.brand-block{display:flex;align-items:center;gap:12px}.brand-logo{height:48px;width:auto}.brand-name{font-size:26px;font-weight:900;letter-spacing:1px;color:#1a202c}.brand-sub{font-size:10px;color:#4a5568;margin-top:3px}.brand-contact{font-size:10px;color:#718096}.invoice-meta{text-align:right}.invoice-meta h2{font-size:28px;font-weight:900;color:#1a202c;letter-spacing:2px}.invoice-meta p{font-size:11px;color:#4a5568;margin-top:4px}.invoice-meta .status-badge{display:inline-block;margin-top:8px;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;border:2px solid #1a202c}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}.info-card{border:1px solid #e2e8f0;border-radius:6px;padding:12px 14px}.info-card-title{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#718096;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:10px}.info-row{margin-bottom:5px;font-size:12px}.info-label{font-weight:700;color:#4a5568}.info-value{color:#1a202c}.section-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#4a5568;margin-bottom:8px;margin-top:6px}table{width:100%;border-collapse:collapse;margin-bottom:20px}thead tr{background:#1a202c;color:#fff}thead th{padding:10px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px}thead th:first-child{text-align:left}thead th:not(:first-child){text-align:center}thead th:last-child{text-align:right}tbody tr:nth-child(even){background:#f7fafc}tbody tr:last-child{border-bottom:2px solid #1a202c}.totals-wrapper{display:flex;justify-content:flex-end;margin-bottom:24px}.totals-box{width:280px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden}.totals-row{display:flex;justify-content:space-between;padding:9px 14px;font-size:12px;border-bottom:1px solid #edf2f7}.totals-row:last-child{border-bottom:none;background:#1a202c;color:#fff;font-weight:800;font-size:14px}.totals-row.discount{color:#2f855a}.signatures{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:24px;border-top:1px solid #e2e8f0;padding-top:20px}.sig-box{border:1px solid #cbd5e0;border-radius:6px;padding:10px 12px;min-height:80px}.sig-label{font-size:10px;font-weight:700;color:#718096;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px}.sig-line{border-bottom:1px solid #cbd5e0;margin-top:40px}.invoice-footer{margin-top:24px;text-align:center;border-top:2px solid #1a202c;padding-top:14px}.invoice-footer p{font-size:12px;font-weight:700;margin-bottom:4px}.invoice-footer small{font-size:10px;color:#718096}@page{size:A4;margin:0}@media print{html,body{background:#fff!important}.page{margin:0;padding:14mm;box-shadow:none}.no-print{display:none!important}}</style></head><body><div class="page"><div class="invoice-header"><div><div class="brand-block"><img src="${logoUrl}" alt="ADY Store" class="brand-logo" onerror="this.style.display='none'" /><div><div class="brand-name">ADY STORE</div><div class="brand-sub">Matériel High-Tech &amp; Gaming Premium</div></div></div></div><div class="brand-contact" style="margin-top:8px;">📍 Algérie &nbsp;|&nbsp; 📞 0555 123 456 &nbsp;|&nbsp; ✉ contact@adystore.dz</div></div><div class="invoice-meta"><h2>FACTURE</h2><p><strong>N° Facture :</strong> ${invoiceNumber}</p><p><strong>N° Commande :</strong> ${orderRef}</p><p><strong>Date Commande :</strong> ${orderDate}</p><p><strong>Date Impression :</strong> ${printDate}</p><div class="status-badge">${statusLabels[order.status] || order.status}</div></div></div><div class="info-grid"><div class="info-card"><div class="info-card-title">👤 Informations Client</div><div class="info-row"><span class="info-label">Nom complet :</span> <span class="info-value">${fullName}</span></div><div class="info-row"><span class="info-label">Téléphone :</span> <span class="info-value">${addr.telephone || '—'}</span></div><div class="info-row"><span class="info-label">Email :</span> <span class="info-value">${addr.email || '—'}</span></div><div class="info-row"><span class="info-label">Wilaya :</span> <span class="info-value">${addr.wilaya || '—'}</span></div><div class="info-row"><span class="info-label">Commune :</span> <span class="info-value">${addr.commune || '—'}</span></div><div class="info-row"><span class="info-label">Adresse :</span> <span class="info-value">${addr.adresse || '—'}</span></div>${addr.postalCode ? `<div class="info-row"><span class="info-label">Code Postal :</span> <span class="info-value">${addr.postalCode}</span></div>` : ''}</div><div class="info-card"><div class="info-card-title">🚚 Informations Livraison</div><div class="info-row"><span class="info-label">Mode de livraison :</span> <span class="info-value">${deliveryMethodLabel}</span></div><div class="info-row"><span class="info-label">Frais de livraison :</span> <span class="info-value">${Number(order.shippingPrice || 0).toLocaleString('fr-DZ')} DA</span></div><div class="info-row"><span class="info-label">Méthode de paiement :</span> <span class="info-value">${order.paymentMethod === 'Cash On Delivery' ? 'Paiement à la livraison' : order.paymentMethod}</span></div><div class="info-row"><span class="info-label">Statut :</span> <span class="info-value"><strong>${statusLabels[order.status] || order.status}</strong></span></div>${order.customerNotes ? `<div class="info-row" style="margin-top:8px;font-style:italic;color:#718096;font-size:11px;">"${order.customerNotes}"</div>` : ''}</div></div><div class="section-title">📦 Détail des Produits</div><table><thead><tr><th style="text-align:left;">Article</th><th style="text-align:center;">Prix Unitaire</th><th style="text-align:center;">Qté</th><th style="text-align:right;">Total</th></tr></thead><tbody>${productRows}</tbody></table><div class="totals-wrapper"><div class="totals-box"><div class="totals-row"><span>Sous-total</span><span>${Number(order.itemsPrice || 0).toLocaleString('fr-DZ')} DA</span></div><div class="totals-row"><span>Frais de livraison</span><span>${Number(order.shippingPrice || 0).toLocaleString('fr-DZ')} DA</span></div>${discount > 0 ? `<div class="totals-row discount"><span>Réduction</span><span>− ${discount.toLocaleString('fr-DZ')} DA</span></div>` : ''}<div class="totals-row"><span>TOTAL</span><span>${Number(order.totalPrice || 0).toLocaleString('fr-DZ')} DA</span></div></div></div><div class="signatures"><div class="sig-box"><div class="sig-label">Signature Client</div><div class="sig-line"></div></div><div class="sig-box"><div class="sig-label">Signature Livreur</div><div class="sig-line"></div></div><div class="sig-box"><div class="sig-label">Cachet du Magasin</div><div class="sig-line"></div></div></div><div class="invoice-footer"><p>Thank you for choosing ADY Store.</p><p>For any questions regarding your order, please contact us at:</p><p>support@adystore.dz</p><p>© 2026 ADY Store. All rights reserved.</p></div></div></body></html>`;

  const container = document.createElement('div');
  container.innerHTML = html;
  const fileName = `ADY_Store_Invoice_${invoiceNumber}.pdf`;
  const opt = {
    margin: [0, 0, 0, 0],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  // eslint-disable-next-line no-unused-expressions
  html2pdf().set(opt).from(container).save();
}


