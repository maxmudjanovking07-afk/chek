// Mock Data for Products
const products = [
    {
        id: 1,
        title: "Apple iPhone 15 Pro Max 256GB, Tabiiy Titan",
        price: "16 500 000 so'm",
        installment: "1 964 000 so'm/oyiga",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Noutbuk Apple MacBook Air 13 M1, 8/256GB, Space Gray",
        price: "11 200 000 so'm",
        installment: "1 333 000 so'm/oyiga",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Quloqchinlar Apple AirPods Pro 2 (Type-C)",
        price: "2 850 000 so'm",
        installment: "339 000 so'm/oyiga",
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Aqlli soat Apple Watch Series 9, 45mm, Midnight",
        price: "5 400 000 so'm",
        installment: "642 000 so'm/oyiga",
        image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Simsiz sichqoncha Logitech MX Master 3S",
        price: "1 350 000 so'm",
        installment: "160 000 so'm/oyiga",
        image: "https://images.unsplash.com/photo-1527814050087-151f0cefa076?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Mexanik klaviatura Keychron K2 V2",
        price: "1 100 000 so'm",
        installment: "130 000 so'm/oyiga",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=500&auto=format&fit=crop"
    }
];

let stream = null;
let currentFoundProduct = null;
let currentQuantity = 1;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cameraBtn = document.getElementById('cameraBtn');
const cameraModal = document.getElementById('cameraModal');
const closeCameraBtn = document.getElementById('closeCameraBtn');
const videoElement = document.getElementById('videoElement');
const captureBtn = document.getElementById('captureBtn');
const captureLoading = document.getElementById('captureLoading');
const productModal = document.getElementById('productModal');
const closeProductModalBtn = document.getElementById('closeProductModalBtn');
const foundProductDetails = document.getElementById('foundProductDetails');
const addToCartBtn = document.getElementById('addToCartBtn');

// Render Products
function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <span class="product-installment">${product.installment}</span>
            <div class="product-price">${product.price}</div>
            <button class="btn btn-primary" style="margin-top: auto;">Savatchaga</button>
        `;
        productGrid.appendChild(card);
    });
}

// Camera Functions
async function openCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        videoElement.srcObject = stream;
        cameraModal.classList.add('active');
    } catch (err) {
        alert("Kameraga kirish imkoni bo'lmadi: " + err.message);
    }
}

function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    cameraModal.classList.remove('active');
    captureLoading.classList.add('hidden');
}

// Simulate Image Capture and AI Search
function captureAndSearch() {
    captureLoading.classList.remove('hidden');
    
    // Simulate AI processing time (2 seconds)
    setTimeout(() => {
        closeCamera();
        
        // Randomly select a product from our database to simulate "Visual Search"
        const randomIndex = Math.floor(Math.random() * products.length);
        currentFoundProduct = products[randomIndex];
        currentQuantity = 1;
        
        showFoundProduct();
    }, 2000);
}

// Show Found Product
function showFoundProduct() {
    renderFoundProductContent();
    productModal.classList.add('active');
}

function renderFoundProductContent() {
    if (!currentFoundProduct) return;
    
    foundProductDetails.innerHTML = `
        <img src="${currentFoundProduct.image}" alt="${currentFoundProduct.title}">
        <h4 class="found-product-title">${currentFoundProduct.title}</h4>
        <div class="found-product-price">${currentFoundProduct.price}</div>
        <p style="color: var(--text-muted); margin-bottom: 12px;">Soni (Miqdori):</p>
        <div class="quantity-control">
            <button class="qty-btn" id="decreaseQty">-</button>
            <span class="qty-value" id="qtyValue">${currentQuantity}</span>
            <button class="qty-btn" id="increaseQty">+</button>
        </div>
    `;

    // Attach quantity event listeners
    document.getElementById('decreaseQty').addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            document.getElementById('qtyValue').textContent = currentQuantity;
        }
    });

    document.getElementById('increaseQty').addEventListener('click', () => {
        currentQuantity++;
        document.getElementById('qtyValue').textContent = currentQuantity;
    });
}

function closeProductModal() {
    productModal.classList.remove('active');
}

// Event Listeners
cameraBtn.addEventListener('click', openCamera);
closeCameraBtn.addEventListener('click', closeCamera);
captureBtn.addEventListener('click', captureAndSearch);
closeProductModalBtn.addEventListener('click', closeProductModal);

addToCartBtn.addEventListener('click', () => {
    alert(`${currentQuantity} ta "${currentFoundProduct.title}" savatchaga qo'shildi!`);
    closeProductModal();
});

// Initial Render
renderProducts();
