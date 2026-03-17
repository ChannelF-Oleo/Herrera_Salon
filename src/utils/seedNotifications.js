// src/utils/seedNotifications.js
import { db } from "../config/firebase";
import { doc, writeBatch, serverTimestamp } from "firebase/firestore";

// Notificaciones de ejemplo para el sistema
const notificationsData = [
  {
    id: "welcome-notification",
    title: "¡Bienvenido al Sistema D'Galú!",
    message: "El sistema de notificaciones está funcionando correctamente. Aquí recibirás alertas importantes sobre productos, servicios y más.",
    type: "system",
    priority: "low",
    targetRoles: ["admin", "manager", "staff"],
    readBy: [],
    isActive: true,
    createdAt: new Date(),
    userId: null
  },
  {
    id: "whatsapp-booking-info",
    title: "Nueva Forma de Agendar Citas",
    message: "Ahora los clientes pueden agendar citas directamente por WhatsApp al 829-705-0408. ¡Es más fácil y rápido!",
    type: "system_update",
    priority: "high",
    targetRoles: ["admin", "manager", "staff"],
    readBy: [],
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    userId: null
  },
  {
    id: "low-stock-alert",
    title: "Stock Bajo - Esmalte Rojo",
    message: "El producto 'Esmalte Rojo Clásico' tiene solo 3 unidades en stock. Considera reordenar pronto.",
    type: "low_stock",
    priority: "medium",
    targetRoles: ["admin", "manager"],
    readBy: [],
    isActive: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
    productId: "product-example-1",
    userId: null
  },
  {
    id: "promotion-alert",
    title: "Promoción Especial Diciembre",
    message: "¡20% de descuento en todos los servicios de manicura durante diciembre! Los clientes pueden contactar por WhatsApp para agendar.",
    type: "promotion",
    priority: "medium",
    targetRoles: ["admin", "manager", "staff"],
    readBy: [],
    isActive: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    userId: null
  },
  {
    id: "service-update",
    title: "Nuevo Servicio Disponible",
    message: "Ahora ofrecemos tratamientos faciales con productos orgánicos. Los clientes pueden agendar por WhatsApp al 829-705-0408.",
    type: "service_update",
    priority: "medium",
    targetRoles: ["admin", "manager", "staff"],
    readBy: [],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
    userId: null
  }
];

// Función para crear notificaciones de ejemplo
export const uploadNotifications = async () => {
  const batch = writeBatch(db);

  notificationsData.forEach((notification) => {
    const docRef = doc(db, "notifications", notification.id);
    
    // Procesar la notificación con timestamps de Firebase
    const notificationData = {
      ...notification,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    batch.set(docRef, notificationData);
  });

  try {
    await batch.commit();
    console.log("¡Notificaciones creadas exitosamente!");
    return { success: true, message: "✅ Sistema de notificaciones configurado correctamente." };
  } catch (error) {
    console.error("Error creando notificaciones:", error);
    throw new Error(`Error creando notificaciones: ${error.message}`);
  }
};

// Función para crear una nueva notificación
export const createNotification = async (notificationData) => {
  try {
    const docRef = doc(db, "notifications", `notification-${Date.now()}`);
    
    const notification = {
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || "system",
      priority: notificationData.priority || "low",
      targetRoles: notificationData.targetRoles || ["admin", "manager", "staff"],
      readBy: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: notificationData.userId || null,
      productId: notificationData.productId || null
    };

    const batch = writeBatch(db);
    batch.set(docRef, notification);
    await batch.commit();
    
    console.log("Nueva notificación creada:", notification.title);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creando notificación:", error);
    throw error;
  }
};