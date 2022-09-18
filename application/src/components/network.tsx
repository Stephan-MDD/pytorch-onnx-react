// dependencies
import { FC } from 'react';
import styled from 'styled-components';

export type NetworkProps = {};

export const Network: FC<NetworkProps> = (props) => {
	return null;
	return (
		<StyledNetwork>
			<svg height="750" width="750">
				<g>
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="10%" cy="95%" r="3%" stroke="black" strokeWidth="3" fill="red" />
				</g>

				<g>
					<circle cx="40%" cy="5%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="40%" cy="15%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="40%" cy="25%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="40%" cy="35%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="40%" cy="45%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="40%" cy="55%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="40%" cy="65%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="40%" cy="75%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="40%" cy="85%" r="3%" stroke="black" strokeWidth="3" fill="red" />
					<circle cx="40%" cy="95%" r="3%" stroke="black" strokeWidth="3" fill="red" />
				</g>
			</svg>
		</StyledNetwork>
	);
};

const StyledNetwork = styled.div``;
