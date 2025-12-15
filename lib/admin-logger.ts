import { adminLogOperations } from './database'

export interface AdminLogEntry {
  adminId: string
  action: string
  targetType: 'user' | 'property' | 'payment' | 'system'
  targetId?: string
  details?: string
  ipAddress?: string
}

export function logAdminAction(entry: AdminLogEntry): void {
  try {
    const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    
    adminLogOperations.create.run(
      logId,
      entry.adminId,
      entry.action,
      entry.targetType,
      entry.targetId || null,
      entry.details || null,
      entry.ipAddress || null
    )
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

export function getAdminLogs(limit: number = 100) {
  try {
    return adminLogOperations.getAll.all(limit)
  } catch (error) {
    console.error('Failed to fetch admin logs:', error)
    return []
  }
}

export function getAdminLogsByUser(adminId: string, limit: number = 50) {
  try {
    return adminLogOperations.getByAdmin.all(adminId, limit)
  } catch (error) {
    console.error('Failed to fetch admin logs by user:', error)
    return []
  }
}

export function getTargetLogs(targetType: string, targetId: string) {
  try {
    return adminLogOperations.getByTarget.all(targetType, targetId)
  } catch (error) {
    console.error('Failed to fetch target logs:', error)
    return []
  }
}

// Common admin actions
export const AdminActions = {
  // User management
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  USER_ROLE_CHANGED: 'user_role_changed',
  
  // Property management
  PROPERTY_APPROVED: 'property_approved',
  PROPERTY_REJECTED: 'property_rejected',
  PROPERTY_STATUS_CHANGED: 'property_status_changed',
  PROPERTY_UPDATED: 'property_updated',
  PROPERTY_DELETED: 'property_deleted',
  
  // Payment management
  PAYMENT_CONFIRMED: 'payment_confirmed',
  PAYMENT_REJECTED: 'payment_rejected',
  PAYMENT_REVIEWED: 'payment_reviewed',
  
  // System management
  SETTINGS_UPDATED: 'settings_updated',
  ADMIN_LOGIN: 'admin_login',
  ADMIN_LOGOUT: 'admin_logout',
  SYSTEM_BACKUP: 'system_backup'
} as const