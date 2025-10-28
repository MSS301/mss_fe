import React from "react";
import "../../css/Dashboard.css";

export default function LessonRatingManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý đánh giá bài học</h3>
        </div>
        <div className="card-body">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Mã đánh giá</th>
                <th>Bài học</th>
                <th>Người đánh giá</th>
                <th>Điểm</th>
                <th>Nhận xét</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#DG001</td>
                <td>Bài 1: Số học</td>
                <td>Nguyễn Văn An</td>
                <td>9</td>
                <td>Rất hữu ích!</td>
                <td>28/10/2025 09:20</td>
                <td>
                  <button className="btn btn-ghost btn-sm">Ẩn</button>
                  <button className="btn btn-ghost btn-sm">Xóa</button>
                </td>
              </tr>
              <tr>
                <td>#DG002</td>
                <td>Bài 2: Hình học</td>
                <td>Trần Thị Bình</td>
                <td>7</td>
                <td>Bài giảng dễ hiểu.</td>
                <td>28/10/2025 10:10</td>
                <td>
                  <button className="btn btn-ghost btn-sm">Ẩn</button>
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
