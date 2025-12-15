let hopDongData = [
    { ma: 'HD001', nhanVien: 'Nguyễn Văn A', loai: 'khongthoi', thoiHan: null, ngayBatDau: '2020-01-01', ngayKetThuc: null, luong: 15000000, ghiChu: '', trangThai: 'active' },
    { ma: 'HD002', nhanVien: 'Trần Thị B', loai: 'cothoi', thoiHan: 2, ngayBatDau: '2023-03-01', ngayKetThuc: '2025-03-01', luong: 12000000, ghiChu: '', trangThai: 'warning' }
];
let editingHopDongId = null;
let modalMode = 'add'; // 'add', 'view', 'extend'

function openHopDongModal(id = null) {
    editingHopDongId = id;
    modalMode = id ? 'edit' : 'add';
    const modal = document.getElementById('hopDongModal');
    const form = document.getElementById('hopDongForm');
    const title = document.getElementById('hopDongModalTitle');
    
    if (id) {
        title.textContent = 'Sửa hợp đồng';
        const hd = hopDongData.find(h => h.ma === id);
        document.getElementById('maHopDong').value = hd.ma;
        document.getElementById('nhanVien').value = hd.nhanVien;
        document.getElementById('loaiHopDong').value = hd.loai;
        document.getElementById('ngayBatDau').value = hd.ngayBatDau;
        document.getElementById('luongCoBan').value = hd.luong;
        document.getElementById('ghiChu').value = hd.ghiChu;
        document.getElementById('maHopDong').disabled = true;
        toggleNgayKetThuc();
        if (hd.loai === 'cothoi') {
            document.getElementById('thoiHanNam').value = hd.thoiHan || 2;
            document.getElementById('ngayKetThuc').value = hd.ngayKetThuc || '';
        }
    } else {
        title.textContent = 'Thêm hợp đồng mới';
        form.reset();
        document.getElementById('maHopDong').disabled = false;
        document.getElementById('thoiHanNam').style.display = 'none';
        document.getElementById('ngayKetThucGroup').style.display = 'none';
    }
    modal.classList.add('show');
    
    // Setup event listeners when modal opens
    const ngayBatDauEl = document.getElementById('ngayBatDau');
    const thoiHanNamEl = document.getElementById('thoiHanNam');
    
    // Remove old listeners if any
    const newNgayBatDau = ngayBatDauEl.cloneNode(true);
    ngayBatDauEl.parentNode.replaceChild(newNgayBatDau, ngayBatDauEl);
    
    const newThoiHanNam = thoiHanNamEl.cloneNode(true);
    thoiHanNamEl.parentNode.replaceChild(newThoiHanNam, thoiHanNamEl);
    
    // Add new listeners
    document.getElementById('ngayBatDau').addEventListener('change', function() {
        if (document.getElementById('loaiHopDong').value === 'cothoi') {
            calculateNgayKetThuc();
        }
    });

    document.getElementById('thoiHanNam').addEventListener('change', calculateNgayKetThuc);
}

function toggleNgayKetThuc() {
    const loai = document.getElementById('loaiHopDong').value;
    const ngayKetThucGroup = document.getElementById('ngayKetThucGroup');
    const thoiHanNam = document.getElementById('thoiHanNam');
    
    if (loai === 'cothoi') {
        ngayKetThucGroup.style.display = 'block';
        thoiHanNam.style.display = 'block';
        calculateNgayKetThuc();
    } else {
        ngayKetThucGroup.style.display = 'none';
        thoiHanNam.style.display = 'none';
    }
}

function calculateNgayKetThuc() {
    const ngayBatDau = document.getElementById('ngayBatDau').value;
    const thoiHanNam = parseInt(document.getElementById('thoiHanNam').value) || 2;
    if (ngayBatDau) {
        const date = new Date(ngayBatDau);
        date.setFullYear(date.getFullYear() + thoiHanNam);
        document.getElementById('ngayKetThuc').value = date.toISOString().split('T')[0];
    }
}

function closeHopDongModal() {
    document.getElementById('hopDongModal').classList.remove('show');
    document.getElementById('hopDongForm').reset();
    editingHopDongId = null;
}

function saveHopDong() {
    const ma = document.getElementById('maHopDong').value;
    const nhanVien = document.getElementById('nhanVien').value;
    const loai = document.getElementById('loaiHopDong').value;
    const ngayBatDau = document.getElementById('ngayBatDau').value;
    const ngayKetThuc = document.getElementById('ngayKetThuc').value;
    const luong = parseInt(document.getElementById('luongCoBan').value);
    const ghiChu = document.getElementById('ghiChu').value;
    const thoiHan = loai === 'cothoi' ? parseInt(document.getElementById('thoiHanNam').value) : null;

    if (!ma || !nhanVien || !loai || !ngayBatDau || !luong) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    // Check status
    let trangThai = 'active';
    if (ngayKetThuc) {
        const today = new Date();
        const endDate = new Date(ngayKetThuc);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 30 && diffDays > 0) {
            trangThai = 'warning';
        } else if (diffDays <= 0) {
            trangThai = 'expired';
        }
    }

    if (editingHopDongId) {
        const index = hopDongData.findIndex(h => h.ma === editingHopDongId);
        if (index !== -1) {
            hopDongData[index] = { ma, nhanVien, loai, thoiHan, ngayBatDau, ngayKetThuc: ngayKetThuc || null, luong, ghiChu, trangThai };
            showToast('Cập nhật hợp đồng thành công!');
        }
    } else {
        if (hopDongData.find(h => h.ma === ma)) {
            showToast('Mã hợp đồng đã tồn tại!', 'error');
            return;
        }
        hopDongData.push({ ma, nhanVien, loai, thoiHan, ngayBatDau, ngayKetThuc: ngayKetThuc || null, luong, ghiChu, trangThai });
        showToast('Thêm hợp đồng thành công!');
    }

    renderHopDongTable();
    closeHopDongModal();
}

function viewHopDong(ma) {
    const hd = hopDongData.find(h => h.ma === ma);
    if (!hd) return;

    modalMode = 'view';
    document.getElementById('hopDongDetailTitle').textContent = 'Chi tiết hợp đồng ' + ma;
    
    const body = document.getElementById('hopDongDetailBody');
    body.innerHTML = `
        <div style="line-height: 1.8;">
            <p><strong>Mã hợp đồng:</strong> ${hd.ma}</p>
            <p><strong>Nhân viên:</strong> ${hd.nhanVien}</p>
            <p><strong>Loại hợp đồng:</strong> ${hd.loai === 'cothoi' ? 'Có thời hạn (' + hd.thoiHan + ' năm)' : 'Không thời hạn'}</p>
            <p><strong>Ngày bắt đầu:</strong> ${formatDate(hd.ngayBatDau)}</p>
            <p><strong>Ngày kết thúc:</strong> ${hd.ngayKetThuc ? formatDate(hd.ngayKetThuc) : '-'}</p>
            <p><strong>Lương cơ bản:</strong> ${formatCurrency(hd.luong)} VNĐ</p>
            <p><strong>Trạng thái:</strong> ${getStatusText(hd.trangThai)}</p>
            ${hd.ghiChu ? '<p><strong>Ghi chú:</strong> ' + hd.ghiChu + '</p>' : ''}
        </div>
    `;

    const footer = document.getElementById('hopDongDetailFooter');
    footer.innerHTML = `
        <button type="button" class="btn btn-secondary" onclick="closeHopDongDetailModal()">Đóng</button>
        <button type="button" class="btn btn-primary" onclick="editFromView('${ma}')">Sửa</button>
    `;

    document.getElementById('hopDongDetailModal').classList.add('show');
}

function editFromView(ma) {
    closeHopDongDetailModal();
    setTimeout(() => openHopDongModal(ma), 300);
}

function extendHopDong(ma) {
    const hd = hopDongData.find(h => h.ma === ma);
    if (!hd) return;

    modalMode = 'extend';
    document.getElementById('hopDongDetailTitle').textContent = 'Gia hạn hợp đồng ' + ma;
    
    const body = document.getElementById('hopDongDetailBody');
    body.innerHTML = `
        <div style="line-height: 1.8; margin-bottom: 20px;">
            <p><strong>Hợp đồng hiện tại:</strong></p>
            <p>Ngày bắt đầu: ${formatDate(hd.ngayBatDau)}</p>
            <p>Ngày kết thúc: ${formatDate(hd.ngayKetThuc)}</p>
        </div>
        <form id="extendForm">
            <div class="form-group">
                <label for="extendYears">Gia hạn thêm (năm) *</label>
                <input type="number" id="extendYears" min="1" max="5" value="2" required>
            </div>
            <div class="form-group">
                <label for="newEndDate">Ngày kết thúc mới</label>
                <input type="date" id="newEndDate" readonly style="background: #f5f5f5;">
            </div>
        </form>
    `;

    const extendYears = document.getElementById('extendYears');
    extendYears.addEventListener('change', function() {
        if (hd.ngayKetThuc) {
            const date = new Date(hd.ngayKetThuc);
            date.setFullYear(date.getFullYear() + parseInt(extendYears.value));
            document.getElementById('newEndDate').value = date.toISOString().split('T')[0];
        }
    });
    extendYears.dispatchEvent(new Event('change'));

    const footer = document.getElementById('hopDongDetailFooter');
    footer.innerHTML = `
        <button type="button" class="btn btn-secondary" onclick="closeHopDongDetailModal()">Hủy</button>
        <button type="button" class="btn btn-success" onclick="saveExtend('${ma}')">Gia hạn</button>
    `;

    document.getElementById('hopDongDetailModal').classList.add('show');
}

function saveExtend(ma) {
    const extendYears = parseInt(document.getElementById('extendYears').value);
    const hd = hopDongData.find(h => h.ma === ma);
    if (hd && hd.ngayKetThuc) {
        const date = new Date(hd.ngayKetThuc);
        date.setFullYear(date.getFullYear() + extendYears);
        hd.ngayKetThuc = date.toISOString().split('T')[0];
        hd.thoiHan = (hd.thoiHan || 0) + extendYears;
        hd.trangThai = 'active';
        renderHopDongTable();
        closeHopDongDetailModal();
        showToast('Gia hạn hợp đồng thành công!');
    }
}

function closeHopDongDetailModal() {
    document.getElementById('hopDongDetailModal').classList.remove('show');
}

function renderHopDongTable() {
    const tbody = document.getElementById('hopdongTableBody');
    tbody.innerHTML = hopDongData.map(hd => {
        const loaiText = hd.loai === 'cothoi' ? `Có thời hạn ${hd.thoiHan} năm` : 'Không thời hạn';
        const statusClass = hd.trangThai === 'active' ? 'status-active' : hd.trangThai === 'warning' ? 'status-warning' : 'status-expired';
        const statusText = hd.trangThai === 'active' ? 'Đang hiệu lực' : hd.trangThai === 'warning' ? 'Sắp hết hạn' : 'Đã hết hạn';
        return `
            <tr>
                <td>${hd.ma}</td>
                <td>${hd.nhanVien}</td>
                <td>${loaiText}</td>
                <td>${formatDate(hd.ngayBatDau)}</td>
                <td>${hd.ngayKetThuc ? formatDate(hd.ngayKetThuc) : '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn btn-edit" onclick="viewHopDong('${hd.ma}')">Xem</button>
                    ${hd.trangThai === 'warning' || hd.trangThai === 'expired' ? `<button class="action-btn btn-success" onclick="extendHopDong('${hd.ma}')">Gia hạn</button>` : ''}
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

function getStatusText(status) {
    const statusMap = { active: 'Đang hiệu lực', warning: 'Sắp hết hạn', expired: 'Đã hết hạn' };
    return statusMap[status] || status;
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
    const modals = ['hopDongModal', 'hopDongDetailModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target == modal) {
            if (modalId === 'hopDongModal') closeHopDongModal();
            else closeHopDongDetailModal();
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderHopDongTable();
});
