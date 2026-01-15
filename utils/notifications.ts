export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

type Listener = (notifications: Notification[]) => void;
let notifications: Notification[] = [];
let listeners: Listener[] = [];

export const notificationService = {
    subscribe(listener: Listener) {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },

    notify(message: string, type: NotificationType = 'success') {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification = { id, message, type };
        notifications = [...notifications, newNotification];
        this.emit();

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.remove(id);
        }, 5000);
    },

    remove(id: string) {
        notifications = notifications.filter(n => n.id !== id);
        this.emit();
    },

    emit() {
        listeners.forEach(l => l(notifications));
    }
};

export const showSuccess = (msg: string) => notificationService.notify(msg, 'success');
export const showError = (msg: string) => notificationService.notify(msg, 'error');
export const showInfo = (msg: string) => notificationService.notify(msg, 'info');
