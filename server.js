require('dotenv').config();
const express = require('express');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Removed
const app = express();
const path = require('path');

// Serve static files from the "public" directory
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.json());

// --- PRODUCT CATALOG (Single Source of Truth) ---
// Prices in Cents (CAD)
const PRODUCT_CATALOG = {
    // Roasted Coffee
    'Full Crank Espresso': 2200,
    'Half Crank Espresso': 2200,
    'Colombia Excelso Organic': 2400,
    'Ethiopia Yergacheffe': 2500,
    'India Monsoon Malabar': 2400,
    'Swiss Water Decaf': 2400,

    // Green Beans
    'Green Colombia Excelso': 1500,
    'Green Ethiopia Yergacheffe': 1600,
    'Green India Monsoon': 1500,
    'Green Swiss Water Decaf': 1600,

    // Custom Blend (4-Bag Set)
    'Custom Crank Blend': 8000
};


// Start Server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
