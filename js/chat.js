

let chatOpen = true;

// Toggle chat widget
function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    chatOpen = !chatOpen;
    chatWidget.classList.toggle('collapsed');
}

// Xử lý phím Enter trong input
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Gửi tin nhắn chat
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Hiển thị tin nhắn của user
    addMessage(message, 'user');
    
    // Xóa input
    input.value = '';
    
    // Xử lý và trả lời
    setTimeout(() => {
        processQuery(message);
    }, 300);
}

// Thêm tin nhắn vào chat
function addMessage(content, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    
    if (type === 'bot' && content.includes('employee-info-card')) {
        messageDiv.innerHTML = `
            <div class="message-content">
                ${content}
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Xử lý query và tìm kiếm trong tất cả dữ liệu từ mockData.js
function processQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Nhận diện loại câu hỏi
    if (lowerQuery.includes('phòng ban') || lowerQuery.includes('phong ban')) {
        handlePhongBanQuery(query);
        return;
    }
    
    if (lowerQuery.includes('tuyển dụng') || lowerQuery.includes('tuyen dung') || lowerQuery.match(/td\d+/i)) {
        handleTuyenDungQuery(query);
        return;
    }
    
    if (lowerQuery.includes('chấm công') || lowerQuery.includes('cham cong')) {
        handleChamCongQuery(query);
        return;
    }
    
    if (lowerQuery.includes('hợp đồng') || lowerQuery.includes('hop dong') || lowerQuery.match(/hd\d+/i)) {
        handleHopDongQuery(query);
        return;
    }
    
    if (lowerQuery.includes('khen thưởng') || lowerQuery.includes('khen thuong') || lowerQuery.match(/kt\d+/i)) {
        handleKhenThuongQuery(query);
        return;
    }
    
    if (lowerQuery.includes('lương') || lowerQuery.includes('luong')) {
        handleLuongQuery(query);
        return;
    }
    
    if (lowerQuery.includes('đào tạo') || lowerQuery.includes('dao tao') || lowerQuery.match(/dt\d+/i)) {
        handleDaoTaoQuery(query);
        return;
    }
    
    if (lowerQuery.includes('báo cáo') || lowerQuery.includes('bao cao') || lowerQuery.match(/bc\d+/i)) {
        handleBaoCaoQuery(query);
        return;
    }
    
    // Mặc định tìm kiếm nhân viên
    handleNhanVienQuery(query);
}

// Xử lý câu hỏi về nhân viên
function handleNhanVienQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Tìm mã NV hoặc tên
    let searchTerm = null;
    const codeMatch = query.match(/nv\d+/i);
    if (codeMatch) {
        searchTerm = codeMatch[0].toUpperCase();
    } else {
        // Extract tên từ các pattern
        const patterns = [
            /(?:lấy|cho|tôi|biết|thông tin|của|về)\s*(?:cho\s*)?(?:tôi|mình)?\s*(?:thông\s*tin)?\s*(?:của|về)?\s*(.+)/i,
            /(?:thông\s*tin|tìm|tra\s*cứu)\s*(?:của|về)?\s*(.+)/i,
            /(?:ai\s*là|nhân\s*viên|người)\s*(.+)/i
        ];
        
        for (let pattern of patterns) {
            const match = query.match(pattern);
            if (match && match[1]) {
                const extracted = match[1].trim();
                // Loại bỏ các từ không cần thiết
                const words = extracted.split(/\s+/);
                const filtered = words.filter(w => 
                    w.length > 2 && 
                    !['lấy', 'cho', 'tôi', 'biết', 'thông', 'tin', 'của', 'về', 'ai', 'là', 'nhân', 'viên', 'người'].includes(w.toLowerCase())
                );
                if (filtered.length > 0) {
                    searchTerm = filtered.join(' ');
                }
                break;
            }
        }
    }
    
    if (!searchTerm) {
        addMessage('Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về:\n• Nhân viên: "Thông tin của NV001" hoặc "Lấy thông tin của Nguyễn Văn A"\n• Phòng ban: "Danh sách phòng ban"\n• Tuyển dụng: "Danh sách tuyển dụng"\n• Chấm công, Hợp đồng, Khen thưởng, Lương, Đào tạo, Báo cáo...', 'bot');
        return;
    }
    
    // Tìm trong employeeData hoặc hoSoData (chi tiết hơn)
    let result = null;
    if (typeof employeeData !== 'undefined') {
        result = findInArray(employeeData, searchTerm, ['hoTen', 'ma']);
    }
    
    if (!result && typeof hoSoData !== 'undefined') {
        result = findInArray(hoSoData, searchTerm, ['hoTen', 'ma']);
    }
    
    if (result) {
        displayEmployeeInfo(result);
    } else {
        addMessage(`Không tìm thấy thông tin nhân viên với tên hoặc mã: "${searchTerm}". Vui lòng thử lại.`, 'bot');
    }
}

// Hàm tìm kiếm chung trong mảng
function findInArray(array, searchTerm, fields) {
    if (!array || !Array.isArray(array)) return null;
    
    const lowerSearch = searchTerm.toLowerCase();
    
    return array.find(item => {
        for (let field of fields) {
            if (item[field]) {
                const fieldValue = String(item[field]).toLowerCase();
                
                // Tìm chính xác
                if (fieldValue === lowerSearch) {
                    return true;
                }
                
                // Tìm chứa
                if (fieldValue.includes(lowerSearch)) {
                    return true;
                }
                
                // Tìm theo từng phần
                const fieldParts = fieldValue.split(/\s+/);
                const searchParts = lowerSearch.split(/\s+/);
                
                if (searchParts.every(part => 
                    fieldParts.some(fieldPart => fieldPart.includes(part))
                )) {
                    return true;
                }
            }
        }
        return false;
    });
}

// Hiển thị thông tin nhân viên
function displayEmployeeInfo(employee) {
    const formattedDate = formatDate(employee.ngaySinh);
    const formattedSalary = employee.luong ? formatCurrency(employee.luong) : '-';
    
    // Kiểm tra nếu là hồ sơ chi tiết (hoSoData)
    const isHoSo = employee.cmnd !== undefined;
    
    let infoHTML = `
        <div class="employee-info-card">
            <h4>👤 ${employee.hoTen}</h4>
            <div class="employee-info-row">
                <div>
                    <p><strong>Mã nhân viên:</strong> ${employee.ma}</p>
                    <p><strong>Ngày sinh:</strong> ${formattedDate}</p>
                    <p><strong>Phòng ban:</strong> ${employee.phongBan}</p>
                    ${isHoSo ? `<p><strong>CMND:</strong> ${employee.cmnd}</p>` : ''}
                    ${isHoSo ? `<p><strong>Giới tính:</strong> ${employee.gioiTinh}</p>` : ''}
                </div>
                <div>
                    <p><strong>Chức vụ:</strong> ${employee.chucVu}</p>
                    <p><strong>Trạng thái:</strong> <span style="color: #28a745; font-weight: 600;">${employee.trangThai || 'Đang làm việc'}</span></p>
                    ${formattedSalary !== '-' ? `<p><strong>Lương:</strong> ${formattedSalary} VNĐ</p>` : ''}
                    ${isHoSo ? `<p><strong>Trình độ:</strong> ${employee.trinhDo}</p>` : ''}
                    ${isHoSo ? `<p><strong>Kinh nghiệm:</strong> ${employee.kinhNghiem}</p>` : ''}
                </div>
            </div>
            <div style="margin-top: 10px;">
                <p><strong>📧 Email:</strong> ${employee.email}</p>
                <p><strong>📞 Số điện thoại:</strong> ${employee.soDienThoai}</p>
                <p><strong>📍 Địa chỉ:</strong> ${employee.diaChi}</p>
                ${isHoSo && employee.ngayVaoLam ? `<p><strong>Ngày vào làm:</strong> ${formatDate(employee.ngayVaoLam)}</p>` : ''}
            </div>
        </div>
    `;
    
    addMessage(infoHTML, 'bot');
}

// Xử lý câu hỏi về phòng ban
function handlePhongBanQuery(query) {
    if (!phongBanData || !Array.isArray(phongBanData)) {
        addMessage('Không có dữ liệu phòng ban.', 'bot');
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Nếu hỏi danh sách
    if (lowerQuery.includes('danh sách') || lowerQuery.includes('danh sach') || lowerQuery.includes('tất cả') || lowerQuery.includes('tat ca')) {
        let html = '<div class="employee-info-card"><h4>🏢 Danh sách phòng ban</h4>';
        phongBanData.forEach(pb => {
            html += `
                <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                    <p><strong>${pb.ten}</strong> (${pb.ma})</p>
                    <p>Trưởng phòng: ${pb.truongPhong}</p>
                    <p>Số nhân viên: ${pb.soNV}</p>
                </div>
            `;
        });
        html += '</div>';
        addMessage(html, 'bot');
        return;
    }
    
    // Tìm kiếm phòng ban cụ thể
    let searchTerm = query.replace(/phòng ban|phong ban|danh sách|danh sach/gi, '').trim();
    const result = findInArray(phongBanData, searchTerm, ['ten', 'ma', 'truongPhong']);
    
    if (result) {
        const html = `
            <div class="employee-info-card">
                <h4>🏢 ${result.ten}</h4>
                <p><strong>Mã phòng ban:</strong> ${result.ma}</p>
                <p><strong>Trưởng phòng:</strong> ${result.truongPhong}</p>
                <p><strong>Số nhân viên:</strong> ${result.soNV}</p>
            </div>
        `;
        addMessage(html, 'bot');
    } else {
        addMessage(`Không tìm thấy phòng ban "${searchTerm}". Hãy hỏi "Danh sách phòng ban" để xem tất cả.`, 'bot');
    }
}

// Xử lý câu hỏi về tuyển dụng
function handleTuyenDungQuery(query) {
    if (!tuyenDungData || !Array.isArray(tuyenDungData)) {
        addMessage('Không có dữ liệu tuyển dụng.', 'bot');
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Nếu hỏi danh sách
    if (lowerQuery.includes('danh sách') || lowerQuery.includes('danh sach') || lowerQuery.includes('tất cả') || lowerQuery.includes('tat ca')) {
        let html = '<div class="employee-info-card"><h4>📝 Danh sách tuyển dụng</h4>';
        tuyenDungData.forEach(td => {
            const statusText = td.trangThai === 'active' ? 'Đang tuyển' : 'Đã đóng';
            html += `
                <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                    <p><strong>${td.viTri}</strong> (${td.ma})</p>
                    <p>Phòng ban: ${td.phongBan}</p>
                    <p>Số lượng: ${td.soLuong} người</p>
                    <p>Ngày đăng: ${formatDate(td.ngayDang)}</p>
                    <p>Trạng thái: ${statusText}</p>
                </div>
            `;
        });
        html += '</div>';
        addMessage(html, 'bot');
        return;
    }
    
    // Tìm kiếm theo mã TD
    const codeMatch = query.match(/td\d+/i);
    if (codeMatch) {
        const result = tuyenDungData.find(td => td.ma.toLowerCase() === codeMatch[0].toUpperCase());
        if (result) {
            const statusText = result.trangThai === 'active' ? 'Đang tuyển' : 'Đã đóng';
            const html = `
                <div class="employee-info-card">
                    <h4>📝 ${result.viTri}</h4>
                    <p><strong>Mã tuyển dụng:</strong> ${result.ma}</p>
                    <p><strong>Phòng ban:</strong> ${result.phongBan}</p>
                    <p><strong>Số lượng:</strong> ${result.soLuong} người</p>
                    <p><strong>Ngày đăng:</strong> ${formatDate(result.ngayDang)}</p>
                    <p><strong>Trạng thái:</strong> ${statusText}</p>
                </div>
            `;
            addMessage(html, 'bot');
            return;
        }
    }
    
    addMessage(`Không tìm thấy thông tin tuyển dụng. Hãy hỏi "Danh sách tuyển dụng" để xem tất cả.`, 'bot');
}

// Xử lý câu hỏi về chấm công
function handleChamCongQuery(query) {
    if (!chamCongData || !Array.isArray(chamCongData)) {
        addMessage('Không có dữ liệu chấm công.', 'bot');
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Tìm theo mã NV hoặc tên
    let searchTerm = null;
    const codeMatch = query.match(/nv\d+/i);
    if (codeMatch) {
        searchTerm = codeMatch[0].toUpperCase();
    } else {
        searchTerm = query.replace(/chấm công|cham cong|thông tin|thong tin/gi, '').trim();
    }
    
    if (!searchTerm) {
        addMessage('Vui lòng chỉ rõ nhân viên bạn muốn xem chấm công (ví dụ: "Chấm công NV001" hoặc "Chấm công Nguyễn Văn A")', 'bot');
        return;
    }
    
    const result = findInArray(chamCongData, searchTerm, ['maNV', 'hoTen']);
    
    if (result) {
        const html = `
            <div class="employee-info-card">
                <h4>⏰ Chấm công - ${result.hoTen}</h4>
                <p><strong>Mã nhân viên:</strong> ${result.maNV}</p>
                <p><strong>Tháng:</strong> ${result.thang}</p>
                <p><strong>Số ngày công:</strong> ${result.soNgayCong} ngày</p>
                <p><strong>Số giờ làm:</strong> ${result.soGioLam} giờ</p>
                <p><strong>Đi muộn:</strong> ${result.diMuon} lần</p>
                <p><strong>Về sớm:</strong> ${result.veSom} lần</p>
                <p><strong>Nghỉ phép:</strong> ${result.nghiPhep} ngày</p>
            </div>
        `;
        addMessage(html, 'bot');
    } else {
        addMessage(`Không tìm thấy thông tin chấm công cho "${searchTerm}".`, 'bot');
    }
}

// Xử lý câu hỏi về hợp đồng
function handleHopDongQuery(query) {
    if (!hopDongData || !Array.isArray(hopDongData)) {
        addMessage('Không có dữ liệu hợp đồng.', 'bot');
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Tìm theo mã HD
    const codeMatch = query.match(/hd\d+/i);
    if (codeMatch) {
        const result = hopDongData.find(hd => hd.ma.toLowerCase() === codeMatch[0].toUpperCase());
        if (result) {
            const loaiText = result.loai === 'cothoi' ? `Có thời hạn (${result.thoiHan} năm)` : 'Không thời hạn';
            const statusText = result.trangThai === 'active' ? 'Đang hiệu lực' : result.trangThai === 'warning' ? 'Sắp hết hạn' : 'Đã hết hạn';
            const html = `
                <div class="employee-info-card">
                    <h4>📄 Hợp đồng ${result.ma}</h4>
                    <p><strong>Nhân viên:</strong> ${result.nhanVien}</p>
                    <p><strong>Loại hợp đồng:</strong> ${loaiText}</p>
                    <p><strong>Ngày bắt đầu:</strong> ${formatDate(result.ngayBatDau)}</p>
                    <p><strong>Ngày kết thúc:</strong> ${result.ngayKetThuc ? formatDate(result.ngayKetThuc) : '-'}</p>
                    <p><strong>Lương cơ bản:</strong> ${formatCurrency(result.luong)} VNĐ</p>
                    <p><strong>Trạng thái:</strong> ${statusText}</p>
                </div>
            `;
            addMessage(html, 'bot');
            return;
        }
    }
    
    addMessage(`Không tìm thấy hợp đồng. Hãy hỏi với mã hợp đồng (ví dụ: "Hợp đồng HD001")`, 'bot');
}

// Xử lý câu hỏi về khen thưởng
function handleKhenThuongQuery(query) {
    if (!khenThuongData || !Array.isArray(khenThuongData)) {
        addMessage('Không có dữ liệu khen thưởng.', 'bot');
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Tìm theo mã KT hoặc tên nhân viên
    let searchTerm = null;
    const codeMatch = query.match(/kt\d+/i);
    if (codeMatch) {
        searchTerm = codeMatch[0].toUpperCase();
        const result = khenThuongData.find(kt => kt.ma.toLowerCase() === codeMatch[0].toUpperCase());
        if (result) {
            const html = `
                <div class="employee-info-card">
                    <h4>🏆 ${result.loai} - ${result.ma}</h4>
                    <p><strong>Nhân viên:</strong> ${result.nhanVien}</p>
                    <p><strong>Lý do:</strong> ${result.lyDo}</p>
                    <p><strong>Giá trị:</strong> ${formatCurrency(result.giaTri)} VNĐ</p>
                    <p><strong>Ngày:</strong> ${formatDate(result.ngay)}</p>
                </div>
            `;
            addMessage(html, 'bot');
            return;
        }
    } else {
        searchTerm = query.replace(/khen thưởng|khen thuong|thông tin|thong tin/gi, '').trim();
        const results = khenThuongData.filter(kt => 
            kt.nhanVien.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (results.length > 0) {
            let html = '<div class="employee-info-card"><h4>🏆 Khen thưởng của ' + searchTerm + '</h4>';
            results.forEach(kt => {
                html += `
                    <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        <p><strong>${kt.loai}</strong> (${kt.ma})</p>
                        <p>Lý do: ${kt.lyDo}</p>
                        <p>Giá trị: ${formatCurrency(kt.giaTri)} VNĐ</p>
                        <p>Ngày: ${formatDate(kt.ngay)}</p>
                    </div>
                `;
            });
            html += '</div>';
            addMessage(html, 'bot');
            return;
        }
    }
    
    addMessage(`Không tìm thấy thông tin khen thưởng.`, 'bot');
}

// Xử lý câu hỏi về lương
function handleLuongQuery(query) {
    if (!luongData || !Array.isArray(luongData)) {
        addMessage('Không có dữ liệu lương.', 'bot');
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Tìm theo mã NV hoặc tên
    let searchTerm = null;
    const codeMatch = query.match(/nv\d+/i);
    if (codeMatch) {
        searchTerm = codeMatch[0].toUpperCase();
    } else {
        searchTerm = query.replace(/lương|luong|thông tin|thong tin/gi, '').trim();
    }
    
    if (!searchTerm) {
        addMessage('Vui lòng chỉ rõ nhân viên bạn muốn xem lương (ví dụ: "Lương NV001" hoặc "Lương Nguyễn Văn A")', 'bot');
        return;
    }
    
    const result = findInArray(luongData, searchTerm, ['maNV', 'hoTen']);
    
    if (result) {
        const html = `
            <div class="employee-info-card">
                <h4>💰 Lương - ${result.hoTen}</h4>
                <p><strong>Mã nhân viên:</strong> ${result.maNV}</p>
                <p><strong>Tháng:</strong> ${result.thang}</p>
                <p><strong>Lương cơ bản:</strong> ${formatCurrency(result.luongCoBan)} VNĐ</p>
                <p><strong>Phụ cấp:</strong> ${formatCurrency(result.phuCap)} VNĐ</p>
                <p><strong>Thưởng:</strong> ${formatCurrency(result.thuong)} VNĐ</p>
                <p><strong>Khấu trừ:</strong> ${formatCurrency(result.khauTru)} VNĐ</p>
                <p><strong style="color: #667eea;">Thực nhận:</strong> ${formatCurrency(result.thucNhan)} VNĐ</p>
            </div>
        `;
        addMessage(html, 'bot');
    } else {
        addMessage(`Không tìm thấy thông tin lương cho "${searchTerm}".`, 'bot');
    }
}

// Xử lý câu hỏi về đào tạo
function handleDaoTaoQuery(query) {
    if (!daoTAoData || !Array.isArray(daoTAoData)) {
        addMessage('Không có dữ liệu đào tạo.', 'bot');
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Tìm theo mã DT
    const codeMatch = query.match(/dt\d+/i);
    if (codeMatch) {
        const result = daoTAoData.find(dt => dt.ma.toLowerCase() === codeMatch[0].toUpperCase());
        if (result) {
            const statusText = result.trangThai === 'ongoing' ? 'Đang diễn ra' : result.trangThai === 'upcoming' ? 'Sắp diễn ra' : 'Đã hoàn thành';
            const html = `
                <div class="employee-info-card">
                    <h4>🎓 ${result.ten}</h4>
                    <p><strong>Mã khóa học:</strong> ${result.ma}</p>
                    <p><strong>Giảng viên:</strong> ${result.giangVien}</p>
                    <p><strong>Thời gian:</strong> ${formatDate(result.ngayBatDau)} - ${formatDate(result.ngayKetThuc)}</p>
                    <p><strong>Số học viên:</strong> ${result.soHocVien}</p>
                    <p><strong>Trạng thái:</strong> ${statusText}</p>
                </div>
            `;
            addMessage(html, 'bot');
            return;
        }
    }
    
    addMessage(`Không tìm thấy khóa đào tạo. Hãy hỏi với mã khóa học (ví dụ: "Đào tạo DT001")`, 'bot');
}

// Xử lý câu hỏi về báo cáo
function handleBaoCaoQuery(query) {
    if (!baoCaoData || !Array.isArray(baoCaoData)) {
        addMessage('Không có dữ liệu báo cáo.', 'bot');
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Tìm theo mã BC
    const codeMatch = query.match(/bc\d+/i);
    if (codeMatch) {
        const result = baoCaoData.find(bc => bc.ma.toLowerCase() === codeMatch[0].toUpperCase());
        if (result) {
            let html = `
                <div class="employee-info-card">
                    <h4>📊 ${result.loai}</h4>
                    <p><strong>Mã báo cáo:</strong> ${result.ma}</p>
                    <p><strong>Kỳ báo cáo:</strong> ${result.ky}</p>
                    <p><strong>Người tạo:</strong> ${result.nguoiTao}</p>
                    <p><strong>Ngày tạo:</strong> ${formatDate(result.ngayTao)}</p>
            `;
            
            // Hiển thị nội dung theo loại báo cáo
            if (result.ma === 'BC001') {
                html += `<p><strong>Tổng nhân viên:</strong> ${result.noiDung.tongNhanVien}</p>`;
                html += `<p><strong>Nhân viên mới:</strong> ${result.noiDung.nhanVienMoi}</p>`;
                html += `<p><strong>Nghỉ việc:</strong> ${result.noiDung.nghiViec}</p>`;
            } else if (result.ma === 'BC002') {
                html += `<p><strong>Tổng vị trí:</strong> ${result.noiDung.tongViTri}</p>`;
                html += `<p><strong>Đang tuyển:</strong> ${result.noiDung.dangTuyen}</p>`;
                html += `<p><strong>Đã tuyển được:</strong> ${result.noiDung.daTuyenDuoc}</p>`;
            } else if (result.ma === 'BC003') {
                html += `<p><strong>Tổng lương:</strong> ${formatCurrency(result.noiDung.tongLuong)} VNĐ</p>`;
                html += `<p><strong>Tổng thưởng:</strong> ${formatCurrency(result.noiDung.tongThuong)} VNĐ</p>`;
                html += `<p><strong>Thực chi:</strong> ${formatCurrency(result.noiDung.thucChi)} VNĐ</p>`;
            } else if (result.ma === 'BC004') {
                html += `<p><strong>Tổng khóa học:</strong> ${result.noiDung.tongKhoaHoc}</p>`;
                html += `<p><strong>Hoàn thành:</strong> ${result.noiDung.hoanThanh}</p>`;
                html += `<p><strong>Tổng học viên:</strong> ${result.noiDung.tongHocVien}</p>`;
            }
            
            html += '</div>';
            addMessage(html, 'bot');
            return;
        }
    }
    
    addMessage(`Không tìm thấy báo cáo. Hãy hỏi với mã báo cáo (ví dụ: "Báo cáo BC001")`, 'bot');
}

// Format ngày tháng
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
}

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

// Đảm bảo chat chỉ hiển thị khi đã đăng nhập
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    const chatWidget = document.getElementById('chatWidget');
    const dashboardPage = document.getElementById('dashboardPage');
    
    if (chatWidget) {
        // Chỉ hiển thị chat khi có user đăng nhập và dashboard đang hiển thị
        if (currentUser && dashboardPage && dashboardPage.classList.contains('active')) {
            chatWidget.style.display = 'flex';
            chatWidget.classList.remove('collapsed');
        } else {
            chatWidget.style.display = 'none';
        }
    }
    
    // Theo dõi khi dashboard được hiển thị/ẩn
    if (dashboardPage) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (chatWidget) {
                    if (dashboardPage.classList.contains('active')) {
                        chatWidget.style.display = 'flex';
                    } else {
                        chatWidget.style.display = 'none';
                    }
                }
            });
        });
        
        observer.observe(dashboardPage, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});
