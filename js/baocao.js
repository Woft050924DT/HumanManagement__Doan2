let baoCaoData = [
    {
        ma: 'BC001',
        loai: 'Báo cáo nhân sự tháng',
        ky: 'Tháng 10/2025',
        nguoiTao: 'Trần Thị B',
        ngayTao: '2025-10-05',
        noiDung: {
            tongNhanVien: 247,
            nhanVienMoi: 8,
            nghiViec: 3,
            theoPhongBan: [
                { phongBan: 'Kỹ thuật', soLuong: 85 },
                { phongBan: 'Marketing', soLuong: 42 },
                { phongBan: 'Kinh doanh', soLuong: 55 },
                { phongBan: 'Nhân sự', soLuong: 25 },
                { phongBan: 'Tài chính', soLuong: 40 }
            ]
        }
    },
    {
        ma: 'BC002',
        loai: 'Báo cáo tuyển dụng',
        ky: 'Quý 3/2025',
        nguoiTao: 'Nguyễn Văn A',
        ngayTao: '2025-10-01',
        noiDung: {
            tongViTri: 15,
            dangTuyen: 8,
            daDong: 7,
            daTuyenDuoc: 12,
            chiTiet: [
                { viTri: 'Lập trình viên Java', soLuong: 3, daTuyen: 3 },
                { viTri: 'Nhân viên Marketing', soLuong: 2, daTuyen: 2 },
                { viTri: 'Chuyên viên Tài chính', soLuong: 1, daTuyen: 1 }
            ]
        }
    },
    {
        ma: 'BC003',
        loai: 'Báo cáo lương thưởng',
        ky: 'Tháng 09/2025',
        nguoiTao: 'Lê Văn C',
        ngayTao: '2025-09-30',
        noiDung: {
            tongLuong: 2400000000,
            tongThuong: 150000000,
            tongKhauTru: 80000000,
            thucChi: 2470000000,
            chiTiet: [
                { phongBan: 'Kỹ thuật', luong: 850000000, thuong: 50000000 },
                { phongBan: 'Marketing', luong: 420000000, thuong: 30000000 },
                { phongBan: 'Kinh doanh', luong: 550000000, thuong: 40000000 }
            ]
        }
    },
    {
        ma: 'BC004',
        loai: 'Báo cáo đào tạo',
        ky: 'Quý 3/2025',
        nguoiTao: 'Trần Thị B',
        ngayTao: '2025-09-28',
        noiDung: {
            tongKhoaHoc: 8,
            hoanThanh: 6,
            dangDienRa: 1,
            sapDienRa: 1,
            tongHocVien: 145,
            chiTiet: [
                { khoaHoc: 'Kỹ năng lãnh đạo', hocVien: 20, hoanThanh: 20 },
                { khoaHoc: 'Quản lý dự án', hocVien: 15, hoanThanh: 15 },
                { khoaHoc: 'Kỹ năng giao tiếp', hocVien: 25, hoanThanh: 25 }
            ]
        }
    }
];
let currentBaoCao = null;

function viewBaoCao(ma) {
    const bc = baoCaoData.find(b => b.ma === ma);
    if (!bc) return;

    currentBaoCao = bc;
    document.getElementById('baoCaoModalTitle').textContent = bc.loai + ' - ' + bc.ky;
    
    const body = document.getElementById('baoCaoModalBody');
    let html = `
        <div style="line-height: 1.8;">
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
                <p><strong>Loại báo cáo:</strong> ${bc.loai}</p>
                <p><strong>Kỳ báo cáo:</strong> ${bc.ky}</p>
                <p><strong>Người tạo:</strong> ${bc.nguoiTao}</p>
                <p><strong>Ngày tạo:</strong> ${formatDate(bc.ngayTao)}</p>
            </div>
    `;

    if (bc.ma === 'BC001') {
        html += `
            <h3 style="margin-bottom: 15px; color: #667eea;">Tổng quan nhân sự</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: #e3f2fd; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng nhân viên</p>
                    <p style="font-size: 24px; font-weight: bold; color: #1976d2;">${bc.noiDung.tongNhanVien}</p>
                </div>
                <div style="padding: 15px; background: #e8f5e9; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Nhân viên mới</p>
                    <p style="font-size: 24px; font-weight: bold; color: #388e3c;">${bc.noiDung.nhanVienMoi}</p>
                </div>
                <div style="padding: 15px; background: #fff3e0; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Nghỉ việc</p>
                    <p style="font-size: 24px; font-weight: bold; color: #f57c00;">${bc.noiDung.nghiViec}</p>
                </div>
            </div>
            <h4 style="margin-bottom: 10px;">Phân bổ theo phòng ban:</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Phòng ban</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Số lượng</th>
                    </tr>
                </thead>
                <tbody>
                    ${bc.noiDung.theoPhongBan.map(pb => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${pb.phongBan}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${pb.soLuong}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else if (bc.ma === 'BC002') {
        html += `
            <h3 style="margin-bottom: 15px; color: #667eea;">Tổng quan tuyển dụng</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: #e3f2fd; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng vị trí</p>
                    <p style="font-size: 24px; font-weight: bold; color: #1976d2;">${bc.noiDung.tongViTri}</p>
                </div>
                <div style="padding: 15px; background: #e8f5e9; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Đang tuyển</p>
                    <p style="font-size: 24px; font-weight: bold; color: #388e3c;">${bc.noiDung.dangTuyen}</p>
                </div>
                <div style="padding: 15px; background: #fff3e0; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Đã tuyển được</p>
                    <p style="font-size: 24px; font-weight: bold; color: #f57c00;">${bc.noiDung.daTuyenDuoc}</p>
                </div>
            </div>
            <h4 style="margin-bottom: 10px;">Chi tiết vị trí:</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Vị trí</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Số lượng cần</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Đã tuyển</th>
                    </tr>
                </thead>
                <tbody>
                    ${bc.noiDung.chiTiet.map(ct => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${ct.viTri}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${ct.soLuong}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${ct.daTuyen}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else if (bc.ma === 'BC003') {
        html += `
            <h3 style="margin-bottom: 15px; color: #667eea;">Tổng quan lương thưởng</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: #e3f2fd; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng lương</p>
                    <p style="font-size: 20px; font-weight: bold; color: #1976d2;">${formatCurrency(bc.noiDung.tongLuong)}</p>
                </div>
                <div style="padding: 15px; background: #e8f5e9; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng thưởng</p>
                    <p style="font-size: 20px; font-weight: bold; color: #388e3c;">${formatCurrency(bc.noiDung.tongThuong)}</p>
                </div>
                <div style="padding: 15px; background: #fff3e0; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng khấu trừ</p>
                    <p style="font-size: 20px; font-weight: bold; color: #f57c00;">${formatCurrency(bc.noiDung.tongKhauTru)}</p>
                </div>
                <div style="padding: 15px; background: #fce4ec; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Thực chi</p>
                    <p style="font-size: 20px; font-weight: bold; color: #c2185b;">${formatCurrency(bc.noiDung.thucChi)}</p>
                </div>
            </div>
            <h4 style="margin-bottom: 10px;">Chi tiết theo phòng ban:</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Phòng ban</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Lương</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Thưởng</th>
                    </tr>
                </thead>
                <tbody>
                    ${bc.noiDung.chiTiet.map(ct => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${ct.phongBan}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(ct.luong)}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(ct.thuong)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else if (bc.ma === 'BC004') {
        html += `
            <h3 style="margin-bottom: 15px; color: #667eea;">Tổng quan đào tạo</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: #e3f2fd; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng khóa học</p>
                    <p style="font-size: 24px; font-weight: bold; color: #1976d2;">${bc.noiDung.tongKhoaHoc}</p>
                </div>
                <div style="padding: 15px; background: #e8f5e9; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Hoàn thành</p>
                    <p style="font-size: 24px; font-weight: bold; color: #388e3c;">${bc.noiDung.hoanThanh}</p>
                </div>
                <div style="padding: 15px; background: #fff3e0; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng học viên</p>
                    <p style="font-size: 24px; font-weight: bold; color: #f57c00;">${bc.noiDung.tongHocVien}</p>
                </div>
            </div>
            <h4 style="margin-bottom: 10px;">Chi tiết khóa học:</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Khóa học</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Học viên</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Hoàn thành</th>
                    </tr>
                </thead>
                <tbody>
                    ${bc.noiDung.chiTiet.map(ct => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${ct.khoaHoc}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${ct.hocVien}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${ct.hoanThanh}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    html += '</div>';
    body.innerHTML = html;

    document.getElementById('baoCaoModal').classList.add('show');
}

function closeBaoCaoModal() {
    document.getElementById('baoCaoModal').classList.remove('show');
    currentBaoCao = null;
}

function downloadBaoCao(ma) {
    const bc = baoCaoData.find(b => b.ma === ma);
    if (!bc) return;

    // Simulate download
    const fileName = `${bc.loai.replace(/\s+/g, '_')}_${bc.ky.replace(/\s+/g, '_')}.pdf`;
    showToast(`Đang tải báo cáo: ${fileName}...`);
    
    // In real app, this would trigger actual PDF download
    setTimeout(() => {
        showToast('Tải báo cáo thành công!');
    }, 1000);
}

function downloadCurrentBaoCao() {
    if (currentBaoCao) {
        downloadBaoCao(currentBaoCao.ma);
    }
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
    const modal = document.getElementById('baoCaoModal');
    if (event.target == modal) {
        closeBaoCaoModal();
    }
}
