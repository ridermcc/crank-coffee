/**
 * Crank Custom Coffee - Concierge Script
 * "Simple but Exclusive" UX Update
 */

// --- State Management ---
let roastBrief = [];
let currentProduct = {};
let currentQty = 1;

// --- Mobile Menu ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const svg = mobileMenuBtn.querySelector('svg');
        if (mobileMenu.classList.contains('hidden')) {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
        } else {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
        }
    });
}

// Close mobile menu on click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (mobileMenuBtn) {
            mobileMenuBtn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
        }
    });
});

// --- On-Page Guidance (Mood Filters) ---
function highlightRoast(mood) {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        if (mood === 'all') {
            card.classList.remove('opacity-20', 'blur-sm');
            return;
        }

        const cardMood = card.getAttribute('data-mood');
        if (cardMood === mood) {
            card.classList.remove('opacity-20', 'blur-sm');
            card.classList.add('scale-105'); // subtle pop
            setTimeout(() => card.classList.remove('scale-105'), 300);
        } else {
            card.classList.add('opacity-20', 'blur-sm');
        }
    });
}

// --- Modal Logic ---
const modal = document.getElementById('product-modal');
const modalPanel = document.getElementById('modal-panel');
const modalBackdrop = document.getElementById('modal-backdrop');

const els = {
    img: document.getElementById('modal-image'),
    flag: document.getElementById('modal-flag'),
    title: document.getElementById('modal-title'),
    origin: document.getElementById('modal-origin'),
    desc: document.getElementById('modal-description'),
    blendContainer: document.getElementById('blend-select-container'),
    blendSelect: document.getElementById('blend-select'),
    roastContainer: document.getElementById('roast-select-container'),
    priceDisplay: document.getElementById('modal-price-display'),
    roastSelect: document.getElementById('roast-select'),
    qtyInput: document.getElementById('qty-input'),
    qtyLabel: document.getElementById('qty-label')
};

function openModal(data) {
    currentProduct = data;
    currentQty = 1;

    els.img.src = data.image;
    els.flag.textContent = data.flag;
    els.title.textContent = data.name;
    els.origin.textContent = data.origin;
    els.desc.textContent = data.description;

    // Logic for Custom Blend vs Standard
    if (data.name === 'Custom Crank Blend') {
        els.blendContainer.classList.remove('hidden');
    } else {
        els.blendContainer.classList.add('hidden');
    }

    if (data.roast === 'Raw Green Bean') {
        els.qtyLabel.innerText = "Quantity (lbs)";
        els.roastContainer.classList.add('hidden');
    } else {
        els.qtyLabel.innerText = "Quantity (Bags)";
        els.roastContainer.classList.remove('hidden');
    }

    els.roastSelect.value = "Roaster's Choice";
    updateModalPrice();

    // Reset button
    const btn = document.getElementById('modal-add-btn');
    if (btn) {
        btn.innerText = "ADD TO LIST";
        btn.classList.remove('bg-white', 'text-coffee-900');
        btn.classList.add('bg-gold-500', 'text-coffee-900');
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modalBackdrop.classList.remove('opacity-0');
        modalPanel.classList.remove('opacity-0', 'scale-95');
        modalPanel.classList.add('opacity-100', 'scale-100');
    }, 10);
}

function closeModal() {
    modalBackdrop.classList.add('opacity-0');
    modalPanel.classList.remove('opacity-100', 'scale-100');
    modalPanel.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === modalBackdrop) {
            closeModal();
        }
    });
}

function adjustQty(change) {
    const newQty = currentQty + change;
    if (newQty >= 1) {
        currentQty = newQty;
        updateModalPrice();
    }
}

function updateModalPrice() {
    els.qtyInput.value = currentQty;
    const total = currentProduct.price * currentQty;
    els.priceDisplay.innerText = total;
}

// --- The "Roast List" (Brief) System ---

function addToBrief() {
    let selectedRoast = els.roastSelect.value;
    if (currentProduct.roast === 'Raw Green Bean') {
        selectedRoast = 'Raw Green Bean';
    }
    const totalItemPrice = currentProduct.price * currentQty;

    let selectedBlend = null;
    if (currentProduct.name === 'Custom Crank Blend') {
        selectedBlend = els.blendSelect.value;
    }

    const orderItem = {
        id: Date.now(),
        name: currentProduct.name,
        roast: selectedRoast,
        blend: selectedBlend,
        qty: currentQty,
        unit: currentProduct.roast === 'Raw Green Bean' ? 'lbs' : 'bags',
        unitPrice: currentProduct.price,
        totalPrice: totalItemPrice
    };

    roastBrief.push(orderItem);
    saveToStorage();
    updateBriefUI();

    // Visual Feedback
    const btn = document.getElementById('modal-add-btn');
    btn.innerText = "ADDED ✓";
    btn.classList.remove('bg-gold-500');
    btn.classList.add('bg-white', 'text-coffee-900');

    setTimeout(() => {
        closeModal();
    }, 600);
}

function removeFromBrief(id) {
    roastBrief = roastBrief.filter(item => item.id !== id);
    saveToStorage();
    renderCartItems();
    updateBriefUI();
}

function updateBriefUI() {
    const briefEl = document.getElementById('roast-brief');
    const countEl = document.getElementById('brief-count');

    const totalBags = roastBrief.reduce((acc, item) => acc + item.qty, 0);
    if (countEl) countEl.innerText = totalBags;

    // Sticky Bar Logic: Slide Up if items exist, Slide Down if empty
    if (briefEl) {
        if (roastBrief.length > 0) {
            briefEl.classList.remove('translate-y-full'); // Slide Up
        } else {
            briefEl.classList.add('translate-y-full'); // Slide Down
        }
    }
}

// --- Roast List (Cart) Modal ---

function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');

    renderCartItems();

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'scale-95');
        panel.classList.add('opacity-100', 'scale-100');
    }, 10);
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');

    backdrop.classList.add('opacity-0');
    panel.classList.remove('opacity-100', 'scale-100');
    panel.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('cart-total-display');

    container.innerHTML = '';
    let grandTotal = 0;

    if (roastBrief.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-4">Your list is empty.</p>';
    } else {
        roastBrief.forEach(item => {
            grandTotal += item.totalPrice;

            // Roast Options
            let roastOptionsHTML = '';
            if (item.roast !== 'Raw Green Bean') {
                const roasts = [
                    "Roaster's Choice",
                    "Light",
                    "Medium",
                    "Dark",
                    "Espresso"
                ];

                roastOptionsHTML = `
                    <select onchange="updateCartItem(${item.id}, 'roast', this.value)" 
                        class="bg-coffee-900/50 border border-white/10 text-gold-500 text-xs rounded px-2 py-1 mt-1 focus:outline-none focus:border-gold-500 block w-full max-w-[150px]">
                        ${roasts.map(r => `<option value="${r}" ${item.roast === r ? 'selected' : ''}>${r}</option>`).join('')}
                    </select>
                `;
            } else {
                roastOptionsHTML = `<p class="text-sm text-gold-500 mt-1">Raw Green Bean</p>`;
            }

            // Blend Options (Only for Custom Crank Blend)
            let blendOptionsHTML = '';
            if (item.name === 'Custom Crank Blend') {
                const blends = [
                    "1/3 Colombian - 1/3 Ethiopian - 1/3 Indian",
                    "1/4 Colombian - 1/4 Ethiopian - 1/2 Indian",
                    "1/4 Colombian - 1/2 Ethiopian - 1/4 Indian",
                    "1/2 Colombian - 1/2 Ethiopian",
                    "1/2 Colombian - 1/2 Indian",
                    "1/2 Ethiopian - 1/2 Indian"
                ];

                blendOptionsHTML = `
                    <select onchange="updateCartItem(${item.id}, 'blend', this.value)" 
                        class="bg-coffee-900/50 border border-white/10 text-gray-300 text-[10px] rounded px-2 py-1 mt-1 focus:outline-none focus:border-gold-500 block w-full max-w-[200px]">
                        ${blends.map(b => `<option value="${b}" ${item.blend === b ? 'selected' : ''}>${b}</option>`).join('')}
                    </select>
                `;
            } else if (item.blend) {
                blendOptionsHTML = `<p class="text-xs text-gray-300 mt-1">Blend: ${item.blend}</p>`;
            }

            const itemHTML = `
                <div class="bg-white/5 rounded p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-white/5 gap-4">
                    <div class="flex-1">
                        <h4 class="font-bold text-white">${item.name}</h4>
                        ${roastOptionsHTML}
                        ${blendOptionsHTML}
                    </div>
                    
                    <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div class="flex flex-col items-end">
                             <div class="flex items-center gap-2">
                                <button onclick="updateCartItem(${item.id}, 'qty', ${item.qty - 1})" 
                                    class="w-6 h-6 rounded-full border border-white/20 hover:border-gold-500 text-white flex items-center justify-center text-xs transition-colors">-</button>
                                <input type="number" value="${item.qty}" min="1" readonly 
                                    class="w-8 bg-transparent text-center text-white font-bold text-sm focus:outline-none">
                                <button onclick="updateCartItem(${item.id}, 'qty', ${item.qty + 1})" 
                                    class="w-6 h-6 rounded-full border border-white/20 hover:border-gold-500 text-white flex items-center justify-center text-xs transition-colors">+</button>
                            </div>
                            <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">${item.unit}</p>
                        </div>

                        <div class="text-right min-w-[60px]">
                            <div class="font-bold text-white mb-1">$${item.totalPrice}</div>
                            <button onclick="removeFromBrief(${item.id})" class="text-xs text-red-400 hover:text-red-300 underline">Remove</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += itemHTML;
        });
    }

    totalDisplay.innerText = '$' + grandTotal;
}

function updateCartItem(id, field, value) {
    const itemIndex = roastBrief.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    if (field === 'qty') {
        const newQty = parseInt(value);
        if (newQty < 1) return; // Prevent going below 1
        roastBrief[itemIndex].qty = newQty;
        roastBrief[itemIndex].totalPrice = roastBrief[itemIndex].unitPrice * newQty;
    } else if (field === 'roast') {
        roastBrief[itemIndex].roast = value;
    } else if (field === 'blend') {
        roastBrief[itemIndex].blend = value;
    }

    saveToStorage();
    renderCartItems();
    updateBriefUI();
}

// --- Simplified Email Logic (Conversational) ---

const emailModal = document.getElementById('email-options-modal');
const emailBackdrop = document.getElementById('email-backdrop');
const emailPanel = document.getElementById('email-panel');
const targetEmail = "crankcustomcoffee@gmail.com";

function getEmailContent() {
    const subject = "I'd like to order some coffee";
    let body = "Hi Crank Coffee,\n\n";
    let grandTotal = 0;

    if (roastBrief.length === 0) {
        body += "I have a question about your custom roasts...";
    } else {
        body += "I'd like to place an order for the following:\n\n";
        roastBrief.forEach((item) => {
            grandTotal += item.totalPrice;
            // Simple, clean bullet points
            body += `- ${item.qty} ${item.unit} of ${item.name} (${item.roast})\n`;
            if (item.blend) {
                body += `  (Blend: ${item.blend})\n`;
            }
        });
        body += `\nEstimated Total: $${grandTotal}`;
        body += "\n----------------\n";
        body += "Please let me know when this can be roasted and shipped.\n\nThanks!";
    }
    return { subject, body };
}

function openEmailModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal && !cartModal.classList.contains('hidden')) {
        closeCartModal();
        setTimeout(() => showEmailModalAnimation(), 300);
    } else {
        showEmailModalAnimation();
    }
}

function showEmailModalAnimation() {
    // Populate the Preview
    const { subject, body } = getEmailContent();
    document.getElementById('email-preview-subject').textContent = subject;
    document.getElementById('email-preview-body').textContent = body;

    emailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        emailBackdrop.classList.remove('opacity-0');
        emailPanel.classList.remove('opacity-0', 'scale-95');
        emailPanel.classList.add('opacity-100', 'scale-100');
    }, 10);
}

function closeEmailModal() {
    emailBackdrop.classList.add('opacity-0');
    emailPanel.classList.remove('opacity-100', 'scale-100');
    emailPanel.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        emailModal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

function sendDefault() {
    const { subject, body } = getEmailContent();
    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    closeEmailModal();
}

function sendGmail() {
    const { subject, body } = getEmailContent();
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
    closeEmailModal();
}

function sendOutlook() {
    const { subject, body } = getEmailContent();
    const url = `https://outlook.office.com/mail/deeplink/compose?to=${targetEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
    closeEmailModal();
}

function copyEmailText() {
    const { subject, body } = getEmailContent();
    const fullText = `Subject: ${subject}\n\n${body}`;

    navigator.clipboard.writeText(fullText).then(() => {
        const btn = document.getElementById('copy-text-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✓</span> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    }
});

// --- Custom Crank Blend Logic ---
let customQty = 1;
const customPricePerUnit = 80;

function adjustCustomQty(change) {
    const newQty = customQty + change;
    if (newQty >= 1) {
        customQty = newQty;
        document.getElementById('custom-qty-input').value = customQty;
        document.getElementById('custom-total-price').innerText = '$' + (customQty * customPricePerUnit);
    }
}

function addCustomBlendToBrief() {
    const blendSelect = document.getElementById('custom-blend-select');
    const roastSelect = document.getElementById('custom-roast-select');
    const selectedBlend = blendSelect.value;
    const selectedRoast = roastSelect.value;

    const orderItem = {
        id: Date.now(),
        name: 'Custom Crank Blend',
        roast: selectedRoast,
        blend: selectedBlend,
        qty: customQty,
        unit: '4-Bag Sets',
        unitPrice: customPricePerUnit,
        totalPrice: customQty * customPricePerUnit
    };

    roastBrief.push(orderItem);
    saveToStorage(); // Save to local storage
    updateBriefUI();

    const btn = document.getElementById('custom-add-btn');
    const originalText = btn.innerText;
    btn.innerText = "ADDED ✓";
    btn.classList.remove('bg-gold-500', 'text-coffee-900');
    btn.classList.add('bg-white', 'text-coffee-900');

    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('bg-white', 'text-coffee-900');
        btn.classList.add('bg-gold-500', 'text-coffee-900');
    }, 2000);
}

// --- Persistence (Local Storage) ---

function saveToStorage() {
    localStorage.setItem('crankRoastBrief', JSON.stringify(roastBrief));
}

function loadFromStorage() {
    const stored = localStorage.getItem('crankRoastBrief');
    if (stored) {
        try {
            roastBrief = JSON.parse(stored);
            updateBriefUI();
        } catch (e) {
            console.error("Failed to load roast brief", e);
            roastBrief = [];
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
});