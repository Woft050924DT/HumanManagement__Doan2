const employees = [
    { 
        code: 'NV001', 
        name: 'Nguyễn Văn A', 
        department: 'Kỹ thuật', 
        position: 'Trưởng phòng', 
        email: 'nva@company.com',
        phone: '0912345678',
        birthDate: '1990-05-15',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        startDate: '2020-01-01',
        salary: 25000000,
        status: 'Đang làm việc'
    },
    { 
        code: 'NV002', 
        name: 'Trần Thị B', 
        department: 'Nhân sự', 
        position: 'Nhân viên', 
        email: 'ttb@company.com',
        phone: '0912345679',
        birthDate: '1992-08-20',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        startDate: '2021-03-15',
        salary: 15000000,
        status: 'Đang làm việc'
    },
    { 
        code: 'NV003', 
        name: 'Lê Văn C', 
        department: 'Kinh doanh', 
        position: 'Giám đốc', 
        email: 'lvc@company.com',
        phone: '0912345680',
        birthDate: '1988-03-10',
        address: '789 Đường DEF, Quận 3, TP.HCM',
        startDate: '2018-06-01',
        salary: 50000000,
        status: 'Đang làm việc'
    }
];

function searchEmployee() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterDept = document.getElementById('filterDepartment').value;
    const tableBody = document.getElementById('employeeTable');
    
    let filtered = employees.filter(emp => {
        const matchesSearch = !searchTerm || 
            emp.code.toLowerCase().includes(searchTerm) ||
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm) ||
            emp.position.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm);
        
        const matchesDept = !filterDept || emp.department === filterDept;
        
        return matchesSearch && matchesDept;
    });

    tableBody.innerHTML = '';
    
    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Không tìm thấy kết quả</td></tr>';
    } else {
        filtered.forEach(emp => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${emp.code}</td>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>${emp.email}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="viewEmployeeDetail('${emp.code}')">Xem chi tiết</button>
                </td>
            `;
        });
    }
    
    document.getElementById('resultCount').textContent = `Tìm thấy ${filtered.length} kết quả`;
}

function viewEmployeeDetail(code) {
    const emp = employees.find(e => e.code === code);
    if (!emp) return;

    const body = document.getElementById('employeeDetailBody');
    body.innerHTML = `
        <div style="line-height: 1.8;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div>
                    <p><strong>Mã nhân viên:</strong></p>
                    <p>${emp.code}</p>
                </div>
                <div>
                    <p><strong>Họ tên:</strong></p>
                    <p>${emp.name}</p>
                </div>
                <div>
                    <p><strong>Phòng ban:</strong></p>
                    <p>${emp.department}</p>
                </div>
                <div>
                    <p><strong>Chức vụ:</strong></p>
                    <p>${emp.position}</p>
                </div>
                <div>
                    <p><strong>Email:</strong></p>
                    <p>${emp.email}</p>
                </div>
                <div>
                    <p><strong>Số điện thoại:</strong></p>
                    <p>${emp.phone}</p>
                </div>
                <div>
                    <p><strong>Ngày sinh:</strong></p>
                    <p>${formatDate(emp.birthDate)}</p>
                </div>
                <div>
                    <p><strong>Ngày vào làm:</strong></p>
                    <p>${formatDate(emp.startDate)}</p>
                </div>
                <div>
                    <p><strong>Lương cơ bản:</strong></p>
                    <p>${formatCurrency(emp.salary)} VNĐ</p>
                </div>
                <div>
                    <p><strong>Trạng thái:</strong></p>
                    <p><span style="padding: 4px 12px; background: #d4edda; color: #155724; border-radius: 12px; font-size: 12px;">${emp.status}</span></p>
                </div>
            </div>
            <div style="margin-top: 15px;">
                <p><strong>Địa chỉ:</strong></p>
                <p>${emp.address}</p>
            </div>
        </div>
    `;

    document.getElementById('employeeDetailModal').classList.add('show');
}

function closeEmployeeDetailModal() {
    document.getElementById('employeeDetailModal').classList.remove('show');
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
    const modal = document.getElementById('employeeDetailModal');
    if (event.target == modal) {
        closeEmployeeDetailModal();
    }
}

// Initial count
document.getElementById('resultCount').textContent = `Tìm thấy ${employees.length} kết quả`;
