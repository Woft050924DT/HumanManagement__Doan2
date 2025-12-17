// Dữ liệu nhân viên - đã được định nghĩa trong data/mockData.js
let editingNhanVienId = null;

function openNhanVienModal(id = null) {
    editingNhanVienId = id;
    const modal = document.getElementById('nhanVienModal');
    const form = document.getElementById('nhanVienForm');
    const title = document.getElementById('nhanVienModalTitle');
    
    if (id) {
        title.textContent = 'Sửa thông tin nhân viên';
        const nv = nhanVienData.find(n => n.ma === id);
        if (nv) {
            document.getElementById('maNV').value = nv.ma;
            document.getElementById('hoTen').value = nv.hoTen;
            document.getElementById('ngaySinh').value = nv.ngaySinh;
            document.getElementById('phongBan').value = nv.phongBan;
            document.getElementById('chucVu').value = nv.chucVu;
            document.getElementById('email').value = nv.email;
            document.getElementById('soDienThoai').value = nv.soDienThoai || '';
            document.getElementById('diaChi').value = nv.diaChi || '';
            document.getElementById('trangThai').value = nv.trangThai;
            document.getElementById('maNV').disabled = true;
        }
    } else {
        title.textContent = 'Thêm nhân viên mới';
        form.reset();
        document.getElementById('maNV').disabled = false;
    }
    modal.classList.add('show');
}

function closeNhanVienModal() {
    document.getElementById('nhanVienModal').classList.remove('show');
    document.getElementById('nhanVienForm').reset();
    editingNhanVienId = null;
}

function saveNhanVien() {
    const ma = document.getElementById('maNV').value;
    const hoTen = document.getElementById('hoTen').value;
    const ngaySinh = document.getElementById('ngaySinh').value;
    const phongBan = document.getElementById('phongBan').value;
    const chucVu = document.getElementById('chucVu').value;
    const email = document.getElementById('email').value;
    const soDienThoai = document.getElementById('soDienThoai').value;
    const diaChi = document.getElementById('diaChi').value;
    const trangThai = document.getElementById('trangThai').value;

    if (!ma || !hoTen || !ngaySinh || !phongBan || !chucVu || !email || !trangThai) {
        showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
        return;
    }

    const nhanVienItem = { ma, hoTen, ngaySinh, phongBan, chucVu, email, soDienThoai, diaChi, trangThai };

    if (editingNhanVienId) {
        const index = nhanVienData.findIndex(n => n.ma === editingNhanVienId);
        if (index !== -1) {
            nhanVienData[index] = nhanVienItem;
            showToast('Cập nhật nhân viên thành công!');
        }
    } else {
        if (nhanVienData.find(n => n.ma === ma)) {
            showToast('Mã nhân viên đã tồn tại!', 'error');
            return;
        }
        nhanVienData.push(nhanVienItem);
        showToast('Thêm nhân viên thành công!');
    }

    renderNhanVienTable();
    closeNhanVienModal();
}

function editNhanVien(ma) {
    openNhanVienModal(ma);
}

function deleteNhanVien(ma) {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        nhanVienData = nhanVienData.filter(n => n.ma !== ma);
        renderNhanVienTable();
        showToast('Xóa nhân viên thành công!');
    }
}

function renderNhanVienTable() {
    const tbody = document.getElementById('nhanvienTableBody');
    tbody.innerHTML = nhanVienData.map(nv => {
        const statusClass = nv.trangThai === 'Đang làm việc' ? 'status-active' : nv.trangThai === 'Nghỉ phép' ? 'status-warning' : 'status-inactive';
        return `
            <tr>
                <td>${nv.ma}</td>
                <td>${nv.hoTen}</td>
                <td>${formatDate(nv.ngaySinh)}</td>
                <td>${nv.phongBan}</td>
                <td>${nv.chucVu}</td>
                <td><span class="status-badge ${statusClass}">${nv.trangThai}</span></td>
                <td>
                    <button class="action-btn btn-edit" onclick="editNhanVien('${nv.ma}')">Sửa</button>
                    <button class="action-btn btn-delete" onclick="deleteNhanVien('${nv.ma}')">Xóa</button>
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
    const modal = document.getElementById('nhanVienModal');
    if (event.target == modal) {
        closeNhanVienModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderNhanVienTable();
});
