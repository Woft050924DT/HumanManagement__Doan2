// Data storage (in real app, this would be API calls)
let phongBanData = [
    { ma: 'PB001', ten: 'Phòng Kỹ thuật', truongPhong: 'Nguyễn Văn A', soNV: 25 },
    { ma: 'PB002', ten: 'Phòng Nhân sự', truongPhong: 'Trần Thị B', soNV: 10 },
    { ma: 'PB003', ten: 'Phòng Kinh doanh', truongPhong: 'Lê Văn C', soNV: 15 }
];
let editingPhongBanId = null;

function openPhongBanModal(id = null) {
    editingPhongBanId = id;
    const modal = document.getElementById('phongBanModal');
    const form = document.getElementById('phongBanForm');
    const title = document.getElementById('phongBanModalTitle');
    
    if (id) {
        title.textContent = 'Sửa phòng ban';
        const pb = phongBanData.find(p => p.ma === id);
        document.getElementById('maPhongBan').value = pb.ma;
        document.getElementById('tenPhongBan').value = pb.ten;
        document.getElementById('truongPhong').value = pb.truongPhong;
        document.getElementById('soNhanVien').value = pb.soNV;
        document.getElementById('maPhongBan').disabled = true;
    } else {
        title.textContent = 'Thêm phòng ban mới';
        form.reset();
        document.getElementById('maPhongBan').disabled = false;
    }
    modal.classList.add('show');
}

function closePhongBanModal() {
    document.getElementById('phongBanModal').classList.remove('show');
    document.getElementById('phongBanForm').reset();
    editingPhongBanId = null;
}

function savePhongBan() {
    const ma = document.getElementById('maPhongBan').value;
    const ten = document.getElementById('tenPhongBan').value;
    const truongPhong = document.getElementById('truongPhong').value;
    const soNV = parseInt(document.getElementById('soNhanVien').value) || 0;

    if (!ma || !ten || !truongPhong) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    if (editingPhongBanId) {
        // Update
        const index = phongBanData.findIndex(p => p.ma === editingPhongBanId);
        if (index !== -1) {
            phongBanData[index] = { ma, ten, truongPhong, soNV };
            showToast('Cập nhật phòng ban thành công!');
        }
    } else {
        // Check duplicate
        if (phongBanData.find(p => p.ma === ma)) {
            showToast('Mã phòng ban đã tồn tại!', 'error');
            return;
        }
        phongBanData.push({ ma, ten, truongPhong, soNV });
        showToast('Thêm phòng ban thành công!');
    }

    renderPhongBanTable();
    closePhongBanModal();
}

function editPhongBan(ma, ten, truongPhong, soNV) {
    openPhongBanModal(ma);
}

function deletePhongBan(ma) {
    if (confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
        phongBanData = phongBanData.filter(p => p.ma !== ma);
        renderPhongBanTable();
        showToast('Xóa phòng ban thành công!');
    }
}

function renderPhongBanTable() {
    const tbody = document.getElementById('phongbanTableBody');
    tbody.innerHTML = phongBanData.map(pb => `
        <tr>
            <td>${pb.ma}</td>
            <td>${pb.ten}</td>
            <td>${pb.truongPhong}</td>
            <td>${pb.soNV}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editPhongBan('${pb.ma}', '${pb.ten}', '${pb.truongPhong}', ${pb.soNV})">Sửa</button>
                <button class="action-btn btn-delete" onclick="deletePhongBan('${pb.ma}')">Xóa</button>
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('phongBanModal');
    if (event.target == modal) {
        closePhongBanModal();
    }
}
