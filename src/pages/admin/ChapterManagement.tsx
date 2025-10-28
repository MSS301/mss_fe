import React from "react";
import "../../css/Dashboard.css";

export default function ChapterManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý chương</h3>
          <button className="btn btn-primary">+ Thêm chương</button>
        </div>
        <div className="card-body">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Mã chương</th>
                <th>Tên chương</th>
                <th>Môn học</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#CH001</td>
                <td>Đại số</td>
                <td>Toán học</td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">Sửa</button>
                  <button className="btn btn-ghost btn-sm">Xem</button>
                </td>
              </tr>
              <tr>
                <td>#CH002</td>
                <td>Hình học</td>
                <td>Toán học</td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">Sửa</button>
                  <button className="btn btn-ghost btn-sm">Xem</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
