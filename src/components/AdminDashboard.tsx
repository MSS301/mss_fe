import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Dashboard.css";
import { getToken } from "utils/utils";
import axios from "axios";

interface Role {
  name: string;
  description: string;
}
interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  authProvider: string;
  roles: Role[];
}

export default function AdminDashboard() {
  const [userAmount, setUserAmount] = useState(0)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get<{
          code: number;
          result?: User[];
          content?: User[];
          data?: { code: number; result?: User[]; content?: User[] };
        }>("http://localhost:8080/auth-service/users", {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const body = res.data?.data ?? res.data;
        const list = body?.result ?? body?.content;
        if (body?.code === 1000 && Array.isArray(list)) {
          setUserAmount(list.length);
        } else if (Array.isArray(res.data?.result)) {
          setUserAmount(res.data.result.length);
        } else if (Array.isArray(res.data?.content)) {
          setUserAmount(res.data.content.length);
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="dashboard">
      {/* Admin Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">👥</div>
          <div className="stat-content">
            <div className="stat-label">Tổng người dùng</div>
            <div className="stat-value">{userAmount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">📄</div>
          <div className="stat-content">
            <div className="stat-label">Tổng số slide</div>
            <div className="stat-value">15,847</div>
            <div className="stat-change positive">
              <span>↑ 24%</span>
              <span>tuần này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">💰</div>
          <div className="stat-content">
            <div className="stat-label">Doanh thu tháng</div>
            <div className="stat-value">125M đ</div>
            <div className="stat-change positive">
              <span>↑ 18%</span>
              <span>so tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">🚀</div>
          <div className="stat-content">
            <div className="stat-label">System Health</div>
            <div className="stat-value">99.8%</div>
            <div className="stat-change positive">
              <span>↑ 0.2%</span>
              <span>uptime tốt</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
