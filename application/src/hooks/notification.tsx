// dependencies
import { useContext, useState } from 'react';
import { createContext, Dispatch, FC, SetStateAction } from 'react';
import { motion, Variant } from 'framer-motion';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

export type NotificationHook = {
	info: (notification: Omit<NotificationProps, 'type' | 'uuid'>) => void;
	success: (notification: Omit<NotificationProps, 'type' | 'uuid'>) => void;
	warning: (notification: Omit<NotificationProps, 'type' | 'uuid'>) => void;
	error: (notification: Omit<NotificationProps, 'type' | 'uuid'>) => void;
	clear: () => void;
};

export type NotificationProps = {
	type: 'info' | 'success' | 'warning' | 'error';
	onClick?: () => void;
	title: string;
	message?: string;
	duration?: number;
	uuid: string;
};

export const useNotification = (): NotificationHook => {
	const setNotifications = useContext(NotificationContext);

	function info(notification: Omit<NotificationProps, 'type' | 'uuid'>): void {
		if (setNotifications === null) return;
		setNotifications((notifications) => [...notifications, { ...notification, type: 'info', uuid: uuid() }]);
	}

	function success(notification: Omit<NotificationProps, 'type' | 'uuid'>): void {
		if (setNotifications === null) return;
		setNotifications((notifications) => [...notifications, { ...notification, type: 'success', uuid: uuid() }]);
	}

	function warning(notification: Omit<NotificationProps, 'type' | 'uuid'>): void {
		if (setNotifications === null) return;
		setNotifications((notifications) => [...notifications, { ...notification, type: 'warning', uuid: uuid() }]);
	}

	function error(notification: Omit<NotificationProps, 'type' | 'uuid'>): void {
		if (setNotifications === null) return;
		setNotifications((notifications) => [...notifications, { ...notification, type: 'error', uuid: uuid() }]);
	}

	function clear(): void {
		if (setNotifications === null) return;
		setNotifications([]);
	}

	return { info, success, warning, error, clear };
};

// stacking issue, unmounting error
export const Notification: FC<NotificationProps> = (props) => {
	type AnimationVariants = 'mounting' | 'mounted' | 'unmounting';

	const mountedDuration = 0.5;
	const unmountingDuration = 1;

	const duration: number = props.duration ?? 4000;
	const [animationVariant, setAnimationVariant] = useState<AnimationVariants>('mounting');
	const setNotifications = useContext(NotificationContext);

	function handleClick(): void {
		if (setNotifications === null) return;
		setAnimationVariant('unmounting');
	}

	function handleAnimationEnd(variant: AnimationVariants) {
		if (variant === 'mounting') {
			setAnimationVariant('mounted');
		}

		if (variant === 'mounted') {
			setTimeout(() => {
				setAnimationVariant('unmounting');
			}, duration);
		}

		if (variant === 'unmounting') {
			if (setNotifications === null) return;
			setNotifications((notifications) => notifications.filter(({ uuid }) => uuid !== props.uuid));
		}
	}

	const variants: Record<AnimationVariants, Variant> = {
		mounting: {
			x: '110%',
			scale: 0.5,
			opacity: 0,
		},

		mounted: {
			x: '0%',
			scale: 1,
			opacity: 1,
			transition: { duration: mountedDuration, type: 'spring' },
		},

		unmounting: {
			x: '110%',
			scale: 0.5,
			opacity: 0,
			transition: { duration: unmountingDuration, type: 'spring' },
		},
	};

	return (
		<StyledNotification
			className={props.type}
			onClick={props.onClick ?? handleClick}
			variants={variants}
			initial={{ x: '110%' }}
			animate={animationVariant}
			onAnimationComplete={handleAnimationEnd}
		>
			<div className="notification-content-container">
				<h4>{props.title}</h4>
				{props.message && <p>{props.message}</p>}
			</div>

			<svg>
				<rect x={0} y={0} height="100%" width="100%" fill="transparent" />
				<motion.rect
					initial={{ width: '0%' }}
					animate={{ width: '100%' }}
					transition={{ delay: mountedDuration, duration: duration / 1000, ease: 'linear' }}
					x={0}
					y={0}
					height="100%"
					width="100%"
					fill="red"
				/>
			</svg>
		</StyledNotification>
	);
};

const StyledNotification = styled(motion.div)`
	background-color: white;
	width: 350px;

	border-radius: 1ch;
	box-shadow: 0 1ch 1ch #0004;
	overflow: hidden;

	display: flex;
	flex-direction: column;

	.notification-content-container {
		padding: 1ch 2ch;
	}

	svg {
		width: 100%;
		height: 0.6ch;
	}

	&.info {
		h4 {
			color: dodgerblue;
		}
	}

	&.success {
		h4 {
			color: limegreen;
		}
	}

	&.warning {
		h4 {
			color: orange;
		}
	}

	&.error {
		h4 {
			color: tomato;
		}
	}
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
	padding: 2ch;

	display: flex;
	flex-direction: column;
	gap: 2ch;

	max-height: 100vh;
	overflow: auto;
	padding: 2ch;
`;
