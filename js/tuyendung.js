let tuyenDungData = [
    { ma: 'TD001', viTri: 'Lập trình viên Java', phongBan: 'Kỹ thuật', soLuong: 3, ngayDang: '2025-10-01', moTa: '', yeuCau: '', trangThai: 'active' },
    { ma: 'TD002', viTri: 'Nhân viên Marketing', phongBan: 'Marketing', soLuong: 2, ngayDang: '2025-10-05', moTa: '', yeuCau: '', trangThai: 'active' }
];
let editingTuyenDungId = null;

function openTuyenDungModal(id = null) {
    editingTuyenDungId = id;
    const modal = document.getElementById('tuyenDungModal');
    const form = document.getElementById('tuyenDungForm');
    const title = document.getElementById('tuyenDungModalTitle');
    
    if (id) {
        title.textContent = 'Sửa vị trí tuyển dụng';
        const td = tuyenDungData.find(t => t.ma === id);
        if (td) {
            document.getElementById('maTuyenDung').value = td.ma;
            document.getElementById('viTri').value = td.viTri;
            document.getElementById('phongBan').value = td.phongBan;
            document.getElementById('soLuong').value = td.soLuong;
            document.getElementById('ngayDang').value = td.ngayDang;
            document.getElementById('moTa').value = td.moTa || '';
            document.getElementById('yeuCau').value = td.yeuCau || '';
            document.getElementById('maTuyenDung').disabled = true;
        }
    } else {
        title.textContent = 'Thêm vị trí tuyển dụng';
        form.reset();
        document.getElementById('maTuyenDung').disabled = false;
        document.getElementById('ngayDang').value = new Date().toISOString().split('T')[0];
    }
    modal.classList.add('show');
}

function closeTuyenDungModal() {
    document.getElementById('tuyenDungModal').classList.remove('show');
    document.getElementById('tuyenDungForm').reset();
    editingTuyenDungId = null;
}

function saveTuyenDung() {
    const ma = document.getElementById('maTuyenDung').value;
    const viTri = document.getElementById('viTri').value;
    const phongBan = document.getElementById('phongBan').value;
    const soLuong = parseInt(document.getElementById('soLuong').value);
    const ngayDang = document.getElementById('ngayDang').value;
    const moTa = document.getElementById('moTa').value;
    const yeuCau = document.getElementById('yeuCau').value;

    if (!ma || !viTri || !phongBan || !soLuong || !ngayDang) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    const tuyenDungItem = { ma, viTri, phongBan, soLuong, ngayDang, moTa, yeuCau, trangThai: 'active' };

    if (editingTuyenDungId) {
        const index = tuyenDungData.findIndex(t => t.ma === editingTuyenDungId);
        if (index !== -1) {
            tuyenDungItem.trangThai = tuyenDungData[index].trangThai; // Giữ nguyên trạng thái
            tuyenDungData[index] = tuyenDungItem;
            showToast('Cập nhật vị trí tuyển dụng thành công!');
        }
    } else {
        if (tuyenDungData.find(t => t.ma === ma)) {
            showToast('Mã tuyển dụng đã tồn tại!', 'error');
            return;
        }
        tuyenDungData.push(tuyenDungItem);
        showToast('Thêm vị trí tuyển dụng thành công!');
    }

    renderTuyenDungTable();
    closeTuyenDungModal();
}

function editTuyenDung(ma) {
    openTuyenDungModal(ma);
}

function closeTuyenDung(ma) {
    if (confirm('Bạn có chắc chắn muốn đóng vị trí tuyển dụng này?')) {
        const index = tuyenDungData.findIndex(t => t.ma === ma);
        if (index !== -1) {
            tuyenDungData[index].trangThai = 'closed';
            renderTuyenDungTable();
            showToast('Đã đóng vị trí tuyển dụng!');
        }
    }
}

function renderTuyenDungTable() {
    const tbody = document.getElementById('tuyendungTableBody');
    tbody.innerHTML = tuyenDungData.map(td => {
        const statusClass = td.trangThai === 'active' ? 'status-active' : 'status-closed';
        const statusText = td.trangThai === 'active' ? 'Đang tuyển' : 'Đã đóng';
        return `
            <tr>
                <td>${td.ma}</td>
                <td>${td.viTri}</td>
                <td>${td.phongBan}</td>
                <td>${td.soLuong}</td>
                <td>${formatDate(td.ngayDang)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    ${td.trangThai === 'active' ? `
                        <button class="action-btn btn-edit" onclick="editTuyenDung('${td.ma}')">Sửa</button>
                        <button class="action-btn btn-delete" onclick="closeTuyenDung('${td.ma}')">Đóng</button>
                    ` : '<span style="color: #999;">Đã đóng</span>'}
                </td>
            </tr>
        `;
    }).join('');
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
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
    const modal = document.getElementById('tuyenDungModal');
    if (event.target == modal) {
        closeTuyenDungModal();
    }
}

// Initial render
renderTuyenDungTable();
