let inventory = [];

function loadStorage() {
    const saved = localStorage.getItem("pcCreatorInventory");
    if (saved) {
        inventory = JSON.parse(saved);
    } else {
        inventory = [];
    }
    renderStorage();
}

function saveStorage() {
    localStorage.setItem("pcCreatorInventory", JSON.stringify(inventory));
}

function addComponentToStorage(comp) {
    inventory.push(comp);
    saveStorage();
    renderStorage();
}

function removeComponentFromStorage(index) {
    if (index >= 0 && index < inventory.length) {
        inventory.splice(index, 1);
        saveStorage();
        renderStorage();
        return true;
    }
    return false;
}

function removeComponentFromStorageById(compId) {
    const index = inventory.findIndex(c => c.id === compId);
    if (index !== -1) {
        inventory.splice(index, 1);
        saveStorage();
        renderStorage();
        return true;
    }
    return false;
}

function renderStorage() {
    const container = document.getElementById("storageList");
    if (!container) return;
    if (inventory.length === 0) {
        container.innerHTML = "<div style='padding:20px; text-align:center'>Storage kosong. Beli komponen atau dapatkan reward!</div>";
        return;
    }
    container.innerHTML = "";
    inventory.forEach((comp, idx) => {
        const card = document.createElement("div");
        card.className = "comp-card";
        card.setAttribute("data-storage-idx", idx);
        card.innerHTML = `
            <div class="comp-name">${comp.name}</div>
            <div class="comp-details">
                <span>${comp.category.toUpperCase()} ${comp.socket ? `[${comp.socket}]` : ""} ${comp.wattage ? comp.wattage+"W" : ""} ${comp.capacity ? comp.capacity+"GB" : ""}</span>
                <span class="comp-price">${formatRupiah(comp.price)}</span>
            </div>
            <div class="card-buttons">
                <button class="install-from-storage-btn" data-id="${comp.id}">🔧 Pasang</button>
                <button class="sell-storage-btn" data-id="${comp.id}">💰 Jual (50%)</button>
            </div>
        `;
        container.appendChild(card);
    });
    document.querySelectorAll(".install-from-storage-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const compId = btn.getAttribute("data-id");
            const comp = inventory.find(c => c.id === compId);
            if (comp && typeof installComponentFromStorage === "function") {
                installComponentFromStorage(comp);
            }
        });
    });
    document.querySelectorAll(".sell-storage-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const compId = btn.getAttribute("data-id");
            const comp = inventory.find(c => c.id === compId);
            if (comp && typeof sellComponentFromStorage === "function") {
                sellComponentFromStorage(comp);
            }
        });
    });
}