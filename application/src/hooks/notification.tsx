// dependencies
import { createContext, Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

export type NotificationHook = {
	info: (notification: Omit<NotificationProps, 'type'>) => void;
	success: (notification: Omit<NotificationProps, 'type'>) => void;
	warning: (notification: Omit<NotificationProps, 'type'>) => void;
	error: (notification: Omit<NotificationProps, 'type'>) => void;
	clear: () => void;
};

export type NotificationProps = {
	type: 'info' | 'success' | 'warning' | 'error';
	title: string;
	message?: string;
	duration?: number;
};

export const useNotification = (): NotificationHook => {
	const setNotifications = useContext(NotificationContext);

	function info(notification: Omit<NotificationProps, 'type'>): void {
		if (setNotifications === null) return;
		setNotifications((notifications) => [...notifications, { ...notification, type: 'info' }]);
	}

	function success(notification: Omit<NotificationProps, 'type'>): void {
		if (setNotifications === null) return;
		setNotifications((notifications) => [...notifications, { ...notification, type: 'success' }]);
	}

	function warning(notification: Omit<NotificationProps, 'type'>): void {
		if (setNotifications === null) return;
		setNotifications((notifications) => [...notifications, { ...notification, type: 'warning' }]);
	}

	function error(notification: Omit<NotificationProps, 'type'>): void {
		if (setNotifications === null) return;
		setNotifications((notifications) => [...notifications, { ...notification, type: 'error' }]);
	}

	function clear(): void {
		if (setNotifications === null) return;
		setNotifications([]);
	}

	return { info, success, warning, error, clear };
};

export const Notification: FC<NotificationProps> = (props) => {
	const duration: number = props.duration ?? 4000;
	const [expired, setExpired] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => setExpired(true), duration);
	}, [duration]);

	if (expired) return null;

	return (
		<StyledNotification type={props.type}>
			<h4>{props.title}</h4>
			{props.message && <p>{props.message}</p>}
			{/* progres loader */}
		</StyledNotification>
	);
};

type StyledNotificationProps = Pick<NotificationProps, 'type'>;

// animations
const StyledNotification = styled.div<StyledNotificationProps>`
	background-color: white;
	padding: 1ch 2ch;
	width: 350px;

	border-radius: 1ch;
	box-shadow: 0 1ch 1ch #0004;
`;

export type NotificationContextValue = Dispatch<SetStateAction<NotificationProps[]>> | null;
const NotificationContext = createContext<NotificationContextValue>(null);

export const NotificationProvider: FC<any> = (props) => {
	const [notifications, setNotifications] = useState<NotificationProps[]>([]);

	return (
		<NotificationContext.Provider value={setNotifications}>
			{props.children}

			{notifications.length !== 0 && (
				<StyledNotifications>
					{notifications.map((props, index) => (
						<Notification key={index} {...props} />
					))}
				</StyledNotifications>
			)}
		</NotificationContext.Provider>
	);
};

const StyledNotifications = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	margin: 1rem;

	display: flex;
	flex-direction: column;
	gap: 2ch;

	max-height: 100vh;
	overflow: auto;
	padding: 2ch;
`;
