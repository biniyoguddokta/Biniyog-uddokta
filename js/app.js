// ============================================
// ডেটা লোড করার মূল স্ক্রিপ্ট
// ============================================

// মোবাইল মেনু
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

// ============================================
// ডেটা লোড ও রেন্ডার
// ============================================
async function loadAllData() {
    try {
        const response = await fetch('/data/members.json');
        if (!response.ok) throw new Error('ডেটা লোড হয়নি');
        const data = await response.json();

        renderMembers(data.members);
        renderTransactions(data.recentTransactions);
        renderInvestments(data.investments);
        updateFinancials(data.financials);
        updateHeaderDate(data.siteInfo);

    } catch (error) {
        console.error('ডেটা লোডে সমস্যা:', error);
    }
}

// ============================================
// সদস্যদের রেন্ডার
// ============================================
function renderMembers(members) {
    // হেডার মোট সদস্য
    document.getElementById('headerTotalMembers').textContent = members.length + ' জন';
    document.getElementById('totalMembersBox').textContent = members.length;
    document.getElementById('summaryTotalMembers').textContent = members.length;

    // ড্রপডাউন
    const dropdownList = document.getElementById('memberDropdownList');
    dropdownList.innerHTML = '';
    members.forEach((member, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${index + 1}</span> ${member.name}`;
        dropdownList.appendChild(li);
    });

    // টেবিল
    const tableBody = document.getElementById('memberTableBody');
    tableBody.innerHTML = '';
    members.forEach((member, index) => {
        const tr = document.createElement('tr');
        
        let nameHtml = `
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 3px;">
                <span class="profile-icon"><i class="fas fa-user"></i></span>
                <span style="font-weight: 500;">${member.name}</span>
            </div>
        `;
        
        if (member.designation) {
            nameHtml += `<span style="font-size: 9px; color: #9e9e9e; font-weight: normal; margin-left: 0;">${member.designation}</span>`;
        }

        tr.innerHTML = `
            <td style="text-align: center;">${index + 1}</td>
            <td>${nameHtml}</td>
            <td>${member.savings}</td>
            <td>${member.share}</td>
            <td>${member.profit}</td>
            <td>${member.currentValue}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// ============================================
// সাম্প্রতিক লেনদেন রেন্ডার
// ============================================
function renderTransactions(transactions) {
    const tbody = document.getElementById('recentTransactionsBody');
    tbody.innerHTML = '';
    
    if (!transactions || transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 15px; color: #999;">কোনো লেনদেন নেই</td></tr>';
        return;
    }

    transactions.forEach(t => {
        const tr = document.createElement('tr');
        const iconClass = t.icon || 'fa-piggy-bank';
        const iconColor = t.color || '#388e3c';
        
        tr.innerHTML = `
            <td>${t.date}</td>
            <td><i class="fas ${iconClass}" style="color:${iconColor};"></i> ${t.type}</td>
            <td>${t.description}</td>
            <td>${t.amount}</td>
            <td><span class="status-badge"><i class="fas fa-check-circle"></i> ${t.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================
// বিনিয়োগ রেন্ডার
// ============================================
function renderInvestments(investments) {
    const container = document.getElementById('investmentsList');
    container.innerHTML = '';

    if (!investments || investments.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; padding: 10px;">কোনো বিনিয়োগ নেই</p>';
        return;
    }

    investments.forEach(inv => {
        const item = document.createElement('div');
        item.className = 'investment-item';
        
        const percentClass = inv.percent && inv.percent.startsWith('-') ? 'inv-percent red' : 'inv-percent';
        
        item.innerHTML = `
            <div class="inv-left">
                <div class="inv-icon"><i class="fas ${inv.icon || 'fa-briefcase'}"></i></div>
                <div class="inv-info">
                    <h4>${inv.name}</h4>
                </div>
            </div>
            <div style="text-align: right;">
                <div class="inv-amount">${inv.amount}</div>
                <div class="${percentClass}">${inv.percent}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// ============================================
// আর্থিক তথ্য আপডেট
// ============================================
function updateFinancials(f) {
    if (!f) return;

    document.getElementById('totalSavings').textContent = f.totalSavings || '৳0';
    document.getElementById('totalSavingsSub').textContent = f.totalSavingsSub || '+ ৳0 (এই মাসে)';
    document.getElementById('bankBalance').textContent = f.bankBalance || '৳0';
    document.getElementById('totalInvestment').textContent = f.totalInvestment || '৳0';
    document.getElementById('currentValue').textContent = f.currentValue || '৳0';
    document.getElementById('totalProfit').textContent = f.totalProfit || '৳0';

    // Public Summary
    document.getElementById('summaryTotalSavings').textContent = f.totalSavings || '৳0';
    document.getElementById('summaryBankBalance').textContent = f.bankBalance || '৳0';
    document.getElementById('summaryInvestment').textContent = f.totalInvestment || '৳0';
    document.getElementById('summaryCurrentValue').textContent = f.currentValue || '৳0';
    document.getElementById('summaryProfit').textContent = f.totalProfit || '৳0';
}

// ============================================
// হেডার তারিখ আপডেট
// ============================================
function updateHeaderDate(siteInfo) {
    if (siteInfo && siteInfo.todayDate) {
        document.getElementById('headerDate').textContent = siteInfo.todayDate;
    }
}

// ============================================
// পেজ লোড হলে ডেটা আন
// ============================================
document.addEventListener('DOMContentLoaded', loadAllData);