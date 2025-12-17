// Dữ liệu lương - đã được định nghĩa trong data/mockData.js
let currentMonth = '2025-10';
let editingLuongId = null;

function changeMonth() {
    const monthInput = document.getElementById('selectMonth');
    currentMonth = monthInput.value;
    const [year, month] = currentMonth.split('-');
    document.getElementById('luongTitle').textContent = `Bảng lương tháng ${month}/${year}`;
    renderLuongTable();
}

function openLuongModal(id = null) {
    editingLuongId = id;
    const modal = document.getElementById('luongModal');
    const form = document.getElementById('luongForm');
    const title = document.getElementById('luongModalTitle');
    
    if (id) {
        title.textContent = 'Sửa bảng lương';
        const luong = luongData.find(l => l.maNV === id && l.thang === currentMonth);
        if (luong) {
            document.getElementById('maNV').value = luong.maNV;
            document.getElementById('hoTen').value = luong.hoTen;
            document.getElementById('luongCoBan').value = luong.luongCoBan;
            document.getElementById('phuCap').value = luong.phuCap;
            document.getElementById('thuong').value = luong.thuong;
            document.getElementById('khauTru').value = luong.khauTru;
            document.getElementById('thangLuong').value = luong.thang;
            document.getElementById('maNV').disabled = true;
            document.getElementById('thangLuong').disabled = true;
            calculateThucNhan();
        }
    } else {
        title.textContent = 'Thêm bảng lương';
        form.reset();
        document.getElementById('maNV').disabled = false;
        document.getElementById('thangLuong').value = currentMonth;
        document.getElementById('thangLuong').disabled = false;
        document.getElementById('phuCap').value = 0;
        document.getElementById('thuong').value = 0;
        document.getElementById('khauTru').value = 0;
        calculateThucNhan();
    }
    modal.classList.add('show');
}

function closeLuongModal() {
    document.getElementById('luongModal').classList.remove('show');
    document.getElementById('luongForm').reset();
    editingLuongId = null;
}

function calculateThucNhan() {
    const luongCoBan = parseFloat(document.getElementById('luongCoBan').value) || 0;
    const phuCap = parseFloat(document.getElementById('phuCap').value) || 0;
    const thuong = parseFloat(document.getElementById('thuong').value) || 0;
    const khauTru = parseFloat(document.getElementById('khauTru').value) || 0;
    
    const thucNhan = luongCoBan + phuCap + thuong - khauTru;
    document.getElementById('thucNhan').value = formatCurrency(thucNhan);
}

function saveLuong() {
    const maNV = document.getElementById('maNV').value;
    const hoTen = document.getElementById('hoTen').value;
    const luongCoBan = parseFloat(document.getElementById('luongCoBan').value);
    const phuCap = parseFloat(document.getElementById('phuCap').value) || 0;
    const thuong = parseFloat(document.getElementById('thuong').value) || 0;
    const khauTru = parseFloat(document.getElementById('khauTru').value) || 0;
    const thang = document.getElementById('thangLuong').value;
    const thucNhan = luongCoBan + phuCap + thuong - khauTru;

    if (!maNV || !hoTen || !luongCoBan || !thang) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    const luongItem = { maNV, hoTen, luongCoBan, phuCap, thuong, khauTru, thucNhan, thang };

    if (editingLuongId) {
        const index = luongData.findIndex(l => l.maNV === editingLuongId && l.thang === thang);
        if (index !== -1) {
            luongData[index] = luongItem;
            showToast('Cập nhật bảng lương thành công!');
        }
    } else {
        if (luongData.find(l => l.maNV === maNV && l.thang === thang)) {
            showToast('Bảng lương của nhân viên này cho tháng này đã tồn tại!', 'error');
            return;
        }
        luongData.push(luongItem);
        showToast('Thêm bảng lương thành công!');
    }

    renderLuongTable();
    closeLuongModal();
}

function editLuong(maNV) {
    openLuongModal(maNV);
}

function deleteLuong(maNV) {
    if (confirm('Bạn có chắc chắn muốn xóa bảng lương này?')) {
        luongData = luongData.filter(l => !(l.maNV === maNV && l.thang === currentMonth));
        renderLuongTable();
        showToast('Xóa bảng lương thành công!');
    }
}

function renderLuongTable() {
    const filteredData = luongData.filter(l => l.thang === currentMonth);
    const tbody = document.getElementById('luongTableBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Chưa có dữ liệu lương cho tháng này</td></tr>';
        updateTotals(0, 0, 0, 0, 0);
        return;
    }

    tbody.innerHTML = filteredData.map(luong => `
        <tr>
            <td>${luong.maNV}</td>
            <td>${luong.hoTen}</td>
            <td>${formatCurrency(luong.luongCoBan)}</td>
            <td>${formatCurrency(luong.phuCap)}</td>
            <td>${formatCurrency(luong.thuong)}</td>
            <td>${formatCurrency(luong.khauTru)}</td>
            <td style="font-weight: bold; color: #667eea;">${formatCurrency(luong.thucNhan)}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editLuong('${luong.maNV}')">Sửa</button>
                <button class="action-btn btn-delete" onclick="deleteLuong('${luong.maNV}')">Xóa</button>
            </td>
        </tr>
    `).join('');

    // Calculate totals
    const totals = filteredData.reduce((acc, l) => ({
        luongCoBan: acc.luongCoBan + l.luongCoBan,
        phuCap: acc.phuCap + l.phuCap,
        thuong: acc.thuong + l.thuong,
        khauTru: acc.khauTru + l.khauTru,
        thucNhan: acc.thucNhan + l.thucNhan
    }), { luongCoBan: 0, phuCap: 0, thuong: 0, khauTru: 0, thucNhan: 0 });

    updateTotals(totals.luongCoBan, totals.phuCap, totals.thuong, totals.khauTru, totals.thucNhan);
}

function updateTotals(luongCoBan, phuCap, thuong, khauTru, thucNhan) {
    document.getElementById('totalLuongCoBan').textContent = formatCurrency(luongCoBan);
    document.getElementById('totalPhuCap').textContent = formatCurrency(phuCap);
    document.getElementById('totalThuong').textContent = formatCurrency(thuong);
    document.getElementById('totalKhauTru').textContent = formatCurrency(khauTru);
    document.getElementById('totalThucNhan').textContent = formatCurrency(thucNhan);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

window.onclick = function(event) {
    const modal = document.getElementById('luongModal');
    if (event.target == modal) {
        closeLuongModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderLuongTable();
});
