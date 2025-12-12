let khenThuongData = [
    { ma: 'KT001', nhanVien: 'Nguyễn Văn A', loai: 'Khen thưởng', lyDo: 'Hoàn thành xuất sắc dự án', giaTri: 5000000, ngay: '2025-09-15' },
    { ma: 'KT002', nhanVien: 'Trần Thị B', loai: 'Khen thưởng', lyDo: 'Nhân viên xuất sắc tháng', giaTri: 3000000, ngay: '2025-10-01' }
];
let editingKhenThuongId = null;

function openKhenThuongModal(id = null) {
    editingKhenThuongId = id;
    const modal = document.getElementById('khenThuongModal');
    const form = document.getElementById('khenThuongForm');
    const title = document.getElementById('khenThuongModalTitle');
    
    if (id) {
        title.textContent = 'Sửa khen thưởng';
        const kt = khenThuongData.find(k => k.ma === id);
        if (kt) {
            document.getElementById('maKT').value = kt.ma;
            document.getElementById('nhanVien').value = kt.nhanVien;
            document.getElementById('loai').value = kt.loai;
            document.getElementById('lyDo').value = kt.lyDo;
            document.getElementById('giaTri').value = kt.giaTri;
            document.getElementById('ngayKT').value = kt.ngay;
            document.getElementById('maKT').disabled = true;
        }
    } else {
        title.textContent = 'Thêm khen thưởng mới';
        form.reset();
        document.getElementById('maKT').disabled = false;
        document.getElementById('ngayKT').value = new Date().toISOString().split('T')[0];
    }
    modal.classList.add('show');
}

function closeKhenThuongModal() {
    document.getElementById('khenThuongModal').classList.remove('show');
    document.getElementById('khenThuongForm').reset();
    editingKhenThuongId = null;
}

function saveKhenThuong() {
    const ma = document.getElementById('maKT').value;
    const nhanVien = document.getElementById('nhanVien').value;
    const loai = document.getElementById('loai').value;
    const lyDo = document.getElementById('lyDo').value;
    const giaTri = parseFloat(document.getElementById('giaTri').value);
    const ngay = document.getElementById('ngayKT').value;

    if (!ma || !nhanVien || !loai || !lyDo || !giaTri || !ngay) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    const khenThuongItem = { ma, nhanVien, loai, lyDo, giaTri, ngay };

    if (editingKhenThuongId) {
        const index = khenThuongData.findIndex(k => k.ma === editingKhenThuongId);
        if (index !== -1) {
            khenThuongData[index] = khenThuongItem;
            showToast('Cập nhật khen thưởng thành công!');
        }
    } else {
        if (khenThuongData.find(k => k.ma === ma)) {
            showToast('Mã khen thưởng đã tồn tại!', 'error');
            return;
        }
        khenThuongData.push(khenThuongItem);
        showToast('Thêm khen thưởng thành công!');
    }

    renderKhenThuongTable();
    closeKhenThuongModal();
}

function editKhenThuong(ma) {
    openKhenThuongModal(ma);
}

function deleteKhenThuong(ma) {
    if (confirm('Bạn có chắc chắn muốn xóa khen thưởng này?')) {
        khenThuongData = khenThuongData.filter(k => k.ma !== ma);
        renderKhenThuongTable();
        showToast('Xóa khen thưởng thành công!');
    }
}

function renderKhenThuongTable() {
    const tbody = document.getElementById('khenthuongTableBody');
    tbody.innerHTML = khenThuongData.map(kt => {
        const badgeClass = kt.loai === 'Khen thưởng' ? 'status-reward' : kt.loai === 'Kỷ luật' ? 'status-discipline' : 'status-recognition';
        return `
            <tr>
                <td>${kt.ma}</td>
                <td>${kt.nhanVien}</td>
                <td><span class="status-badge ${badgeClass}">${kt.loai}</span></td>
                <td>${kt.lyDo}</td>
                <td>${formatCurrency(kt.giaTri)} VNĐ</td>
                <td>${formatDate(kt.ngay)}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editKhenThuong('${kt.ma}')">Sửa</button>
                    <button class="action-btn btn-delete" onclick="deleteKhenThuong('${kt.ma}')">Xóa</button>
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
    const modal = document.getElementById('khenThuongModal');
    if (event.target == modal) {
        closeKhenThuongModal();
    }
}

// Initial render
renderKhenThuongTable();
