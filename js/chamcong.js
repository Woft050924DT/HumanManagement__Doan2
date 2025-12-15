let chamCongData = [
    { maNV: 'NV001', hoTen: 'Nguyễn Văn A', thang: '2025-10', soNgayCong: 20, soGioLam: 160, diMuon: 0, veSom: 1, nghiPhep: 2 },
    { maNV: 'NV002', hoTen: 'Trần Thị B', thang: '2025-10', soNgayCong: 22, soGioLam: 176, diMuon: 2, veSom: 0, nghiPhep: 0 },
    { maNV: 'NV003', hoTen: 'Lê Văn C', thang: '2025-10', soNgayCong: 21, soGioLam: 168, diMuon: 1, veSom: 1, nghiPhep: 1 }
];
let currentMonth = '2025-10';
let editingChamCongId = null;

function changeMonth() {
    const monthInput = document.getElementById('selectMonth');
    currentMonth = monthInput.value;
    const [year, month] = currentMonth.split('-');
    document.getElementById('chamcongTitle').textContent = `Bảng chấm công tháng ${month}/${year}`;
    renderChamCongTable();
}

function calculateGioLam() {
    const soNgayCong = parseFloat(document.getElementById('soNgayCong').value) || 0;
    const soGioLam = soNgayCong * 8; // 8 giờ mỗi ngày
    document.getElementById('soGioLam').value = soGioLam;
}

function openChamCongModal(id = null) {
    editingChamCongId = id;
    const modal = document.getElementById('chamCongModal');
    const form = document.getElementById('chamCongForm');
    const title = document.getElementById('chamCongModalTitle');
    
    if (id) {
        title.textContent = 'Sửa chấm công';
        const cc = chamCongData.find(c => c.maNV === id && c.thang === currentMonth);
        if (cc) {
            document.getElementById('maNV').value = cc.maNV;
            document.getElementById('hoTen').value = cc.hoTen;
            document.getElementById('thangChamCong').value = cc.thang;
            document.getElementById('soNgayCong').value = cc.soNgayCong;
            document.getElementById('soGioLam').value = cc.soGioLam;
            document.getElementById('diMuon').value = cc.diMuon;
            document.getElementById('veSom').value = cc.veSom;
            document.getElementById('nghiPhep').value = cc.nghiPhep;
            document.getElementById('maNV').disabled = true;
            document.getElementById('thangChamCong').disabled = true;
        }
    } else {
        title.textContent = 'Thêm chấm công';
        form.reset();
        document.getElementById('maNV').disabled = false;
        document.getElementById('thangChamCong').value = currentMonth;
        document.getElementById('thangChamCong').disabled = false;
        document.getElementById('diMuon').value = 0;
        document.getElementById('veSom').value = 0;
        document.getElementById('nghiPhep').value = 0;
    }
    modal.classList.add('show');
}

function closeChamCongModal() {
    document.getElementById('chamCongModal').classList.remove('show');
    document.getElementById('chamCongForm').reset();
    editingChamCongId = null;
}

function saveChamCong() {
    const maNV = document.getElementById('maNV').value;
    const hoTen = document.getElementById('hoTen').value;
    const thang = document.getElementById('thangChamCong').value;
    const soNgayCong = parseInt(document.getElementById('soNgayCong').value);
    const soGioLam = parseFloat(document.getElementById('soGioLam').value);
    const diMuon = parseInt(document.getElementById('diMuon').value) || 0;
    const veSom = parseInt(document.getElementById('veSom').value) || 0;
    const nghiPhep = parseInt(document.getElementById('nghiPhep').value) || 0;

    if (!maNV || !hoTen || !thang || !soNgayCong || !soGioLam) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    const chamCongItem = { maNV, hoTen, thang, soNgayCong, soGioLam, diMuon, veSom, nghiPhep };

    if (editingChamCongId) {
        const index = chamCongData.findIndex(c => c.maNV === editingChamCongId && c.thang === thang);
        if (index !== -1) {
            chamCongData[index] = chamCongItem;
            showToast('Cập nhật chấm công thành công!');
        }
    } else {
        if (chamCongData.find(c => c.maNV === maNV && c.thang === thang)) {
            showToast('Bảng chấm công của nhân viên này cho tháng này đã tồn tại!', 'error');
            return;
        }
        chamCongData.push(chamCongItem);
        showToast('Thêm chấm công thành công!');
    }

    renderChamCongTable();
    closeChamCongModal();
}

function editChamCong(maNV) {
    openChamCongModal(maNV);
}

function deleteChamCong(maNV) {
    if (confirm('Bạn có chắc chắn muốn xóa bảng chấm công này?')) {
        chamCongData = chamCongData.filter(c => !(c.maNV === maNV && c.thang === currentMonth));
        renderChamCongTable();
        showToast('Xóa chấm công thành công!');
    }
}

function renderChamCongTable() {
    const filteredData = chamCongData.filter(c => c.thang === currentMonth);
    const tbody = document.getElementById('chamcongTableBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Chưa có dữ liệu chấm công cho tháng này</td></tr>';
        return;
    }

    tbody.innerHTML = filteredData.map(cc => `
        <tr>
            <td>${cc.maNV}</td>
            <td>${cc.hoTen}</td>
            <td>${cc.soNgayCong}</td>
            <td>${cc.soGioLam}</td>
            <td>${cc.diMuon}</td>
            <td>${cc.veSom}</td>
            <td>${cc.nghiPhep}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editChamCong('${cc.maNV}')">Sửa</button>
                <button class="action-btn btn-delete" onclick="deleteChamCong('${cc.maNV}')">Xóa</button>
            </td>
        </tr>
    `).join('');
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
    const modal = document.getElementById('chamCongModal');
    if (event.target == modal) {
        closeChamCongModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderChamCongTable();
});
