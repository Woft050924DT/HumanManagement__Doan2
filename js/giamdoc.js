// Dữ liệu báo cáo đã gửi lên giám đốc
// Trong thực tế, dữ liệu này sẽ được lấy từ localStorage hoặc API
let giamDocBaoCaoData = [];

// Load dữ liệu từ localStorage khi trang được tải
function loadGiamDocBaoCaoData() {
    const stored = localStorage.getItem('giamDocBaoCaoData');
    if (stored) {
        giamDocBaoCaoData = JSON.parse(stored);
    }
}

// Lưu dữ liệu vào localStorage
function saveGiamDocBaoCaoData() {
    localStorage.setItem('giamDocBaoCaoData', JSON.stringify(giamDocBaoCaoData));
}

let currentBaoCao = null;

// Render bảng báo cáo
function renderGiamDocTable() {
    const tbody = document.getElementById('giamdocTableBody');
    const filterStatus = document.getElementById('filterStatus').value;
    
    let filteredData = giamDocBaoCaoData;
    if (filterStatus === 'new') {
        filteredData = giamDocBaoCaoData.filter(bc => !bc.daDoc);
    } else if (filterStatus === 'read') {
        filteredData = giamDocBaoCaoData.filter(bc => bc.daDoc);
    }

    // Sắp xếp: chưa đọc trước, sau đó theo ngày gửi giảm dần
    filteredData.sort((a, b) => {
        if (a.daDoc !== b.daDoc) {
            return a.daDoc ? 1 : -1;
        }
        return new Date(b.ngayGui) - new Date(a.ngayGui);
    });

    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                    <p style="font-size: 18px; margin-bottom: 10px;">📭</p>
                    <p>Chưa có báo cáo nào được gửi lên</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredData.map(bc => {
        const statusBadge = bc.daDoc 
            ? '<span style="padding: 4px 12px; background: #e8f5e9; color: #388e3c; border-radius: 12px; font-size: 12px; font-weight: 500;">✓ Đã đọc</span>'
            : '<span style="padding: 4px 12px; background: #fff3e0; color: #f57c00; border-radius: 12px; font-size: 12px; font-weight: 500;">● Chưa đọc</span>';
        
        return `
            <tr style="${!bc.daDoc ? 'background: #fff9e6;' : ''}">
                <td>${statusBadge}</td>
                <td><strong>${bc.loai}</strong></td>
                <td>${bc.ky}</td>
                <td>${bc.nguoiGui}</td>
                <td>${formatDate(bc.ngayGui)}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="viewBaoCao('${bc.ma}')">Xem</button>
                    <button class="action-btn btn-download" onclick="downloadBaoCao('${bc.ma}')">Tải về</button>
                </td>
            </tr>
        `;
    }).join('');

    updateUnreadCount();
}

// Cập nhật số lượng báo cáo chưa đọc
function updateUnreadCount() {
    const unreadCount = giamDocBaoCaoData.filter(bc => !bc.daDoc).length;
    document.getElementById('unreadCount').textContent = unreadCount;
}

// Xem chi tiết báo cáo
function viewBaoCao(ma) {
    const bc = giamDocBaoCaoData.find(b => b.ma === ma);
    if (!bc) return;

    // Đánh dấu đã đọc
    if (!bc.daDoc) {
        bc.daDoc = true;
        bc.ngayDoc = new Date().toISOString().split('T')[0];
        saveGiamDocBaoCaoData();
        renderGiamDocTable();
    }

    currentBaoCao = bc;
    document.getElementById('baoCaoModalTitle').textContent = bc.loai + ' - ' + bc.ky;
    
    const body = document.getElementById('baoCaoModalBody');
    let html = `
        <div style="line-height: 1.8;">
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
                <p><strong>Loại báo cáo:</strong> ${bc.loai}</p>
                <p><strong>Kỳ báo cáo:</strong> ${bc.ky}</p>
                <p><strong>Người gửi:</strong> ${bc.nguoiGui}</p>
                <p><strong>Ngày gửi:</strong> ${formatDate(bc.ngayGui)}</p>
                ${bc.ngayDoc ? `<p><strong>Ngày đọc:</strong> ${formatDate(bc.ngayDoc)}</p>` : ''}
            </div>
    `;

    // Hiển thị nội dung báo cáo dựa trên loại
    if (bc.loai.includes('nhân sự') || bc.loai.includes('Nhân sự')) {
        html += `
            <h3 style="margin-bottom: 15px; color: #667eea;">Tổng quan nhân sự</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: #e3f2fd; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng nhân viên</p>
                    <p style="font-size: 24px; font-weight: bold; color: #1976d2;">${bc.noiDung.tongNhanVien || 0}</p>
                </div>
                <div style="padding: 15px; background: #e8f5e9; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Nhân viên mới</p>
                    <p style="font-size: 24px; font-weight: bold; color: #388e3c;">${bc.noiDung.nhanVienMoi || 0}</p>
                </div>
                <div style="padding: 15px; background: #fff3e0; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Nghỉ việc</p>
                    <p style="font-size: 24px; font-weight: bold; color: #f57c00;">${bc.noiDung.nghiViec || 0}</p>
                </div>
            </div>
        `;
        if (bc.noiDung.theoPhongBan && bc.noiDung.theoPhongBan.length > 0) {
            html += `
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
        }
    } else if (bc.loai.includes('tuyển dụng') || bc.loai.includes('Tuyển dụng')) {
        html += `
            <h3 style="margin-bottom: 15px; color: #667eea;">Tổng quan tuyển dụng</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: #e3f2fd; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng vị trí</p>
                    <p style="font-size: 24px; font-weight: bold; color: #1976d2;">${bc.noiDung.tongViTri || 0}</p>
                </div>
                <div style="padding: 15px; background: #e8f5e9; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Đang tuyển</p>
                    <p style="font-size: 24px; font-weight: bold; color: #388e3c;">${bc.noiDung.dangTuyen || 0}</p>
                </div>
                <div style="padding: 15px; background: #fff3e0; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Đã tuyển được</p>
                    <p style="font-size: 24px; font-weight: bold; color: #f57c00;">${bc.noiDung.daTuyenDuoc || 0}</p>
                </div>
            </div>
        `;
        if (bc.noiDung.chiTiet && bc.noiDung.chiTiet.length > 0) {
            html += `
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
        }
    } else if (bc.loai.includes('lương') || bc.loai.includes('Lương')) {
        html += `
            <h3 style="margin-bottom: 15px; color: #667eea;">Tổng quan lương thưởng</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: #e3f2fd; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng lương</p>
                    <p style="font-size: 20px; font-weight: bold; color: #1976d2;">${formatCurrency(bc.noiDung.tongLuong || 0)}</p>
                </div>
                <div style="padding: 15px; background: #e8f5e9; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng thưởng</p>
                    <p style="font-size: 20px; font-weight: bold; color: #388e3c;">${formatCurrency(bc.noiDung.tongThuong || 0)}</p>
                </div>
                <div style="padding: 15px; background: #fff3e0; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng khấu trừ</p>
                    <p style="font-size: 20px; font-weight: bold; color: #f57c00;">${formatCurrency(bc.noiDung.tongKhauTru || 0)}</p>
                </div>
                <div style="padding: 15px; background: #fce4ec; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Thực chi</p>
                    <p style="font-size: 20px; font-weight: bold; color: #c2185b;">${formatCurrency(bc.noiDung.thucChi || 0)}</p>
                </div>
            </div>
        `;
        if (bc.noiDung.chiTiet && bc.noiDung.chiTiet.length > 0) {
            html += `
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
        }
    } else if (bc.loai.includes('đào tạo') || bc.loai.includes('Đào tạo')) {
        html += `
            <h3 style="margin-bottom: 15px; color: #667eea;">Tổng quan đào tạo</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: #e3f2fd; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng khóa học</p>
                    <p style="font-size: 24px; font-weight: bold; color: #1976d2;">${bc.noiDung.tongKhoaHoc || 0}</p>
                </div>
                <div style="padding: 15px; background: #e8f5e9; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Hoàn thành</p>
                    <p style="font-size: 24px; font-weight: bold; color: #388e3c;">${bc.noiDung.hoanThanh || 0}</p>
                </div>
                <div style="padding: 15px; background: #fff3e0; border-radius: 6px;">
                    <p style="color: #666; margin-bottom: 5px;">Tổng học viên</p>
                    <p style="font-size: 24px; font-weight: bold; color: #f57c00;">${bc.noiDung.tongHocVien || 0}</p>
                </div>
            </div>
        `;
        if (bc.noiDung.chiTiet && bc.noiDung.chiTiet.length > 0) {
            html += `
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
    } else {
        // Báo cáo tổng quát
        html += `
            <div style="padding: 20px; background: #f8f9fa; border-radius: 6px;">
                <p style="color: #666;">Nội dung báo cáo đang được cập nhật...</p>
            </div>
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

// Hàm tạo PDF với layout đẹp
function generatePDF(baoCao) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Màu sắc
    const primaryColor = [102, 126, 234]; // #667eea
    const secondaryColor = [95, 95, 95]; // #5f5f5f
    const lightGray = [245, 245, 245];
    
    let yPos = 20;
    
    // Header với logo và tiêu đề
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('HRMS', 20, 20);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Hệ thống Quản lý Nhân sự', 20, 30);
    
    // Tiêu đề báo cáo
    yPos = 55;
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(baoCao.loai, 105, yPos, { align: 'center' });
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Kỳ báo cáo: ${baoCao.ky}`, 105, yPos, { align: 'center' });
    
    // Thông tin chung
    yPos += 15;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const nguoiGui = baoCao.nguoiGui || baoCao.nguoiTao;
    const ngayGui = baoCao.ngayGui || baoCao.ngayTao;
    doc.text(`Người gửi: ${nguoiGui}`, 20, yPos);
    doc.text(`Ngày gửi: ${formatDate(ngayGui)}`, 105, yPos);
    if (baoCao.ngayDoc) {
        yPos += 7;
        doc.text(`Ngày đọc: ${formatDate(baoCao.ngayDoc)}`, 20, yPos);
    }
    
    yPos += 15;
    
    // Nội dung báo cáo theo loại
    if (baoCao.loai.includes('nhân sự') || baoCao.loai.includes('Nhân sự')) {
        // Báo cáo nhân sự
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Tổng quan nhân sự', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(...secondaryColor);
        
        // Thống kê tổng quan
        const stats = [
            ['Tổng nhân viên', baoCao.noiDung.tongNhanVien || 0],
            ['Nhân viên mới', baoCao.noiDung.nhanVienMoi || 0],
            ['Nghỉ việc', baoCao.noiDung.nghiViec || 0]
        ];
        
        doc.autoTable({
            startY: yPos,
            head: [['Chỉ tiêu', 'Số lượng']],
            body: stats,
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 11, cellPadding: 5 },
            margin: { left: 20, right: 20 }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
        
        // Bảng phân bổ phòng ban
        if (baoCao.noiDung.theoPhongBan && baoCao.noiDung.theoPhongBan.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Phân bổ nhân sự theo phòng ban', 20, yPos);
            
            yPos += 8;
            const tableData = baoCao.noiDung.theoPhongBan.map(pb => [pb.phongBan, pb.soLuong.toString()]);
            
            doc.autoTable({
                startY: yPos,
                head: [['Phòng ban', 'Số lượng']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 4 },
                margin: { left: 20, right: 20 }
            });
        }
        
    } else if (baoCao.loai.includes('tuyển dụng') || baoCao.loai.includes('Tuyển dụng')) {
        // Báo cáo tuyển dụng
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Tổng quan tuyển dụng', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(...secondaryColor);
        
        const stats = [
            ['Tổng vị trí', baoCao.noiDung.tongViTri || 0],
            ['Đang tuyển', baoCao.noiDung.dangTuyen || 0],
            ['Đã tuyển được', baoCao.noiDung.daTuyenDuoc || 0]
        ];
        
        doc.autoTable({
            startY: yPos,
            head: [['Chỉ tiêu', 'Số lượng']],
            body: stats,
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 11, cellPadding: 5 },
            margin: { left: 20, right: 20 }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
        
        if (baoCao.noiDung.chiTiet && baoCao.noiDung.chiTiet.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Chi tiết vị trí tuyển dụng', 20, yPos);
            
            yPos += 8;
            const tableData = baoCao.noiDung.chiTiet.map(ct => [
                ct.viTri,
                ct.soLuong.toString(),
                ct.daTuyen.toString()
            ]);
            
            doc.autoTable({
                startY: yPos,
                head: [['Vị trí', 'Số lượng cần', 'Đã tuyển']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 4 },
                margin: { left: 20, right: 20 }
            });
        }
        
    } else if (baoCao.loai.includes('lương') || baoCao.loai.includes('Lương')) {
        // Báo cáo lương thưởng
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Tổng quan lương thưởng', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(...secondaryColor);
        
        const stats = [
            ['Tổng lương', formatCurrencyPDF(baoCao.noiDung.tongLuong || 0)],
            ['Tổng thưởng', formatCurrencyPDF(baoCao.noiDung.tongThuong || 0)],
            ['Tổng khấu trừ', formatCurrencyPDF(baoCao.noiDung.tongKhauTru || 0)],
            ['Thực chi', formatCurrencyPDF(baoCao.noiDung.thucChi || 0)]
        ];
        
        doc.autoTable({
            startY: yPos,
            head: [['Chỉ tiêu', 'Số tiền']],
            body: stats,
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 11, cellPadding: 5 },
            margin: { left: 20, right: 20 }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
        
        if (baoCao.noiDung.chiTiet && baoCao.noiDung.chiTiet.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Chi tiết theo phòng ban', 20, yPos);
            
            yPos += 8;
            const tableData = baoCao.noiDung.chiTiet.map(ct => [
                ct.phongBan,
                formatCurrencyPDF(ct.luong),
                formatCurrencyPDF(ct.thuong)
            ]);
            
            doc.autoTable({
                startY: yPos,
                head: [['Phòng ban', 'Lương', 'Thưởng']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 4 },
                margin: { left: 20, right: 20 }
            });
        }
        
    } else if (baoCao.loai.includes('đào tạo') || baoCao.loai.includes('Đào tạo')) {
        // Báo cáo đào tạo
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Tổng quan đào tạo', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(...secondaryColor);
        
        const stats = [
            ['Tổng khóa học', baoCao.noiDung.tongKhoaHoc || 0],
            ['Hoàn thành', baoCao.noiDung.hoanThanh || 0],
            ['Tổng học viên', baoCao.noiDung.tongHocVien || 0]
        ];
        
        doc.autoTable({
            startY: yPos,
            head: [['Chỉ tiêu', 'Số lượng']],
            body: stats,
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 11, cellPadding: 5 },
            margin: { left: 20, right: 20 }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
        
        if (baoCao.noiDung.chiTiet && baoCao.noiDung.chiTiet.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Chi tiết khóa học', 20, yPos);
            
            yPos += 8;
            const tableData = baoCao.noiDung.chiTiet.map(ct => [
                ct.khoaHoc,
                ct.hocVien.toString(),
                ct.hoanThanh.toString()
            ]);
            
            doc.autoTable({
                startY: yPos,
                head: [['Khóa học', 'Học viên', 'Hoàn thành']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 4 },
                margin: { left: 20, right: 20 }
            });
        }
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Trang ${i} / ${pageCount}`,
            105,
            287,
            { align: 'center' }
        );
        doc.text(
            `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`,
            190,
            287,
            { align: 'right' }
        );
    }
    
    return doc;
}

// Hàm format currency cho PDF
function formatCurrencyPDF(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
}

function downloadBaoCao(ma) {
    const bc = giamDocBaoCaoData.find(b => b.ma === ma);
    if (!bc) return;

    showToast('Đang tạo PDF...', 'info');
    
    try {
        const doc = generatePDF(bc);
        const fileName = `${bc.loai.replace(/\s+/g, '_')}_${bc.ky.replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
        showToast('Tải báo cáo thành công!', 'success');
    } catch (error) {
        console.error('Lỗi khi tạo PDF:', error);
        showToast('Có lỗi xảy ra khi tạo PDF', 'error');
    }
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
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function filterReports() {
    renderGiamDocTable();
}

function markAllAsRead() {
    if (giamDocBaoCaoData.length === 0) {
        showToast('Không có báo cáo nào để đánh dấu', 'info');
        return;
    }
    
    const unreadCount = giamDocBaoCaoData.filter(bc => !bc.daDoc).length;
    if (unreadCount === 0) {
        showToast('Tất cả báo cáo đã được đọc', 'info');
        return;
    }

    giamDocBaoCaoData.forEach(bc => {
        if (!bc.daDoc) {
            bc.daDoc = true;
            bc.ngayDoc = new Date().toISOString().split('T')[0];
        }
    });
    
    saveGiamDocBaoCaoData();
    renderGiamDocTable();
    showToast(`Đã đánh dấu ${unreadCount} báo cáo là đã đọc`, 'success');
}

window.onclick = function(event) {
    const modal = document.getElementById('baoCaoModal');
    if (event.target == modal) {
        closeBaoCaoModal();
    }
}

// Hàm đăng xuất
function logout() {
    // Xóa thông tin user khỏi localStorage
    localStorage.removeItem('currentUser');
    // Chuyển về trang đăng nhập
    window.location.href = 'index.html';
}

// Kiểm tra đăng nhập khi trang load
function checkLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // Chưa đăng nhập, chuyển về trang đăng nhập
        window.location.href = 'index.html';
        return false;
    }
    
    const user = JSON.parse(currentUser);
    if (user.role !== 'giamdoc') {
        // Không phải giám đốc, chuyển về trang đăng nhập
        window.location.href = 'index.html';
        return false;
    }
    
    // Cập nhật welcome message
    if (document.getElementById('userWelcome')) {
        document.getElementById('userWelcome').textContent = `Xin chào, ${user.username}`;
    }
    
    return true;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập trước
    if (checkLogin()) {
        loadGiamDocBaoCaoData();
        renderGiamDocTable();
    }
});
