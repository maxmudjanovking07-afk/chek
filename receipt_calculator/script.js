document.addEventListener('DOMContentLoaded', () => {
    // Login form elements
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const loginError = document.getElementById('login-error');
    const loginOverlay = document.getElementById('login-overlay');
    const appContainer = document.getElementById('app-container');

    // Foydalanuvchilar va ularning parollari (5 kishilik)
    const users = {
        'admin': 'artfloor',
        'kassir1': 'artfloor',
        'kassir2': 'artfloor',
        'kassir3': 'artfloor',
        'kassir4': 'artfloor'
    };

    // Handle login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value.trim();
        
        if (users[username] && users[username] === password) {
            // Password is correct
            loginOverlay.style.display = 'none';
            appContainer.style.display = 'flex';
        } else {
            // Incorrect password
            loginError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    const form = document.getElementById('product-form');
    const receiptBody = document.getElementById('receipt-body');
    const totalSellEl = document.getElementById('total-sell');
    const receiptDateEl = document.getElementById('receipt-date');
    const printBtn = document.getElementById('print-btn');
    const clearBtn = document.getElementById('clear-btn');

    let products = [];

    // Sana va vaqtni o'rnatish
    const updateDate = () => {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        receiptDateEl.textContent = `${dd}.${mm}.${yyyy} ${hh}:${min}`;
    };
    updateDate();
    setInterval(updateDate, 60000);

    // Pulni formatlash (10000 -> 10 000 so'm)
    const formatMoney = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
    };

    const updateReceipt = () => {
        try {
            receiptBody.innerHTML = '';
            let totalSell = 0;

            if (products.length === 0) {
                receiptBody.innerHTML = `
                    <tr class="empty-state">
                        <td colspan="4" style="text-align: center; color: #999;">Hali mahsulot qo'shilmadi</td>
                    </tr>
                `;
                totalSellEl.textContent = "0 so'm";
                return;
            }

            products.forEach((product) => {
                const tr = document.createElement('tr');
                
                const nameTd = document.createElement('td');
                nameTd.textContent = product.name;
                
                const qtyTd = document.createElement('td');
                qtyTd.textContent = product.qty;
                
                const priceTd = document.createElement('td');
                priceTd.textContent = formatMoney(product.sellPrice);
                
                const sumTd = document.createElement('td');
                sumTd.textContent = formatMoney(product.sellPrice * product.qty);

                tr.appendChild(nameTd);
                tr.appendChild(qtyTd);
                tr.appendChild(priceTd);
                tr.appendChild(sumTd);

                receiptBody.appendChild(tr);

                totalSell += product.sellPrice * product.qty;
            });

            totalSellEl.textContent = formatMoney(totalSell);
        } catch (e) {
            console.error("Chekni yangilashda xatolik:", e);
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        try {
            const nameInput = document.getElementById('product-name').value;
            const qtyInput = document.getElementById('product-qty').value;
            const sellInput = document.getElementById('sell-price').value;

            const name = nameInput.trim();
            // Vergul bilan yozilgan bo'lsa, nuqtaga o'tkazamiz
            const qtyStr = qtyInput.toString().replace(/,/g, '.');
            const sellStr = sellInput.toString().replace(/,/g, '.');

            const qty = parseFloat(qtyStr);
            const sellPrice = parseFloat(sellStr);

            if (name && !isNaN(qty) && qty > 0 && !isNaN(sellPrice) && sellPrice >= 0) {
                products.push({ name, qty, sellPrice });
                updateReceipt();
                
                // Formani tozalash
                form.reset();
                document.getElementById('product-qty').value = 1;
                document.getElementById('product-name').focus();
            } else {
                alert("Iltimos, barcha maydonlarni to'g'ri to'ldiring! Miqdor yoki narxlarda xatolik bo'lishi mumkin.");
            }
        } catch (error) {
            console.error("Qo'shishda xatolik:", error);
            alert("Xatolik: " + error.message);
        }
    });

    printBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (products.length === 0) {
            alert("Chek chiqarish uchun avval mahsulot qo'shing!");
            return;
        }
        window.print();
    });

    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Barcha ma'lumotlarni tozalab tashlamoqchimisiz?")) {
            products = [];
            form.reset(); // Yozuv maydonlarini ham tozalaydi
            document.getElementById('product-qty').value = 1;
            updateReceipt();
        }
    });
});
