import React from "react";
import "../../css/Dashboard.css";

export default function SubjectManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý môn học</h3>
          <button className="btn btn-primary">+ Thêm môn học</button>
        </div>
        <div className="card-body">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Mã môn</th>
                <th>Tên môn học</th>
                <th>Bậc học</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#MH001</td>
                <td>Toán học</td>
                <td>THCS</td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">Sửa</button>
                  <button className="btn btn-ghost btn-sm">Xem</button>
                </td>
              </tr>
              <tr>
                <td>#MH002</td>
                <td>Ngữ văn</td>
                <td>THPT</td>
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
