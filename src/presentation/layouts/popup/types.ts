import React from 'react';

export type PopupType =
    | 'alert'
    | 'confirm'
    | 'loading'
    | 'toast'
    | 'actionSheet'
    | 'input'
    | 'custom';

export interface BasePopupConfig {
    type: PopupType;
    message?: string;
    title?: string;
}

export interface AlertPopupConfig extends BasePopupConfig {
    type: 'alert';
    buttonText?: string;
    popupType?: 'info' | 'success' | 'warning' | 'error';
}

export interface ConfirmPopupConfig extends BasePopupConfig {
    type: 'confirm';
    confirmText?: string;
    cancelText?: string;
    confirmStyle?: 'default' | 'destructive';
}

export interface LoadingPopupConfig extends BasePopupConfig {
    type: 'loading';
}

export interface ToastPopupConfig extends BasePopupConfig {
    type: 'toast';
    toastType?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

export interface ActionSheetItem {
    id: string;
    label: string;
    style?: 'default' | 'destructive' | 'cancel';
    icon?: string;
}

export interface ActionSheetPopupConfig extends BasePopupConfig {
    type: 'actionSheet';
    actions: ActionSheetItem[];
}

export interface InputPopupConfig extends BasePopupConfig {
    type: 'input';
    placeholder?: string;
    defaultValue?: string;
    inputType?: 'text' | 'number' | 'email' | 'phone';
    validation?: (value: string) => string | null;
    confirmText?: string;
    cancelText?: string;
}

export interface CustomPopupProps<T> {
    onResolve: (value: T) => void;
    onDismiss: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface CustomPopupConfig extends BasePopupConfig {
    type: 'custom';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props?: Record<string, any>;
}

export type PopupConfig =
    | AlertPopupConfig
    | ConfirmPopupConfig
    | LoadingPopupConfig
    | ToastPopupConfig
    | ActionSheetPopupConfig
    | InputPopupConfig
    | CustomPopupConfig;

export interface PopupState {
    queue: Array<{ id: string; config: PopupConfig }>;
    current: { id: string; config: PopupConfig } | null;
    isVisible: boolean;
    isAnimating: boolean;
}

export type PopupAction =
    | { type: 'SHOW_POPUP'; payload: { id: string; config: PopupConfig } }
    | { type: 'HIDE_POPUP'; payload: { id: string } }
    | { type: 'SHOW_LOADING'; payload: { message?: string } }
    | { type: 'HIDE_LOADING' }
    | { type: 'ANIMATION_COMPLETE' }
    | {
        type: 'SHOW_TOAST';
        payload: {
            message: string;
            toastType?: 'success' | 'error' | 'info' | 'warning';
            duration?: number;
        };
    };
