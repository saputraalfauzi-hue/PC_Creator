let inventory = []; // array komponen yang dimiliki (selain yang dipasang)

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
        const removed = inventory.splice(index, 1)[0];
        saveStorage();
        renderStorage();
        return removed;
    }
    return null;
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
        card.setAttribute("draggable", "true");
        card.setAttribute("data-component-idx", idx);
        card.setAttribute("data-from", "storage");
        card.innerHTML = `
            <div class="comp-name">${comp.name}</div>
            <div class="comp-details">
                <span>${comp.category.toUpperCase()} ${comp.socket ? `[${comp.socket}]` : ""} ${comp.wattage ? comp.wattage+"W" : ""} ${comp.capacity ? comp.capacity+"GB" : ""}</span>
                <span class="comp-price">${formatRupiah(comp.price)}</span>
            </div>
        `;
        card.addEventListener("dragstart", handleDragStart);
        card.addEventListener("dragend", handleDragEnd);
        container.appendChild(card);
    });
}