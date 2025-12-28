/**
 * Crank Custom Coffee - Client Script
 */

// --- STATE ---
const state = {
    roastBrief: [],
    currentProduct: {},
    currentQty: 1,
    customBlendQty: 1, // For the homepage custom blend section
    customSelection: { // New state for custom builder
        blend: null,
        roast: 'Medium'
    }
};

// --- CUSTOM BLEND DATA ---
const customBlends = [
    { id: 'tri', name: 'The Tri-Blend', composition: '33% Colombia / 33% Ethiopia / 33% India', desc: 'Perfectly balanced complexity.' },
    { id: 'heavy', name: 'The Heavy Base', composition: '25% Colombia / 25% Ethiopia / 50% India', desc: 'Rich body with a spicy finish.' },
    { id: 'floral', name: 'The Floral Point', composition: '25% Colombia / 50% Ethiopia / 25% India', desc: 'Bright, floral aromatics.' },
    { id: 'americas', name: 'Americas & Africa', composition: '50% Colombia / 50% Ethiopia', desc: 'Sweet caramel meets bright berries.' },
    { id: 'spiced', name: 'Spiced Caramel', composition: '50% Colombia / 50% India', desc: 'Low acidity, deep sweetness.' },
    { id: 'earth', name: 'Floral Earth', composition: '50% Ethiopia / 50% India', desc: 'Unique tea-like body with spice.' }
];

// Initialize default blend
state.customSelection.blend = customBlends[0];

// --- PRODUCTS DATA ---
const roastedProducts = [
    {
        name: 'Full Crank Espresso',
        price: 25,
        origin: 'Blend (Colombia / Ethiopia / India)',
        roast: 'Dark',
        description: 'A bold espresso blend designed for rich crema and low acidity. Perfect for lattes or straight shots.',
        image: 'assets/images/Product_Images/Roasted_Bags/Full-Crank-Espresso-Blend.webp',
        flag: '🇨🇦',
        mood: 'dark',
        bags: 4
    },
    {
        name: 'Half Crank Espresso',
        price: 25,
        origin: 'Blend (Colombia / Brazil / Ethiopia / Indonesia)',
        roast: 'Medium-Dark',
        description: 'The best of both worlds. A 50/50 blend of our Full Crank Espresso and Swiss Water Decaf.',
        image: 'assets/images/Product_Images/Roasted_Bags/Half-Crank-Espresso-Blend.webp',
        flag: '🇨🇦',
        mood: 'balanced',
        bags: 4
    },
    {
        name: 'Colombia Excelso Organic',
        price: 25,
        origin: 'Colombia',
        roast: 'Medium',
        description: 'A classic Colombian coffee. Balanced acidity, sweet caramel notes, and a clean finish. Certified Organic.',
        image: 'assets/images/Product_Images/Roasted_Bags/Colombia-Excelso-Organic-Coffee.webp',
        flag: '🇨🇴',
        mood: 'balanced'
    },
    {
        name: 'Ethiopia Yergacheffe',
        price: 25,
        origin: 'Ethiopia',
        roast: 'Light-Medium',
        description: 'Renowned for its bright acidity and complex floral and berry notes. A tea-like body that is truly unique.',
        image: 'assets/images/Product_Images/Roasted_Bags/Ethiopia-Yergacheffe-Coffee.webp',
        flag: '🇪🇹',
        mood: 'bright'
    },
    {
        name: 'India Monsoon Malabar',
        price: 25,
        origin: 'India',
        roast: 'Dark',
        description: 'A unique coffee exposed to monsoon winds. Extremely low acidity with heavy body and spicy, earthy notes.',
        image: 'assets/images/Product_Images/Roasted_Bags/India-Monsoon-Malabar-Coffee.webp',
        flag: '🇮🇳',
        mood: 'dark'
    },
    {
        name: 'Swiss Water Decaf',
        price: 25,
        origin: 'Blend (Brazil / Ethiopia / Indonesia)',
        roast: 'Medium',
        description: 'Chemical-free decaffeination process that retains the full flavor of the bean. Smooth and clean.',
        image: 'assets/images/Product_Images/Roasted_Bags/Swiss-Water-Decaf-Coffee.webp',
        flag: '🇨🇦',
        mood: 'balanced'
    }
];

const greenBeanProducts = [
    {
        name: 'Green Colombia Excelso',
        price: 15,
        origin: 'Colombia',
        roast: 'Raw Green Bean',
        description: 'Raw green beans for home roasting. Balanced and sweet.',
        image: 'assets/images/Product_Images/Green_Beans/Colombia-Excelso.webp',
        flag: '🇨🇴'
    },
    {
        name: 'Green Ethiopia Yergacheffe',
        price: 15,
        origin: 'Ethiopia',
        roast: 'Raw Green Bean',
        description: 'Raw green beans for home roasting. Floral and bright.',
        image: 'assets/images/Product_Images/Green_Beans/Ethiopia-Yirgacheffe.webp',
        flag: '🇪🇹'
    },
    {
        name: 'Green India Monsoon',
        price: 15,
        origin: 'India',
        roast: 'Raw Green Bean',
        description: 'Raw green beans for home roasting. Spicy and earthy.',
        image: 'assets/images/Product_Images/Green_Beans/Indian-Malabar.webp',
        flag: '🇮🇳'
    },
    {
        name: 'Green Swiss Water Decaf',
        price: 15,
        origin: 'Brazil, Ethiopia, Indonesia',
        roast: 'Raw Green Bean',
        description: 'Raw green beans for home roasting. Chemical-free decaf.',
        image: 'assets/images/Product_Images/Green_Beans/Swiss-Water-Decaf.webp',
        flag: '🇨🇦'
    }
];

// --- UI HELPERS ---
const els = {
    get img() { return document.getElementById('modal-image'); },
    get title() { return document.getElementById('modal-title'); },
    get origin() { return document.getElementById('modal-origin'); },
    get desc() { return document.getElementById('modal-description'); },
    get blendContainer() { return document.getElementById('blend-select-container'); },
    get blendSelect() { return document.getElementById('blend-select'); },
    get roastContainer() { return document.getElementById('roast-select-container'); },
    get priceDisplay() { return document.getElementById('modal-price-display'); },
    get roastSelect() { return document.getElementById('roast-select'); },
    get qtyInput() { return document.getElementById('qty-input'); },
    get qtyLabel() { return document.getElementById('qty-label'); }
};

function initUI() {
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

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        const navContainer = document.getElementById('navbar-container');
        const logo = document.getElementById('nav-logo');

        if (nav && logo && navContainer) {
            if (window.scrollY > 50) {
                // Scrolled down state
                nav.classList.remove('bg-transparent');
                nav.classList.add('bg-coffee-900/90', 'backdrop-blur-md', 'border-b', 'border-white/5', 'shadow-lg');

                navContainer.classList.remove('h-28');
                navContainer.classList.add('h-16');

                logo.classList.remove('h-24');
                logo.classList.add('h-12');
            } else {
                // Top state
                nav.classList.add('bg-transparent');
                nav.classList.remove('bg-coffee-900/90', 'backdrop-blur-md', 'border-b', 'border-white/5', 'shadow-lg');

                navContainer.classList.remove('h-16');
                navContainer.classList.add('h-28');

                logo.classList.remove('h-12');
                logo.classList.add('h-24');
            }
        }
    });
}

function highlightRoast(mood) {
    // Legacy support to prevent errors if invoked
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        if (mood === 'all') {
            card.classList.remove('opacity-20', 'blur-sm');
            return;
        }
        const cardMood = card.getAttribute('data-mood');
        if (cardMood === mood) {
            card.classList.remove('opacity-20', 'blur-sm');
        } else {
            card.classList.add('opacity-20', 'blur-sm');
        }
    });
}

// --- RENDER LOGIC: ROASTING LOG STYLE WITH IMAGES ---
function renderRoastedMenu() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // We render a list of "Log Entries" with images attached
    grid.innerHTML = roastedProducts.map((product, index) => {
        // Prepare roast options (defaulting to the recommended one)
        const roastOptions = ["Light", "Medium", "Medium/Dark", "Dark", "Roaster's Choice"];
        const recommendedRoast = product.roast.includes('Dark') ? 'Dark' :
            product.roast.includes('Light') ? 'Light' :
                product.roast.includes('Medium') ? 'Medium' : "Roaster's Choice";

        return `
        <div class="relative group border-b border-white/10 pb-12 mb-4 last:border-0">
            <div class="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                
                <div class="w-full md:w-48 lg:w-56 flex-shrink-0 relative">
                    <div class="absolute -inset-2 bg-white/5 rounded-sm transform -rotate-2"></div>
                    <img src="${product.image}" alt="${product.name}" 
                         class="relative w-full h-64 md:h-auto object-cover rounded-sm shadow-xl grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 border border-white/10">
                </div>

                <div class="flex-1 w-full">
                    <div class="flex flex-row justify-between items-start gap-4 mb-4">
                        <div>
                            <span class="text-gold-500 text-[10px] font-bold font-mono tracking-widest uppercase mb-1 block">Log No. 00${index + 1}</span>
                            <h4 class="font-display font-bold text-xl md:text-3xl text-white tracking-wide group-hover:text-gold-500 transition-colors">
                                ${product.name.toUpperCase()}
                            </h4>
                            <div class="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
                                Origin: <span class="text-gray-300">${product.origin}</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-display font-bold text-2xl text-gold-500 whitespace-nowrap">
                                $${product.price * (product.bags || 2)} <span class="text-sm text-gray-500 font-sans font-normal">CAD</span>
                            </div>
                            <div class="text-[10px] text-gray-400 uppercase tracking-widest">Per ${product.bags || 2}-Bag Set</div>
                        </div>
                    </div>

                    <p class="text-gray-300 font-serif italic text-lg leading-relaxed opacity-90 mb-6 max-w-2xl">
                        "${product.description}"
                    </p>

                    <div class="flex flex-col sm:flex-row items-end sm:items-center gap-4 bg-white/5 p-4 rounded-sm border border-white/5">
                        
                        <div class="w-full sm:w-auto flex-1">
                            <label class="block text-[10px] text-gray-500 uppercase font-bold mb-1">Requested Roast Profile</label>
                            <select id="roast-select-${index}" class="w-full bg-transparent text-white font-bold text-sm border-b border-white/20 focus:border-gold-500 focus:outline-none pb-1 cursor-pointer hover:text-gold-500 transition-colors">
                                ${roastOptions.map(r => `<option value="${r}" ${r === recommendedRoast ? 'selected' : ''}>${r}</option>`).join('')}
                            </select>
                        </div>

                        <div class="h-8 w-px bg-white/10 hidden sm:block"></div>

                        <div class="flex items-center gap-3">
                            <div class="flex flex-col items-center">
                                <label class="text-[10px] text-gray-500 uppercase font-bold mb-1">Sets (${product.bags || 2} Bags)</label>
                                <div class="flex items-center border border-white/20 rounded-sm bg-coffee-900/50">
                                    <button onclick="window.adjustMenuQty(${index}, -1)" 
                                        class="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-gold-500 text-lg font-bold transition-colors">-</button>
                                    <input id="qty-input-${index}" type="number" value="1" readonly 
                                        class="w-8 bg-transparent text-center text-white font-bold focus:outline-none text-sm">
                                    <button onclick="window.adjustMenuQty(${index}, 1)" 
                                        class="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-gold-500 text-lg font-bold transition-colors">+</button>
                                </div>
                            </div>

                            <button id="add-btn-${index}" onclick="window.quickAdd(${index})" 
                                class="bg-gold-500 hover:bg-white text-coffee-900 font-bold px-6 py-3 rounded-sm uppercase tracking-widest text-xs transition-all shadow-lg whitespace-nowrap h-full self-end">
                                Add to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function adjustMenuQty(index, change) {
    const input = document.getElementById(`qty-input-${index}`);
    if (!input) return;
    let newVal = parseInt(input.value) + change;
    if (newVal < 1) newVal = 1;
    input.value = newVal;
}

// --- QUICK ADD FUNCTION ---
function quickAdd(index) {
    const product = roastedProducts[index];
    // Get the specific roast selected for this item
    const roastSelect = document.getElementById(`roast-select-${index}`);
    const selectedRoast = roastSelect ? roastSelect.value : "Roaster's Choice";

    const qtyInput = document.getElementById(`qty-input-${index}`);
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;

    // Price is per set
    const bags = product.bags || 2;
    const setPrice = product.price * bags;

    const requestItem = {
        id: Date.now(),
        name: product.name,
        roast: selectedRoast,
        qty: qty,
        unit: `sets (${bags} bags)`,
        unitPrice: setPrice,
        totalPrice: setPrice * qty,
        image: product.image
    };

    state.roastBrief.push(requestItem);
    saveToStorage();
    updateBriefUI();

    // Visual Feedback
    const btn = document.getElementById(`add-btn-${index}`);
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "ADDED ✓";
        btn.classList.remove('bg-gold-500', 'text-coffee-900');
        btn.classList.add('bg-white', 'text-coffee-900');

        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.add('bg-gold-500', 'text-coffee-900');
            btn.classList.remove('bg-white', 'text-coffee-900');
        }, 1500);
    }
}

window.adjustMenuQty = adjustMenuQty;

function renderGreenBeansMenu() {
    const grid = document.getElementById('green-beans-grid');
    if (!grid) return;

    grid.innerHTML = greenBeanProducts.map((product, index) => {
        return `
        <div class="relative group border-b border-white/10 pb-12 mb-4 last:border-0">
            <div class="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                
                <div class="w-full md:w-48 lg:w-56 flex-shrink-0 relative">
                    <div class="absolute -inset-2 bg-white/5 rounded-sm transform -rotate-2"></div>
                    <img src="${product.image}" alt="${product.name}" 
                         class="relative w-full h-64 md:h-auto object-cover rounded-sm shadow-xl grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 border border-white/10">
                </div>

                <div class="flex-1 w-full">
                    <div class="flex flex-row justify-between items-start gap-4 mb-4">
                        <div>
                            <h4 class="font-display font-bold text-xl md:text-3xl text-white tracking-wide group-hover:text-gold-500 transition-colors">
                                ${product.name.replace('Green ', '').toUpperCase()}
                            </h4>
                            <div class="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
                                Origin: <span class="text-gray-300">${product.origin}</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-display font-bold text-2xl text-gold-500 whitespace-nowrap">
                                $${product.price} <span class="text-sm text-gray-500 font-sans font-normal">CAD</span>
                            </div>
                            <div class="text-[10px] text-gray-400 uppercase tracking-widest">Per Pound (lb)</div>
                        </div>
                    </div>

                    <p class="text-gray-300 font-serif italic text-lg leading-relaxed opacity-90 mb-6 max-w-2xl">
                        "${product.description}"
                    </p>

                    <div class="flex flex-col sm:flex-row items-end sm:items-center gap-4 bg-white/5 p-4 rounded-sm border border-white/5">
                        
                        <div class="flex-1">
                            <span class="text-gold-500 font-bold text-sm uppercase tracking-wider">Raw Green Bean</span>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="flex flex-col items-center">
                                <label class="text-[10px] text-gray-500 uppercase font-bold mb-1">Quantity (lbs)</label>
                                <div class="flex items-center border border-white/20 rounded-sm bg-coffee-900/50">
                                    <button onclick="window.adjustGreenQty(${index}, -1)" 
                                        class="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-gold-500 text-lg font-bold transition-colors">-</button>
                                    <input id="green-qty-input-${index}" type="number" value="1" readonly 
                                        class="w-8 bg-transparent text-center text-white font-bold focus:outline-none text-sm">
                                    <button onclick="window.adjustGreenQty(${index}, 1)" 
                                        class="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-gold-500 text-lg font-bold transition-colors">+</button>
                                </div>
                            </div>

                            <button id="green-add-btn-${index}" onclick="window.quickAddGreen(${index})" 
                                class="bg-gold-500 hover:bg-white text-coffee-900 font-bold px-6 py-3 rounded-sm uppercase tracking-widest text-xs transition-all shadow-lg whitespace-nowrap h-full self-end">
                                Add to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function adjustGreenQty(index, change) {
    const input = document.getElementById(`green-qty-input-${index}`);
    if (!input) return;
    let newVal = parseInt(input.value) + change;
    if (newVal < 1) newVal = 1;
    input.value = newVal;
}

function quickAddGreen(index) {
    const product = greenBeanProducts[index];
    const qtyInput = document.getElementById(`green-qty-input-${index}`);
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;

    const requestItem = {
        id: Date.now(),
        name: product.name,
        roast: 'Raw Green Bean',
        qty: qty,
        unit: 'lbs',
        unitPrice: product.price,
        totalPrice: product.price * qty,
        image: product.image
    };

    state.roastBrief.push(requestItem);
    saveToStorage();
    updateBriefUI();

    // Visual Feedback
    const btn = document.getElementById(`green-add-btn-${index}`);
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "ADDED ✓";
        btn.classList.remove('bg-gold-500', 'text-coffee-900');
        btn.classList.add('bg-white', 'text-coffee-900');

        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.add('bg-gold-500', 'text-coffee-900');
            btn.classList.remove('bg-white', 'text-coffee-900');
        }, 1500);
    }
}

window.adjustGreenQty = adjustGreenQty;
window.quickAddGreen = quickAddGreen;


function renderCustomBuilder() {
    const container = document.getElementById('custom-builder-container');
    if (!container) return;

    // 1. Render Blend Options as a simple Dropdown
    const blendOptions = customBlends.map(blend => {
        const isSelected = state.customSelection.blend.id === blend.id;
        // We include the composition in the option text for clarity
        return `<option value="${blend.id}" ${isSelected ? 'selected' : ''} class="bg-coffee-900 text-white">
            ${blend.name} — ${blend.composition}
        </option>`;
    }).join('');

    // 2. Render Roast Options as a simple Dropdown
    const roasts = ['Light', 'Medium', 'Medium/Dark', 'Dark', "Roaster's Choice"];
    const roastOptions = roasts.map(r =>
        `<option value="${r}" ${state.customSelection.roast === r ? 'selected' : ''} class="bg-coffee-900 text-white">${r}</option>`
    ).join('');

    // Get current blend description to show below the dropdown
    const currentBlend = state.customSelection.blend;

    container.innerHTML = `
        <div class="max-w-xl mx-auto">
            <div class="space-y-8">
                
                <div>
                    <label class="block text-gold-500 font-bold mb-2 uppercase tracking-wider text-xs">1. Choose Blend Base</label>
                    <select onchange="selectCustomBlend(this.value)" 
                        class="w-full bg-transparent border-b border-white/20 py-3 text-white font-sans text-lg focus:border-gold-500 focus:outline-none rounded-none cursor-pointer hover:border-white transition-colors">
                        ${blendOptions}
                    </select>
                    <p class="text-gray-500 text-sm italic mt-2">${currentBlend.desc}</p>
                </div>

                <div>
                    <label class="block text-gold-500 font-bold mb-2 uppercase tracking-wider text-xs">2. Roast Profile</label>
                    <select onchange="selectCustomRoast(this.value)" 
                        class="w-full bg-transparent border-b border-white/20 py-3 text-white font-sans text-lg focus:border-gold-500 focus:outline-none rounded-none cursor-pointer hover:border-white transition-colors">
                        ${roastOptions}
                    </select>
                </div>

                <div>
                    <label class="block text-gold-500 font-bold mb-2 uppercase tracking-wider text-xs">3. Batch Size</label>
                    <div class="flex items-center justify-between border-b border-white/20 py-3 text-lg">
                        <span class="text-gray-400 font-sans">4 Bags</span>
                        
                        <div class="flex items-center gap-6">
                            <div class="flex items-center bg-white/5 rounded-sm px-1">
                                <button onclick="adjustCustomQty(-1)" class="w-8 h-8 flex items-center justify-center text-gold-500 hover:text-white font-bold">-</button>
                                <span class="w-8 text-center text-white font-mono font-bold">${state.customBlendQty}</span>
                                <button onclick="adjustCustomQty(1)" class="w-8 h-8 flex items-center justify-center text-gold-500 hover:text-white font-bold">+</button>
                            </div>
                            
                            <span class="font-bold text-gold-500">$${100 * state.customBlendQty}</span>
                        </div>
                    </div>
                </div>

                <div class="pt-6">
                    <button id="custom-add-btn" onclick="addCustomBlendToBrief()" 
                        class="w-full bg-gold-500 hover:bg-white text-coffee-900 font-bold py-4 rounded-sm uppercase tracking-widest transition-colors shadow-lg">
                        Add to Roast List
                    </button>
                </div>

            </div>
        </div>
    `;
}

// Helper functions for selection
window.selectCustomBlend = (id) => {
    state.customSelection.blend = customBlends.find(b => b.id === id);
    renderCustomBuilder();
};

window.selectCustomRoast = (roast) => {
    state.customSelection.roast = roast;
    renderCustomBuilder();
};

// Override the existing adjustCustomQty to re-render the builder
window.adjustCustomQty = (change) => {
    let newVal = state.customBlendQty + change;
    if (newVal < 1) newVal = 1;
    state.customBlendQty = newVal;
    renderCustomBuilder();
};

// Override the add function to use new state
window.addCustomBlendToBrief = () => {
    const requestItem = {
        id: Date.now(),
        name: 'Custom: ' + state.customSelection.blend.name,
        roast: state.customSelection.roast,
        blend: state.customSelection.blend.composition,
        qty: state.customBlendQty,
        unit: 'sets (4 bags)',
        unitPrice: 100,
        totalPrice: 100 * state.customBlendQty,
        image: 'assets/images/Product_Images/Roasted_Bags/Custom-Crank-Coffee-Blend.webp'
    };

    state.roastBrief.push(requestItem);
    saveToStorage();
    updateBriefUI();

    // Button Feedback
    const btn = document.getElementById('custom-add-btn');
    if (btn) {
        btn.innerText = "ADDED ✓";
        btn.classList.replace('bg-gold-500', 'bg-white');
        setTimeout(() => {
            btn.innerText = "ADD TO ROAST LIST";
            btn.classList.replace('bg-white', 'bg-gold-500');
        }, 2000);
    }
};

// Initialize the builder on load
document.addEventListener('DOMContentLoaded', () => {
    renderCustomBuilder();
});

// --- MODAL ---
const modal = document.getElementById('product-modal');
const modalPanel = document.getElementById('modal-panel');
const modalBackdrop = document.getElementById('modal-backdrop');

function openModal(data) {
    state.currentProduct = data;
    state.currentQty = 1;

    els.img.src = data.image;
    els.title.textContent = data.name;
    els.origin.textContent = data.origin;
    els.desc.textContent = data.description;

    els.blendContainer.classList.add('hidden'); // Only for custom blend section

    if (data.roast === 'Raw Green Bean') {
        els.qtyLabel.innerText = "Quantity (lbs)";
        els.roastContainer.classList.add('hidden');
    } else {
        els.qtyLabel.innerText = "Quantity (Bags)";
        els.roastContainer.classList.remove('hidden');
    }

    els.roastSelect.value = "Roaster's Choice";
    updateModalPrice();

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

function adjustQty(change) {
    const newQty = state.currentQty + change;
    if (newQty >= 1) {
        state.currentQty = newQty;
        updateModalPrice();
    }
}

function updateModalPrice() {
    els.qtyInput.value = state.currentQty;
    const total = state.currentProduct.price * state.currentQty;
    els.priceDisplay.innerText = total + ' CAD';
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === modalBackdrop) closeModal();
    });
}

// --- CART LOGIC ---
function addToBrief() {
    // This is called from the Green Bean modal (which still uses it)
    let selectedRoast = els.roastSelect.value;
    if (state.currentProduct.roast === 'Raw Green Bean') {
        selectedRoast = 'Raw Green Bean';
    }
    const totalItemPrice = state.currentProduct.price * state.currentQty;

    const requestItem = {
        id: Date.now(),
        name: state.currentProduct.name,
        roast: selectedRoast,
        qty: state.currentQty,
        unit: state.currentProduct.roast === 'Raw Green Bean' ? 'lbs' : 'bags',
        unitPrice: state.currentProduct.price,
        totalPrice: totalItemPrice,
        image: state.currentProduct.image
    };

    state.roastBrief.push(requestItem);
    saveToStorage();
    updateBriefUI();

    const btn = document.getElementById('modal-add-btn');
    btn.innerText = "ADDED TO LIST ✓";
    btn.classList.remove('bg-gold-500');
    btn.classList.add('bg-white', 'text-coffee-900');

    setTimeout(() => closeModal(), 600);
}

function removeFromBrief(id) {
    state.roastBrief = state.roastBrief.filter(item => item.id !== id);
    saveToStorage();
    renderCartItems();
    updateBriefUI();
}

function updateBriefUI() {
    const fab = document.getElementById('cart-fab');
    const fabCount = document.getElementById('fab-count');
    const totalBags = state.roastBrief.reduce((acc, item) => acc + item.qty, 0);

    if (fabCount) fabCount.innerText = totalBags;

    if (fab) {
        if (state.roastBrief.length > 0) {
            fab.classList.remove('translate-y-32');
        } else {
            fab.classList.add('translate-y-32');
        }
    }

    // Update Review Prompt Section Visibility
    const reviewPrompt = document.getElementById('review-prompt');
    if (reviewPrompt) {
        if (state.roastBrief.length > 0) {
            reviewPrompt.classList.remove('hidden');
        } else {
            reviewPrompt.classList.add('hidden');
        }
    }
}

function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');

    // Reset to first step
    showRoastList();

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

    if (state.roastBrief.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-50">
                <div class="w-20 h-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <p class="text-gray-500 text-lg font-serif italic">Your roast list is empty.</p>
                <button onclick="closeCartModal()" class="text-gold-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors">
                    Browse the Menu
                </button>
            </div>
        `;
    } else {
        state.roastBrief.forEach(item => {
            grandTotal += item.totalPrice;

            let detailsHTML = '';
            if (item.name === 'Custom Crank Blend') {
                detailsHTML = `
                    <div class="mt-2 space-y-1">
                        <p class="text-[10px] text-gray-400 uppercase tracking-wider">Blend</p>
                        <p class="text-xs text-white font-medium">${item.blend}</p>
                        <p class="text-[10px] text-gray-400 uppercase tracking-wider mt-2">Roast</p>
                        <p class="text-xs text-gold-500 font-bold">${item.roast}</p>
                    </div>
                 `;
            } else if (item.roast !== 'Raw Green Bean') {
                const roasts = ["Light", "Medium", "Medium/Dark", "Dark", "Roaster's Choice"];
                detailsHTML = `
                    <div class="mt-2">
                        <label class="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Roast Profile</label>
                        <select onchange="window.updateCartItem(${item.id}, 'roast', this.value)" 
                            class="bg-transparent border-b border-white/20 text-gold-500 text-sm py-1 focus:outline-none focus:border-gold-500 block w-full cursor-pointer hover:text-white transition-colors">
                            ${roasts.map(r => `<option value="${r}" ${item.roast === r ? 'selected' : ''}>${r}</option>`).join('')}
                        </select>
                    </div>
                 `;
            } else {
                detailsHTML = `<p class="text-xs text-gold-500 mt-2 font-bold uppercase tracking-wider">Raw Green Bean</p>`;
            }

            container.innerHTML += `
                <div class="group relative bg-white/5 rounded-sm p-4 mb-3 border border-white/5 flex gap-4 items-start">
                    
                    <!-- Image -->
                    <div class="w-20 h-24 flex-shrink-0 bg-black/20 rounded-sm overflow-hidden">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover opacity-80">
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                            <h4 class="font-display font-bold text-lg text-white leading-tight pr-6">${item.name}</h4>
                            <button onclick="window.removeFromBrief(${item.id})" class="text-gray-500 hover:text-red-400 -mt-1 -mr-1 p-2">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        ${detailsHTML}

                        <div class="flex justify-between items-end mt-3 pt-3 border-t border-white/5">
                            <div class="text-xs text-gray-400 font-mono">
                                ${item.qty} ${item.unit} @ $${item.unitPrice}
                            </div>
                            <div class="font-bold text-gold-500 text-lg">
                                $${item.totalPrice}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    totalDisplay.innerText = '$' + grandTotal + ' CAD';
}

function updateCartItem(id, field, value) {
    const itemIndex = state.roastBrief.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    if (field === 'qty') {
        const newQty = parseInt(value);
        if (newQty < 1) return;
        state.roastBrief[itemIndex].qty = newQty;
        state.roastBrief[itemIndex].totalPrice = state.roastBrief[itemIndex].unitPrice * newQty;
    } else if (field === 'roast') {
        state.roastBrief[itemIndex].roast = value;
    }

    saveToStorage();
    renderCartItems();
    updateBriefUI();
}

function saveToStorage() { localStorage.setItem('crankRoastBrief', JSON.stringify(state.roastBrief)); }
function loadFromStorage() {
    const stored = localStorage.getItem('crankRoastBrief');
    if (stored) {
        try {
            state.roastBrief = JSON.parse(stored);
            updateBriefUI();
        } catch (e) { console.error(e); state.roastBrief = []; }
    }
}

// --- EMAIL ---
const emailModal = document.getElementById('email-options-modal');
const emailBackdrop = document.getElementById('email-backdrop');
const emailPanel = document.getElementById('email-panel');
const targetEmail = "crankcustomcoffee@gmail.com";

function getEmailContent() {
    const clientName = document.getElementById('client-name').value.trim() || "Client";
    const clientPhone = document.getElementById('client-phone').value.trim() || "Not provided";

    // Shipping Details
    const address = document.getElementById('client-address').value.trim() || "";
    const city = document.getElementById('client-city').value.trim() || "";
    const province = document.getElementById('client-province').value.trim() || "";
    const country = document.getElementById('client-country').value.trim() || "";
    const postal = document.getElementById('client-postal').value.trim() || "";

    const fullAddress = [address, city, province, country, postal].filter(Boolean).join(', ');

    const subject = `Roast Request - ${clientName}`;
    let body = `Hi Mark,\n\nI'd like to request a roast:\n\n`;

    body += `My Details:\n`;
    body += `Name: ${clientName}\n`;
    body += `Phone: ${clientPhone}\n`;
    if (fullAddress) {
        body += `Shipping Address: ${fullAddress}\n`;
    }
    body += `\n`;

    body += `My List:\n`;
    body += `----------------------------------------\n`;

    let grandTotal = 0;
    state.roastBrief.forEach((item) => {
        grandTotal += item.totalPrice;
        body += `[${item.qty}x] ${item.name}\n`;
        body += `      Roast: ${item.roast}\n`;
        if (item.blend) body += `      Blend: ${item.blend}\n`;
        body += `      Price: $${item.totalPrice}\n`;
        body += `----------------------------------------\n`;
    });
    body += `\nSubtotal: $${grandTotal}\n(Shipping & taxes to be calculated)\n\nPlease confirm my request and let me know the next steps.\n\nThanks!`;
    return { subject, body };
}

function openEmailModal() {
    if (!document.getElementById('cart-modal').classList.contains('hidden')) closeCartModal();
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
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    closeEmailModal();
}

function sendOutlook() {
    const { subject, body } = getEmailContent();
    window.open(`https://outlook.office.com/mail/deeplink/compose?to=${targetEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    closeEmailModal();
}

function copyEmailText() {
    const { subject, body } = getEmailContent();
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`).then(() => {
        const btn = document.getElementById('copy-text-btn');
        const old = btn.innerHTML;
        btn.innerHTML = '<span>✓</span> Copied!';
        setTimeout(() => btn.innerHTML = old, 2000);
    });
}

function openConciergeHandoff() {
    if (state.roastBrief.length === 0) {
        alert("Your roast list is empty!");
        return;
    }

    const nameInput = document.getElementById('client-name');
    const phoneInput = document.getElementById('client-phone');

    if (!nameInput.value.trim()) {
        alert("Please enter your name so we know who this request is for.");
        nameInput.focus();
        nameInput.classList.add('border-red-500');
        setTimeout(() => nameInput.classList.remove('border-red-500'), 2000);
        return;
    }

    state.clientName = nameInput.value.trim();
    state.clientPhone = phoneInput.value.trim();

    openEmailModal();
}

// --- EXPORTS & INIT ---
window.highlightRoast = highlightRoast;
window.openModal = openModal;
window.closeModal = closeModal;
window.adjustQty = adjustQty;
window.addToBrief = addToBrief;
window.removeFromBrief = removeFromBrief;
window.updateCartItem = updateCartItem;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.openEmailModal = openEmailModal;
window.closeEmailModal = closeEmailModal;
window.sendDefault = sendDefault;
window.sendGmail = sendGmail;
window.sendOutlook = sendOutlook;
window.copyEmailText = copyEmailText;
window.openConciergeHandoff = openConciergeHandoff;
window.adjustCustomQty = adjustCustomQty;
window.addCustomBlendToBrief = addCustomBlendToBrief;
window.quickAdd = quickAdd;

function showClientDetails() {
    if (state.roastBrief.length === 0) {
        alert("Your roast list is empty!");
        return;
    }
    document.getElementById('roast-list-step').classList.add('hidden');
    document.getElementById('client-details-step').classList.remove('hidden');
    document.getElementById('client-details-step').classList.add('flex');
}

function showRoastList() {
    document.getElementById('client-details-step').classList.add('hidden');
    document.getElementById('client-details-step').classList.remove('flex');
    document.getElementById('roast-list-step').classList.remove('hidden');
}

window.showClientDetails = showClientDetails;
window.showRoastList = showRoastList;

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    loadFromStorage();
    renderRoastedMenu();
    renderGreenBeansMenu();
});