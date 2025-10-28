import React from "react";
import "../../css/Dashboard.css";

export default function LessonFileManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý file bài học</h3>
          <button className="btn btn-primary">+ Thêm file</button>
        </div>
        <div className="card-body">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Mã file</th>
                <th>Bài học</th>
                <th>Tên file</th>
                <th>Loại file</th>
                <th>Người tải lên</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#F001</td>
                <td>Bài 1: Số học</td>
                <td>so_hoc.pdf</td>
                <td>PDF</td>
                <td>Nguyễn Văn An</td>
                <td>28/10/2025 09:30</td>
                <td>
                  <button className="btn btn-ghost btn-sm">Tải xuống</button>
                  <button className="btn btn-ghost btn-sm">Xóa</button>
                </td>
              </tr>
              <tr>
                <td>#F002</td>
                <td>Bài 2: Hình học</td>
                <td>hinh_hoc.pptx</td>
                <td>PPTX</td>
                <td>Trần Thị Bình</td>
                <td>28/10/2025 10:15</td>
                <td>
                  <button className="btn btn-ghost btn-sm">Tải xuống</button>
                  <button className="btn btn-ghost btn-sm">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
