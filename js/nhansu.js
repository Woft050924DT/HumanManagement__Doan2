const hoSoData = [
    {
        ma: 'NV001',
        hoTen: 'Nguyễn Văn A',
        cmnd: '001234567890',
        ngaySinh: '1990-05-15',
        gioiTinh: 'Nam',
        diaChi: '123 Đường ABC, Quận 1, TP.HCM',
        soDienThoai: '0912345678',
        email: 'nva@company.com',
        trinhDo: 'Đại học',
        chuyenNganh: 'Công nghệ thông tin',
        truong: 'Đại học Bách Khoa',
        namTotNghiep: '2012',
        kinhNghiem: '5 năm',
        tinhTrangHonNhan: 'Đã kết hôn',
        ngayVaoLam: '2020-01-01',
        phongBan: 'Kỹ thuật',
        chucVu: 'Trưởng phòng',
        luong: 25000000
    },
    {
        ma: 'NV002',
        hoTen: 'Trần Thị B',
        cmnd: '001234567891',
        ngaySinh: '1992-08-20',
        gioiTinh: 'Nữ',
        diaChi: '456 Đường XYZ, Quận 2, TP.HCM',
        soDienThoai: '0912345679',
        email: 'ttb@company.com',
        trinhDo: 'Thạc sĩ',
        chuyenNganh: 'Quản trị nhân sự',
        truong: 'Đại học Kinh tế',
        namTotNghiep: '2016',
        kinhNghiem: '3 năm',
        tinhTrangHonNhan: 'Độc thân',
        ngayVaoLam: '2021-03-15',
        phongBan: 'Nhân sự',
        chucVu: 'Nhân viên',
        luong: 15000000
    },
    {
        ma: 'NV003',
        hoTen: 'Lê Văn C',
        cmnd: '001234567892',
        ngaySinh: '1988-03-10',
        gioiTinh: 'Nam',
        diaChi: '789 Đường DEF, Quận 3, TP.HCM',
        soDienThoai: '0912345680',
        email: 'lvc@company.com',
        trinhDo: 'Tiến sĩ',
        chuyenNganh: 'Quản trị kinh doanh',
        truong: 'Đại học Quốc gia',
        namTotNghiep: '2015',
        kinhNghiem: '10 năm',
        tinhTrangHonNhan: 'Đã kết hôn',
        ngayVaoLam: '2018-06-01',
        phongBan: 'Kinh doanh',
        chucVu: 'Giám đốc',
        luong: 50000000
    }
];

function viewHoSo(ma) {
    const hs = hoSoData.find(h => h.ma === ma);
    if (!hs) return;

    document.getElementById('hoSoModalTitle').textContent = `Hồ sơ nhân sự - ${hs.hoTen}`;
    
    const body = document.getElementById('hoSoModalBody');
    body.innerHTML = `
        <div style="line-height: 1.8;">
            <h3 style="color: #667eea; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e1e1e1;">Thông tin cá nhân</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                <div>
                    <p><strong>Mã nhân viên:</strong> ${hs.ma}</p>
                    <p><strong>Họ tên:</strong> ${hs.hoTen}</p>
                    <p><strong>CMND/CCCD:</strong> ${hs.cmnd}</p>
                    <p><strong>Ngày sinh:</strong> ${formatDate(hs.ngaySinh)}</p>
                    <p><strong>Giới tính:</strong> ${hs.gioiTinh}</p>
                </div>
                <div>
                    <p><strong>Số điện thoại:</strong> ${hs.soDienThoai}</p>
                    <p><strong>Email:</strong> ${hs.email}</p>
                    <p><strong>Tình trạng hôn nhân:</strong> ${hs.tinhTrangHonNhan}</p>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <p><strong>Địa chỉ:</strong> ${hs.diaChi}</p>
            </div>

            <h3 style="color: #667eea; margin: 25px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e1e1e1;">Thông tin học vấn</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                <div>
                    <p><strong>Trình độ:</strong> ${hs.trinhDo}</p>
                    <p><strong>Chuyên ngành:</strong> ${hs.chuyenNganh}</p>
                </div>
                <div>
                    <p><strong>Trường:</strong> ${hs.truong}</p>
                    <p><strong>Năm tốt nghiệp:</strong> ${hs.namTotNghiep}</p>
                </div>
            </div>

            <h3 style="color: #667eea; margin: 25px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e1e1e1;">Thông tin công việc</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                <div>
                    <p><strong>Phòng ban:</strong> ${hs.phongBan}</p>
                    <p><strong>Chức vụ:</strong> ${hs.chucVu}</p>
                </div>
                <div>
                    <p><strong>Ngày vào làm:</strong> ${formatDate(hs.ngayVaoLam)}</p>
                    <p><strong>Kinh nghiệm:</strong> ${hs.kinhNghiem}</p>
                </div>
            </div>
            <div>
                <p><strong>Lương cơ bản:</strong> <span style="font-size: 18px; color: #667eea; font-weight: bold;">${formatCurrency(hs.luong)} VNĐ</span></p>
            </div>
        </div>
    `;

    document.getElementById('hoSoModal').classList.add('show');
}

function closeHoSoModal() {
    document.getElementById('hoSoModal').classList.remove('show');
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

window.onclick = function(event) {
    const modal = document.getElementById('hoSoModal');
    if (event.target == modal) {
        closeHoSoModal();
    }
}
