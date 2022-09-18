// dependencies
import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { theme } from '../styles/theme';

const icons = {
	trashcan: faTrash,
};

export type IconProps = {
	symbol: keyof typeof icons;
	color?: string;
};

export const Icon: FC<IconProps> = (props) => (
	<FontAwesomeIcon icon={icons[props.symbol]} color={props.color ?? theme.primary.font} />
);
