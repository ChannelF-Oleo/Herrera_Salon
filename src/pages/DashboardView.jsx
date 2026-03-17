// src/pages/DashboardView.jsx
import React, { useState, useEffect } from "react";
import { DollarSign, GraduationCap, ShoppingBag } from "lucide-react";
import { 
  collection, 
  getDocs
} from "firebase/firestore";
import { db } from "../config/firebase";
import StatCard from "../components/admin/UI/StatCard";
import RecentActivity from "./RecentActivity";
import { hasPermission } from "../utils/rolePermissions";
import "./DashboardView.css";

const DashboardView = ({ userRole }) => {
  const [stats, setStats] = useState({
    monthlyRevenue: 0,
    activeStudents: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  const canViewFinancials = hasPermission(userRole, "canViewFinancials");
  const canViewAllStats = hasPermission(userRole, "canViewAllStats");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        if (canViewAllStats) {
          let studentsCount = 0;
          let lowStockCount = 0;

          // 1. LÓGICA DE ALUMNOS
          try {
            const enrollmentsRef = collection(db, "course_enrollments");
            const enrollmentsSnapshot = await getDocs(enrollmentsRef);
            studentsCount = enrollmentsSnapshot.size;
          } catch (enrollmentsError) {
            console.warn("Error obteniendo enrollments:", enrollmentsError);
          }

          // 2. LÓGICA DE STOCK BAJO
          try {
            const productsRef = collection(db, "products");
            const productsSnapshot = await getDocs(productsRef);
            lowStockCount = productsSnapshot.docs.filter(doc => {
              const data = doc.data();
              return (data.stock || 0) <= (data.minStock || 5);
            }).length;
          } catch (productsError) {
            console.warn("Error obteniendo products:", productsError);
          }

          setStats({
            monthlyRevenue: 0, 
            activeStudents: studentsCount,
            pendingOrders: lowStockCount,
          });

        } else {
          // Vista limitada para staff sin permisos de estadísticas globales
          setStats({
            monthlyRevenue: 0,
            activeStudents: 0,
            pendingOrders: 0,
          });
        }
      } catch (error) {
        console.error("Error general en dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userRole, canViewAllStats]);

  if (loading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-loading">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-500">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-view">
      {/* Grid de estadísticas */}
      <div className="dashboard-view__stats">
        {canViewAllStats ? (
          <>
            {canViewFinancials && (
              <StatCard
                title="Ingresos Mes"
                value={`${stats.monthlyRevenue.toLocaleString()}`}
                icon={DollarSign}
                color="#10b981"
                trend="Estimado"
              />
            )}
            <StatCard
              title="Alumnos Activos"
              value={stats.activeStudents}
              icon={GraduationCap}
              color="#8b5cf6"
            />
            <StatCard
              title="Stock Bajo"
              value={stats.pendingOrders}
              icon={ShoppingBag}
              color="#f59e0b"
              trend={stats.pendingOrders > 0 ? "Reponer stock" : "Stock saludable"}
            />
          </>
        ) : (
          <div className="col-span-full p-4 bg-blue-50 text-blue-800 rounded-lg">
            Bienvenido al panel de control. Selecciona una opción del menú.
          </div>
        )}
      </div>

      {/* Actividad reciente */}
      <RecentActivity />
    </div>
  );
};

export default DashboardView;