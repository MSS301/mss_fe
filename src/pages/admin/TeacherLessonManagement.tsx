import React from "react";
import "../../css/Dashboard.css";

export default function TeacherLessonManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý bài học của giáo viên</h3>
        </div>
        <div className="card-body">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Mã bài học</th>
                <th>Tên bài học</th>
                <th>Giáo viên</th>
                <th>Môn học</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#GV001</td>
                <td>Số học cơ bản</td>
                <td>Nguyễn Văn An</td>
                <td>Toán học</td>
                <td>
                  <span className="badge badge-success">Đã duyệt</span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">Xem</button>
                  <button className="btn btn-ghost btn-sm">Sửa</button>
                </td>
              </tr>
              <tr>
                <td>#GV002</td>
                <td>Hình học nâng cao</td>
                <td>Trần Thị Bình</td>
                <td>Toán học</td>
                <td>
                  <span className="badge badge-warning">Chờ duyệt</span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">Duyệt</button>
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
