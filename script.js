const componentsDatabase = {
    cpus: [
        { id: "cpu1", name: "Intel i5-12400F", socket: "LGA1700", price: 1850000, power: 65, category: "cpu" },
        { id: "cpu2", name: "AMD Ryzen 5 5600X", socket: "AM4", price: 2250000, power: 65, category: "cpu" },
        { id: "cpu3", name: "Intel i7-12700K", socket: "LGA1700", price: 4750000, power: 125, category: "cpu" },
        { id: "cpu4", name: "AMD Ryzen 7 5800X", socket: "AM4", price: 3950000, power: 105, category: "cpu" }
    ],
    motherboards: [
        { id: "mobo1", name: "B660M (LGA1700)", socket: "LGA1700", price: 1650000, power: 30, category: "motherboard" },
        { id: "mobo2", name: "B550M (AM4)", socket: "AM4", price: 1550000, power: 30, category: "motherboard" },
        { id: "mobo3", name: "Z690 (LGA1700)", socket: "LGA1700", price: 3200000, power: 45, category: "motherboard" },
        { id: "mobo4", name: "X570 (AM4)", socket: "AM4", price: 2950000, power: 40, category: "motherboard" }
    ],
    rams: [
        { id: "ram1", name: "DDR4 16GB (2x8)", price: 850000, power: 10, capacity: 16, category: "ram" },
        { id: "ram2", name: "DDR4 32GB (2x16)", price: 1650000, power: 15, capacity: 32, category: "ram" },
        { id: "ram3", name: "DDR5 16GB", price: 1250000, power: 12, capacity: 16, category: "ram" }
    ],
    gpus: [
        { id: "gpu1", name: "GTX 1660 Super", price: 2850000, power: 125, tier: "mid", category: "gpu" },
        { id: "gpu2", name: "RTX 3060", price: 4100000, power: 170, tier: "high", category: "gpu" },
        { id: "gpu3", name: "RX 6600", price: 3950000, power: 160, tier: "high", category: "gpu" },
        { id: "gpu4", name: "RTX 4070", price: 8250000, power: 200, tier: "ultra", category: "gpu" }
    ],
    storages: [
        { id: "ssd1", name: "SSD NVMe 512GB", price: 650000, power: 5, category: "storage" },
        { id: "ssd2", name: "SSD NVMe 1TB", price: 1150000, power: 6, category: "storage" },
        { id: "hdd1", name: "HDD 1TB", price: 550000, power: 7, category: "storage" }
    ],
    psus: [
        { id: "psu1", name: "550W 80+ Bronze", wattage: 550, price: 750000, category: "psu" },
        { id: "psu2", name: "650W 80+ Gold", wattage: 650, price: 1150000, category: "psu" },
        { id: "psu3", name: "750W 80+ Gold", wattage: 750, price: 1550000, category: "psu" }
    ]
};

let allComponents = [
    ...componentsDatabase.cpus, ...componentsDatabase.motherboards,
    ...componentsDatabase.rams, ...componentsDatabase.gpus,
    ...componentsDatabase.storages, ...componentsDatabase.psus
];

let currentBuild = {
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null
};

let currentClient = {
    name: "Gamers Gilang",
    budget: 18000000,
    usage: "gaming_editing",
    minRam: 16,
    minGpuTier: "high"
};

function formatRupiah(amount) {
    return "Rp " + amount.toLocaleString("id-ID");
}

function renderShop() {
    const container = document.getElementById("componentsList");
    container.innerHTML = "";
    allComponents.forEach(comp => {
        const card = document.createElement("div");
        card.className = "comp-card";
        card.innerHTML = `
            <div class="comp-name">${comp.name}</div>
            <div class="comp-details">
                <span>${comp.category.toUpperCase()} ${comp.socket ? `[${comp.socket}]` : ""} ${comp.wattage ? comp.wattage+"W" : ""} ${comp.capacity ? comp.capacity+"GB" : ""}</span>
                <span class="comp-price">${formatRupiah(comp.price)}</span>
            </div>
        `;
        card.addEventListener("click", () => tryAddComponent(comp));
        container.appendChild(card);
    });
}

function tryAddComponent(comp) {
    const category = comp.category;
    let canAdd = true;
    if (category === "cpu") canAdd = currentBuild.cpu === null;
    else if (category === "motherboard") canAdd = currentBuild.motherboard === null;
    else if (category === "ram") canAdd = currentBuild.ram === null;
    else if (category === "gpu") canAdd = currentBuild.gpu === null;
    else if (category === "storage") canAdd = currentBuild.storage === null;
    else if (category === "psu") canAdd = currentBuild.psu === null;
    if (!canAdd) {
        showTemporaryMessage("Slot sudah terisi! Reset atau ganti dulu.", "#c97e5a");
        return;
    }
    if (category === "cpu") currentBuild.cpu = comp;
    else if (category === "motherboard") currentBuild.motherboard = comp;
    else if (category === "ram") currentBuild.ram = comp;
    else if (category === "gpu") currentBuild.gpu = comp;
    else if (category === "storage") currentBuild.storage = comp;
    else if (category === "psu") currentBuild.psu = comp;
    renderBuildSlots();
    checkCompatibilityAndWarnings();
}

function removeFromBuild(category) {
    if (category === "cpu") currentBuild.cpu = null;
    else if (category === "motherboard") currentBuild.motherboard = null;
    else if (category === "ram") currentBuild.ram = null;
    else if (category === "gpu") currentBuild.gpu = null;
    else if (category === "storage") currentBuild.storage = null;
    else if (category === "psu") currentBuild.psu = null;
    renderBuildSlots();
    checkCompatibilityAndWarnings();
}

function renderBuildSlots() {
    const container = document.getElementById("pcSlots");
    const slots = [
        { label: "CPU", key: "cpu", value: currentBuild.cpu?.name || "Kosong", isEmpty: !currentBuild.cpu },
        { label: "Motherboard", key: "motherboard", value: currentBuild.motherboard?.name || "Kosong", isEmpty: !currentBuild.motherboard },
        { label: "RAM", key: "ram", value: currentBuild.ram?.name || "Kosong", isEmpty: !currentBuild.ram },
        { label: "GPU", key: "gpu", value: currentBuild.gpu?.name || "Kosong", isEmpty: !currentBuild.gpu },
        { label: "Storage", key: "storage", value: currentBuild.storage?.name || "Kosong", isEmpty: !currentBuild.storage },
        { label: "PSU", key: "psu", value: currentBuild.psu?.name || "Kosong", isEmpty: !currentBuild.psu }
    ];
    container.innerHTML = "";
    slots.forEach(slot => {
        const div = document.createElement("div");
        div.className = "slot-item";
        div.innerHTML = `
            <span class="slot-label">${slot.label}</span>
            <span class="slot-value ${slot.isEmpty ? 'empty-slot' : ''}">${slot.value}</span>
            ${!slot.isEmpty ? `<button class="mini-remove" data-key="${slot.key}" style="background:#5a2d3c; padding:4px 10px; width:auto; margin:0;">✖</button>` : ""}
        `;
        if (!slot.isEmpty) {
            const btn = div.querySelector(".mini-remove");
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                removeFromBuild(slot.key);
            });
        }
        container.appendChild(div);
    });
    updateTotalPriceAndPower();
}

function updateTotalPriceAndPower() {
    let total = 0;
    let power = 0;
    let psuWatt = 0;
    for (let key in currentBuild) {
        const part = currentBuild[key];
        if (part) {
            total += part.price;
            if (part.power) power += part.power;
            if (key === "psu" && part.wattage) psuWatt = part.wattage;
        }
    }
    document.getElementById("totalPrice").innerText = formatRupiah(total);
    document.getElementById("totalPower").innerText = power;
    document.getElementById("psuWattage").innerText = psuWatt;
    return { total, power, psuWatt };
}

function checkCompatibilityAndWarnings() {
    let warnings = [];
    const cpu = currentBuild.cpu;
    const mobo = currentBuild.motherboard;
    const psu = currentBuild.psu;
    const { power, psuWatt } = updateTotalPriceAndPower();
    if (cpu && mobo && cpu.socket !== mobo.socket) {
        warnings.push("❌ CPU dan Motherboard socket tidak cocok!");
    }
    if (psu && power > psuWatt) {
        warnings.push("⚠️ Daya PSU tidak mencukupi! ("+power+"W > "+psuWatt+"W)");
    }
    const msgDiv = document.getElementById("resultMessage");
    if (warnings.length > 0) {
        msgDiv.innerHTML = warnings.join("<br>");
        msgDiv.style.background = "#4a2533";
    } else {
        msgDiv.innerHTML = "✅ Kompatibilitas dasar OK. Klik Evaluasi untuk klien.";
        msgDiv.style.background = "#1b4d3e";
    }
}

function evaluateBuild() {
    const { total, power, psuWatt } = updateTotalPriceAndPower();
    const cpu = currentBuild.cpu;
    const mobo = currentBuild.motherboard;
    const ram = currentBuild.ram;
    const gpu = currentBuild.gpu;
    const psu = currentBuild.psu;
    const storage = currentBuild.storage;
    let errors = [];
    if (!cpu || !mobo || !ram || !gpu || !psu || !storage) {
        errors.push("PC belum lengkap (semua slot wajib diisi)");
        document.getElementById("resultMessage").innerHTML = errors.join(", ");
        document.getElementById("resultMessage").style.background = "#682c3c";
        return;
    }
    if (cpu.socket !== mobo.socket) errors.push("Socket tidak cocok");
    if (power > psu.wattage) errors.push("Daya PSU kurang");
    let ramCapacity = ram.capacity || 0;
    if (ramCapacity < currentClient.minRam) errors.push(`RAM minimal ${currentClient.minRam}GB, saat ini ${ramCapacity}GB`);
    let gpuTier = gpu.tier;
    const requiredTier = currentClient.minGpuTier;
    const tierRank = { low:0, mid:1, high:2, ultra:3 };
    if (tierRank[gpuTier] < tierRank[requiredTier]) errors.push(`GPU terlalu lemah untuk gaming+editing, minimal tier ${requiredTier}`);
    if (total > currentClient.budget) errors.push(`Melebihi budget: ${formatRupiah(currentClient.budget)}`);
    if (errors.length > 0) {
        document.getElementById("resultMessage").innerHTML = "❌ Klien menolak: " + errors.join("; ");
        document.getElementById("resultMessage").style.background = "#682c3c";
    } else {
        let satisfaction = 100;
        if (total < currentClient.budget * 0.8) satisfaction += 5;
        if (power < psu.wattage - 50) satisfaction += 5;
        document.getElementById("resultMessage").innerHTML = `🎉 Klien sangat puas! Skor kepuasan: ${satisfaction}% | Pesanan diterima. + EXP Builder! 🎉`;
        document.getElementById("resultMessage").style.background = "#216b49";
    }
}

function resetBuild() {
    currentBuild = { cpu: null, motherboard: null, ram: null, gpu: null, storage: null, psu: null };
    renderBuildSlots();
    document.getElementById("resultMessage").innerHTML = "Rakitan direset. Mulai lagi!";
    document.getElementById("resultMessage").style.background = "#00000077";
    checkCompatibilityAndWarnings();
}

function showTemporaryMessage(msg, bg) {
    const msgDiv = document.getElementById("resultMessage");
    msgDiv.innerHTML = msg;
    msgDiv.style.background = bg;
    setTimeout(() => {
        if (document.getElementById("resultMessage").innerHTML === msg)
            checkCompatibilityAndWarnings();
    }, 2000);
}

function updateClientUI() {
    document.getElementById("clientName").innerHTML = `🧑‍💼 Klien: ${currentClient.name}`;
    document.getElementById("clientRequest").innerHTML = `💰 Budget: ${formatRupiah(currentClient.budget)} | Gaming + Editing`;
    document.getElementById("clientRequirements").innerHTML = `📋 Minimal: RAM ${currentClient.minRam}GB, GPU tier ${currentClient.minGpuTier} (RTX 3060 / RX 6600 setara)`;
}

window.onload = () => {
    renderShop();
    renderBuildSlots();
    updateClientUI();
    document.getElementById("evaluateBtn").addEventListener("click", evaluateBuild);
    document.getElementById("resetBuildBtn").addEventListener("click", resetBuild);
    checkCompatibilityAndWarnings();
};