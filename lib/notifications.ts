export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface SmartAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  category: 'capacity' | 'accommodation' | 'inventory' | 'approval' | 'reminder';
  relatedEventId?: string;
  actionUrl?: string;
  dismissible: boolean;
}

/**
 * Create a notification
 */
export function createNotification(
  title: string,
  message: string,
  type: NotificationType = 'info',
  actionUrl?: string,
  actionLabel?: string
): Notification {
  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    title,
    message,
    type,
    timestamp: new Date(),
    read: false,
    actionUrl,
    actionLabel,
  };
}

/**
 * Create a smart alert for organizers
 */
export function createSmartAlert(
  title: string,
  message: string,
  category: SmartAlert['category'],
  severity: SmartAlert['severity'] = 'warning',
  relatedEventId?: string,
  actionUrl?: string
): SmartAlert {
  return {
    id: `alert-${Date.now()}-${Math.random()}`,
    title,
    message,
    category,
    severity,
    relatedEventId,
    actionUrl,
    dismissible: true,
  };
}

/**
 * Check for room capacity issues
 */
export function checkRoomCapacityAlert(
  eventTitle: string,
  registeredAttendees: number,
  roomCapacity: number
): SmartAlert | null {
  if (registeredAttendees > roomCapacity) {
    const overflow = registeredAttendees - roomCapacity;
    return createSmartAlert(
      'Room Capacity Exceeded',
      `Registration for ${eventTitle} exceeds room capacity by ${overflow} attendees. Please request a larger room.`,
      'capacity',
      'warning',
      eventTitle,
      `/organizer/events?search=${eventTitle}`
    );
  }
  return null;
}

/**
 * Check for missing speaker accommodation
 */
export function checkAccommodationAlert(
  eventTitle: string,
  unconfirmedSpeakers: number
): SmartAlert | null {
  if (unconfirmedSpeakers > 0) {
    return createSmartAlert(
      'Missing Speaker Accommodation',
      `${unconfirmedSpeakers} speaker(s) for ${eventTitle} still need accommodation confirmation.`,
      'accommodation',
      'warning',
      eventTitle,
      `/organizer/accommodation`
    );
  }
  return null;
}

/**
 * Check for inventory issues
 */
export function checkInventoryAlert(
  eventTitle: string,
  lowStockItems: string[]
): SmartAlert | null {
  if (lowStockItems.length > 0) {
    return createSmartAlert(
      'Low Inventory',
      `Goodies inventory low for ${eventTitle}: ${lowStockItems.join(', ')}. Request more from admin.`,
      'inventory',
      'warning',
      eventTitle,
      `/organizer/goodies`
    );
  }
  return null;
}

/**
 * Check for pending approvals
 */
export function checkPendingApprovalsAlert(
  eventTitle: string,
  pendingCount: number
): SmartAlert | null {
  if (pendingCount > 0) {
    return createSmartAlert(
      'Pending Admin Approvals',
      `Your event ${eventTitle} has ${pendingCount} pending approval(s). Check admin dashboard.`,
      'approval',
      'info',
      eventTitle,
      `/admin/approvals`
    );
  }
  return null;
}

/**
 * Create event reminder notification
 */
export function createEventReminderNotification(
  eventTitle: string,
  daysUntil: number,
  userRole: 'speaker' | 'attendee'
): Notification {
  const message = `${eventTitle} is happening in ${daysUntil} day(s). ${
    userRole === 'speaker'
      ? 'Please confirm your attendance and prepare your presentation.'
      : 'Check your accommodation and travel arrangements.'
  }`;

  return createNotification(
    'Event Reminder',
    message,
    'info',
    userRole === 'speaker' ? '/speaker' : '/attendee',
    'View Event'
  );
}

/**
 * Format notification for display
 */
export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

/**
 * Get notification icon color based on type
 */
export function getNotificationColor(type: NotificationType): string {
  const colors = {
    info: 'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    error: 'text-red-600 bg-red-50',
  };
  return colors[type];
}

/**
 * Get alert icon color based on severity
 */
export function getAlertColor(severity: SmartAlert['severity']): string {
  const colors = {
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    error: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[severity];
}
