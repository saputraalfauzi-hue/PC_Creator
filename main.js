let currentBuild = {
    cpu: null, motherboard: null, ram: null, gpu: null, storage: null, psu: null
};
let playerMoney = 20000000;
let playerLevel = 1;
let playerXP = 0;
let xpNeeded = 100;
let currentClient = null;

function formatRupiah(amount) {
    return "Rp " + amount.toLocaleString("id-ID");
}

function updateUIStats() {
    document.getElementById("money").innerText = formatRupiah(playerMoney);
    document.getElementById("level").innerText = playerLevel;
    document.getElementById("xp").innerText = playerXP;
    document.getElementById("xpNext").innerText = xpNeeded;
}

function saveGame() {
    const gameState = {
        money: playerMoney,
        level: playerLevel,
        xp: playerXP,
        build: currentBuild,
        inventory: inventory
    };
    localStorage.setItem("pcCreatorSave", JSON.stringify(gameState));
    saveStorage();
}

function loadGame() {
    const saved = localStorage.getItem("pcCreatorSave");
    if (saved) {
        const state = JSON.parse(saved);
        playerMoney = state.money;
        playerLevel = state.level;
        playerXP = state.xp;
        currentBuild = state.build || { cpu: null, motherboard: null, ram: null, gpu: null, storage: null, psu: null };
        inventory = state.inventory || [];
        saveStorage();
    } else {
        inventory = [];
    }
    updateUIStats();
    renderBuildSlots();
    renderShop();
    renderStorage();
    updateCompatibilityMessage();
}

function addXP(amount) {
    playerXP += amount;
    while (playerXP >= xpNeeded) {
        playerXP -= xpNeeded;
        playerLevel++;
        xpNeeded = Math.floor(100 + (playerLevel-1) * 25);
        showTemporaryMessage(`🎉 LEVEL UP! Sekarang Level ${playerLevel} 🎉`, "#4a7c59");
    }
    updateUIStats();
    saveGame();
}

async function randomReward() {
    const rewardCount = Math.floor(Math.random() * 3);
    if (rewardCount === 0) return [];
    const shuffled = [...componentsDatabase];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const rewards = shuffled.slice(0, rewardCount);
    rewards.forEach(comp => addComponentToStorage({ ...comp }));
    return rewards;
}

function installComponent(comp, source) {
    let slotKey = null;
    if (comp.category === "cpu") slotKey = "cpu";
    else if (comp.category === "motherboard") slotKey = "motherboard";
    else if (comp.category === "ram") slotKey = "ram";
    else if (comp.category === "gpu") slotKey = "gpu";
    else if (comp.category === "storage") slotKey = "storage";
    else if (comp.category === "psu") slotKey = "psu";
    if (!slotKey) return false;

    const currentPart = currentBuild[slotKey];
    if (currentPart !== null) {
        if (!confirm(`Slot ${slotKey.toUpperCase()} sudah terisi dengan ${currentPart.name}. Ganti dengan ${comp.name}?`)) {
            return false;
        }
    }

    if (source === "shop") {
        if (playerMoney >= comp.price) {
            playerMoney -= comp.price;
            updateUIStats();
            saveGame();
            showTemporaryMessage(`✅ Membeli ${comp.name} dan memasang ke ${slotKey.toUpperCase()}`, "#3a6e4a");
        } else {
            showTemporaryMessage(`Uang tidak cukup untuk membeli ${comp.name}!`, "#a55a3a");
            return false;
        }
    } else if (source === "storage") {
        showTemporaryMessage(`🔧 Memasang ${comp.name} dari storage ke ${slotKey.toUpperCase()}`, "#3a6e4a");
    }

    if (currentPart !== null) {
        addComponentToStorage(currentPart);
        showTemporaryMessage(`Komponen ${currentPart.name} dipindahkan ke storage`, "#7a5a2a");
    }

    currentBuild[slotKey] = comp;
    renderBuildSlots();
    updateCompatibilityMessage();
    saveGame();
    return true;
}

function installComponentFromStorage(comp) {
    if (installComponent(comp, "storage")) {
        removeComponentFromStorageById(comp.id);
    }
}

function sellComponentFromStorage(comp) {
    const sellPrice = Math.floor(comp.price * 0.5);
    if (confirm(`Jual ${comp.name} seharga ${formatRupiah(sellPrice)}?`)) {
        playerMoney += sellPrice;
        removeComponentFromStorageById(comp.id);
        updateUIStats();
        saveGame();
        showTemporaryMessage(`Terjual ${comp.name}`, "#3a6e4a");
    }
}

function buyComponent(comp) {
    if (playerMoney >= comp.price) {
        if (confirm(`Beli ${comp.name} seharga ${formatRupiah(comp.price)}? Komponen akan disimpan di Storage.`)) {
            playerMoney -= comp.price;
            addComponentToStorage({ ...comp });
            updateUIStats();
            saveGame();
            showTemporaryMessage(`✅ Berhasil membeli ${comp.name} (tersimpan di Storage)`, "#3a6e4a");
        } else {
            showTemporaryMessage("Pembelian dibatalkan", "#7a5a2a");
        }
    } else {
        showTemporaryMessage(`Uang tidak cukup! Butuh ${formatRupiah(comp.price)}`, "#a55a3a");
    }
}

function evaluateBuild() {
    if (!currentClient) {
        document.getElementById("gameMessage").innerHTML = "Tidak ada klien aktif!";
        return;
    }
    const build = currentBuild;
    const missing = [];
    if (!build.cpu) missing.push("CPU");
    if (!build.motherboard) missing.push("Motherboard");
    if (!build.ram) missing.push("RAM");
    if (!build.gpu) missing.push("GPU");
    if (!build.storage) missing.push("Storage");
    if (!build.psu) missing.push("PSU");
    if (missing.length > 0) {
        showTemporaryMessage(`PC belum lengkap: ${missing.join(", ")}`, "#682c3c");
        return;
    }
    let errors = [];
    if (build.cpu.socket !== build.motherboard.socket) errors.push("Socket tidak cocok");
    let totalPower = (build.cpu.power||0) + (build.motherboard.power||0) + (build.ram.power||0) + (build.gpu.power||0) + (build.storage.power||0);
    if (totalPower > build.psu.wattage) errors.push(`Daya PSU kurang (${totalPower}W > ${build.psu.wattage}W)`);
    const ramCap = build.ram.capacity || 0;
    if (ramCap < currentClient.minRam) errors.push(`RAM minimal ${currentClient.minRam}GB, saat ini ${ramCap}GB`);
    const tierRank = { low:0, mid:1, high:2, ultra:3 };
    if (tierRank[build.gpu.tier] < tierRank[currentClient.minGpuTier]) errors.push(`GPU terlalu lemah, butuh tier ${currentClient.minGpuTier}`);
    const totalPrice = (build.cpu.price||0)+(build.motherboard.price||0)+(build.ram.price||0)+(build.gpu.price||0)+(build.storage.price||0)+(build.psu.price||0);
    if (totalPrice > currentClient.budget) errors.push(`Melebihi budget ${formatRupiah(currentClient.budget)}`);
    if (errors.length > 0) {
        document.getElementById("gameMessage").innerHTML = "❌ Klien menolak: " + errors.join("; ");
        document.getElementById("gameMessage").style.background = "#682c3c";
        return;
    }
    const xpGain = Math.floor(Math.random() * 11) + 5;
    addXP(xpGain);
    randomReward().then(rewardComps => {
        let rewardMsg = "";
        if (rewardComps.length > 0) {
            rewardMsg = ` + Mendapat komponen: ${rewardComps.map(c=>c.name).join(", ")}`;
        }
        document.getElementById("gameMessage").innerHTML = `🎉 Pesanan selesai! +${xpGain} XP. ${rewardMsg} 🎉`;
        document.getElementById("gameMessage").style.background = "#216b49";
        playerMoney += currentClient.budget;
        updateUIStats();
        for (let key in currentBuild) {
            currentBuild[key] = null;
        }
        renderBuildSlots();
        updateCompatibilityMessage();
        saveGame();
        nextClient();
    });
}

function nextClient() {
    currentClient = getRandomClient();
    updateClientUI();
    renderBuildSlots();
    updateCompatibilityMessage();
}

function skipClient() {
    if (playerMoney >= 500000) {
        playerMoney -= 500000;
        updateUIStats();
        nextClient();
        showTemporaryMessage("Klien diganti! Biaya 500k.", "#3a5a7a");
        saveGame();
    } else {
        showTemporaryMessage("Uang tidak cukup untuk skip!", "#a55a3a");
    }
}

function updateClientUI() {
    if (!currentClient) return;
    document.getElementById("clientName").innerHTML = `${currentClient.avatar || "🧑‍💼"} Klien: ${currentClient.name}`;
    document.getElementById("clientRequest").innerHTML = `💰 Budget: ${formatRupiah(currentClient.budget)} | Kebutuhan: ${currentClient.usage}`;
    document.getElementById("clientRequirements").innerHTML = `📋 Minimal: RAM ${currentClient.minRam}GB, GPU tier ${currentClient.minGpuTier}`;
}

function renderShop() {
    const container = document.getElementById("shopComponents");
    const category = document.getElementById("categoryFilter").value;
    let filtered = componentsDatabase;
    if (category !== "all") {
        filtered = componentsDatabase.filter(c => c.category === category);
    }
    container.innerHTML = "";
    filtered.forEach(comp => {
        const card = document.createElement("div");
        card.className = "comp-card";
        card.innerHTML = `
            <div class="comp-name">${comp.name}</div>
            <div class="comp-details">
                <span>${comp.category.toUpperCase()} ${comp.socket ? `[${comp.socket}]` : ""} ${comp.wattage ? comp.wattage+"W" : ""} ${comp.capacity ? comp.capacity+"GB" : ""}</span>
                <span class="comp-price">${formatRupiah(comp.price)}</span>
            </div>
            <div class="card-buttons">
                <button class="buy-btn">🛒 Beli (ke Storage)</button>
                <button class="install-btn">🔧 Pasang</button>
            </div>
        `;
        card.querySelector(".buy-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            buyComponent(comp);
        });
        card.querySelector(".install-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            installComponent(comp, "shop");
        });
        container.appendChild(card);
    });
}

function removeFromBuild(slotKey) {
    const oldComp = currentBuild[slotKey];
    if (oldComp) {
        if (confirm(`Melepas ${oldComp.name} dari slot ${slotKey.toUpperCase()}? Komponen akan kembali ke Storage.`)) {
            addComponentToStorage(oldComp);
            currentBuild[slotKey] = null;
            renderBuildSlots();
            updateCompatibilityMessage();
            saveGame();
            showTemporaryMessage(`${oldComp.name} dipindahkan ke Storage`, "#7a5a2a");
        }
    }
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
            ${!slot.isEmpty ? `<button class="mini-remove" data-key="${slot.key}">✖ Lepas</button>` : ""}
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
    updateBuildPriceAndPower();
}

function updateBuildPriceAndPower() {
    let total = 0, power = 0, psuWatt = 0;
    for (let key in currentBuild) {
        const part = currentBuild[key];
        if (part) {
            total += part.price;
            if (part.power) power += part.power;
            if (key === "psu" && part.wattage) psuWatt = part.wattage;
        }
    }
    document.getElementById("buildPrice").innerText = formatRupiah(total);
    document.getElementById("buildPower").innerText = power;
    document.getElementById("buildPsuWatt").innerText = psuWatt;
}

function updateCompatibilityMessage() {
    let msg = "";
    const cpu = currentBuild.cpu, mobo = currentBuild.motherboard, psu = currentBuild.psu;
    let power = 0;
    for (let key in currentBuild) {
        if (currentBuild[key]?.power) power += currentBuild[key].power;
    }
    if (cpu && mobo && cpu.socket !== mobo.socket) msg = "❌ Socket tidak cocok!";
    else if (psu && power > psu.wattage) msg = `⚠️ Daya PSU kurang (${power}W > ${psu.wattage}W)`;
    else msg = "✅ Kompatibilitas OK. Serahkan ke klien!";
    document.getElementById("gameMessage").innerHTML = msg;
    document.getElementById("gameMessage").style.background = msg.includes("❌") ? "#682c3c" : (msg.includes("⚠️") ? "#7a5a2a" : "#1b4d3e");
}

function resetBuild() {
    if (confirm("Reset seluruh rakitan? Semua komponen akan dipindahkan ke Storage.")) {
        for (let key in currentBuild) {
            if (currentBuild[key]) {
                addComponentToStorage(currentBuild[key]);
                currentBuild[key] = null;
            }
        }
        renderBuildSlots();
        updateCompatibilityMessage();
        saveGame();
        showTemporaryMessage("Rakitan direset, komponen tersimpan di Storage", "#3a5a7a");
    }
}

function showTemporaryMessage(msg, bg) {
    const msgDiv = document.getElementById("gameMessage");
    msgDiv.innerHTML = msg;
    msgDiv.style.background = bg;
    setTimeout(() => {
        if (document.getElementById("gameMessage").innerHTML === msg) updateCompatibilityMessage();
    }, 2500);
}

function setupTabAnimation() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.tab;
            tabContents.forEach(tab => {
                if (tab.id === `tab-${targetId}`) {
                    tab.style.display = "block";
                    tab.style.animation = "slideDown 0.3s ease";
                } else {
                    tab.style.animation = "slideUp 0.2s ease";
                    setTimeout(() => { tab.style.display = "none"; }, 200);
                }
            });
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    currentClient = getRandomClient();
    updateClientUI();
    renderShop();
    renderStorage();
    renderBuildSlots();
    updateUIStats();
    document.getElementById("categoryFilter").addEventListener("change", () => renderShop());
    document.getElementById("evaluateBtn").addEventListener("click", evaluateBuild);
    document.getElementById("resetBuildBtn").addEventListener("click", resetBuild);
    document.getElementById("skipClientBtn").addEventListener("click", skipClient);
    setupTabAnimation();
    window.addEventListener("beforeunload", () => saveGame());
});
