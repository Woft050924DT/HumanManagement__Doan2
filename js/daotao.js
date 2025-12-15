let daoTAoData = [
    { ma: 'DT001', ten: 'Kỹ năng lãnh đạo', giangVien: 'Nguyễn Văn X', ngayBatDau: '2025-10-15', ngayKetThuc: '2025-10-20', soHocVien: 20, moTa: '', trangThai: 'ongoing' },
    { ma: 'DT002', ten: 'Quản lý dự án', giangVien: 'Trần Thị Y', ngayBatDau: '2025-11-01', ngayKetThuc: '2025-11-05', soHocVien: 15, moTa: '', trangThai: 'upcoming' },
    { ma: 'DT003', ten: 'Kỹ năng giao tiếp', giangVien: 'Lê Văn Z', ngayBatDau: '2025-09-20', ngayKetThuc: '2025-09-25', soHocVien: 25, moTa: '', trangThai: 'completed' }
];
let editingDaoTaoId = null;

function updateTrangThai() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    daoTAoData.forEach(dt => {
        const startDate = new Date(dt.ngayBatDau);
        const endDate = new Date(dt.ngayKetThuc);
        
        if (today < startDate) {
            dt.trangThai = 'upcoming';
        } else if (today >= startDate && today <= endDate) {
            dt.trangThai = 'ongoing';
        } else {
            dt.trangThai = 'completed';
        }
    });
}

function openDaoTaoModal(id = null) {
    editingDaoTaoId = id;
    const modal = document.getElementById('daoTaoModal');
    const form = document.getElementById('daoTaoForm');
    const title = document.getElementById('daoTaoModalTitle');
    
    if (id) {
        title.textContent = 'Sửa khóa đào tạo';
        const dt = daoTAoData.find(d => d.ma === id);
        if (dt) {
            document.getElementById('maKhoaHoc').value = dt.ma;
            document.getElementById('tenKhoaHoc').value = dt.ten;
            document.getElementById('giangVien').value = dt.giangVien;
            document.getElementById('ngayBatDau').value = dt.ngayBatDau;
            document.getElementById('ngayKetThuc').value = dt.ngayKetThuc;
            document.getElementById('soHocVien').value = dt.soHocVien;
            document.getElementById('moTaKhoaHoc').value = dt.moTa || '';
            document.getElementById('maKhoaHoc').disabled = true;
        }
    } else {
        title.textContent = 'Thêm khóa đào tạo mới';
        form.reset();
        document.getElementById('maKhoaHoc').disabled = false;
    }
    modal.classList.add('show');
}

function closeDaoTaoModal() {
    document.getElementById('daoTaoModal').classList.remove('show');
    document.getElementById('daoTaoForm').reset();
    editingDaoTaoId = null;
}

function saveDaoTao() {
    const ma = document.getElementById('maKhoaHoc').value;
    const ten = document.getElementById('tenKhoaHoc').value;
    const giangVien = document.getElementById('giangVien').value;
    const ngayBatDau = document.getElementById('ngayBatDau').value;
    const ngayKetThuc = document.getElementById('ngayKetThuc').value;
    const soHocVien = parseInt(document.getElementById('soHocVien').value);
    const moTa = document.getElementById('moTaKhoaHoc').value;

    if (!ma || !ten || !giangVien || !ngayBatDau || !ngayKetThuc || !soHocVien) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    if (new Date(ngayKetThuc) < new Date(ngayBatDau)) {
        showToast('Ngày kết thúc phải sau ngày bắt đầu!', 'error');
        return;
    }

    // Determine status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(ngayBatDau);
    const endDate = new Date(ngayKetThuc);
    let trangThai = 'upcoming';
    if (today >= startDate && today <= endDate) {
        trangThai = 'ongoing';
    } else if (today > endDate) {
        trangThai = 'completed';
    }

    const daoTAoItem = { ma, ten, giangVien, ngayBatDau, ngayKetThuc, soHocVien, moTa, trangThai };

    if (editingDaoTaoId) {
        const index = daoTAoData.findIndex(d => d.ma === editingDaoTaoId);
        if (index !== -1) {
            daoTAoData[index] = daoTAoItem;
            showToast('Cập nhật khóa đào tạo thành công!');
        }
    } else {
        if (daoTAoData.find(d => d.ma === ma)) {
            showToast('Mã khóa học đã tồn tại!', 'error');
            return;
        }
        daoTAoData.push(daoTAoItem);
        showToast('Thêm khóa đào tạo thành công!');
    }

    updateTrangThai();
    renderDaoTaoTable();
    closeDaoTaoModal();
}

function viewDaoTao(ma) {
    const dt = daoTAoData.find(d => d.ma === ma);
    if (!dt) return;

    document.getElementById('daoTaoDetailTitle').textContent = 'Chi tiết khóa đào tạo: ' + dt.ten;
    
    const body = document.getElementById('daoTaoDetailBody');
    const statusText = dt.trangThai === 'ongoing' ? 'Đang diễn ra' : dt.trangThai === 'upcoming' ? 'Sắp diễn ra' : 'Đã hoàn thành';
    
    body.innerHTML = `
        <div style="line-height: 1.8;">
            <p><strong>Mã khóa học:</strong> ${dt.ma}</p>
            <p><strong>Tên khóa học:</strong> ${dt.ten}</p>
            <p><strong>Giảng viên:</strong> ${dt.giangVien}</p>
            <p><strong>Thời gian:</strong> ${formatDate(dt.ngayBatDau)} - ${formatDate(dt.ngayKetThuc)}</p>
            <p><strong>Số học viên:</strong> ${dt.soHocVien}</p>
            <p><strong>Trạng thái:</strong> ${statusText}</p>
            ${dt.moTa ? '<p><strong>Mô tả:</strong> ' + dt.moTa + '</p>' : ''}
            ${dt.trangThai === 'completed' ? `
                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
                    <h3 style="margin-bottom: 10px;">Kết quả khóa học:</h3>
                    <p><strong>Số học viên tham gia:</strong> ${dt.soHocVien}</p>
                    <p><strong>Số học viên hoàn thành:</strong> ${dt.soHocVien}</p>
                    <p><strong>Tỷ lệ hoàn thành:</strong> 100%</p>
                    <p><strong>Đánh giá trung bình:</strong> 4.5/5.0 ⭐</p>
                </div>
            ` : ''}
        </div>
    `;

    const footer = document.getElementById('daoTaoDetailFooter');
    footer.innerHTML = `
        <button type="button" class="btn btn-secondary" onclick="closeDaoTaoDetailModal()">Đóng</button>
        ${dt.trangThai !== 'completed' ? `<button type="button" class="btn btn-primary" onclick="editFromView('${ma}')">Sửa</button>` : ''}
    `;

    document.getElementById('daoTaoDetailModal').classList.add('show');
}

function editFromView(ma) {
    closeDaoTaoDetailModal();
    setTimeout(() => openDaoTaoModal(ma), 300);
}

function closeDaoTaoDetailModal() {
    document.getElementById('daoTaoDetailModal').classList.remove('show');
}

function renderDaoTaoTable() {
    updateTrangThai();
    const tbody = document.getElementById('daotaoTableBody');
    tbody.innerHTML = daoTAoData.map(dt => {
        const statusClass = dt.trangThai === 'ongoing' ? 'status-ongoing' : dt.trangThai === 'upcoming' ? 'status-upcoming' : 'status-completed';
        const statusText = dt.trangThai === 'ongoing' ? 'Đang diễn ra' : dt.trangThai === 'upcoming' ? 'Sắp diễn ra' : 'Đã hoàn thành';
        const buttonText = dt.trangThai === 'completed' ? 'Xem kết quả' : 'Chi tiết';
        return `
            <tr>
                <td>${dt.ma}</td>
                <td>${dt.ten}</td>
                <td>${dt.giangVien}</td>
                <td>${formatDate(dt.ngayBatDau)} - ${formatDate(dt.ngayKetThuc)}</td>
                <td>${dt.soHocVien}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn btn-edit" onclick="viewDaoTao('${dt.ma}')">${buttonText}</button>
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
    const modals = ['daoTaoModal', 'daoTaoDetailModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target == modal) {
            if (modalId === 'daoTaoModal') closeDaoTaoModal();
            else closeDaoTaoDetailModal();
        }
    });
}

// Initial render
// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateTrangThai();
    renderDaoTaoTable();
});
