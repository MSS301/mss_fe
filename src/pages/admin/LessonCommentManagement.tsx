import React from "react";
import "../../css/Dashboard.css";

export default function LessonCommentManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý bình luận bài học</h3>
        </div>
        <div className="card-body">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Mã bình luận</th>
                <th>Bài học</th>
                <th>Người bình luận</th>
                <th>Nội dung</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#BL001</td>
                <td>Bài 1: Số học</td>
                <td>Nguyễn Văn An</td>
                <td>Hay quá thầy ơi!</td>
                <td>28/10/2025 09:15</td>
                <td>
                  <span className="badge badge-success">Hiển thị</span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">Ẩn</button>
                  <button className="btn btn-ghost btn-sm">Xóa</button>
                </td>
              </tr>
              <tr>
                <td>#BL002</td>
                <td>Bài 2: Hình học</td>
                <td>Trần Thị Bình</td>
                <td>Em chưa hiểu phần này.</td>
                <td>28/10/2025 10:05</td>
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
