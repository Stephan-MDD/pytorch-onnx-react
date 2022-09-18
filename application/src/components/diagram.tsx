// dependencies
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

export type CanvasProps = {
	predictions: number[];
};

export const Diagram: FC<CanvasProps> = ({ predictions }) => {
	function renderBarChart(prediction: number, index: number): ReactNode {
		function getClassName(): string {
			const isHighestPrediction: boolean = prediction !== 0 && prediction === Math.max(...predictions);
			if (isHighestPrediction) return 'diagram-container highest-predicted';
			return 'diagram-container';
		}

		return (
			<div className={getClassName()} key={index}>
				<div className="diagram-bar-container">
					<span className="diagram-bar" style={{ height: prediction * 100 + '%' }} />
				</div>
				<span>{index}</span>
			</div>
		);
	}

	return <StyledSection>{predictions?.map(renderBarChart)}</StyledSection>;
};

const StyledSection = styled.section`
	display: flex;
	gap: 2ch;

	.diagram-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1ch;
		color: white;

		.diagram-bar-container {
			height: 280px;
			width: 1ch;
			border-radius: 1ch;
			background-color: #fff4;
			position: relative;

			.diagram-bar {
				position: absolute;
				width: 100%;
				border-radius: 1ch;
				background-color: #fff;
				bottom: 0;
				left: 0;

				transition: all 350ms;
			}
		}

		span:last-child {
			width: 3ch;
			height: 3ch;
			border-radius: 3ch;
			display: grid;
			place-content: center;
			transition: all 350ms;
			box-sizing: border-box;
		}
	}

	.highest-predicted {
		span:last-child {
			background-color: #7ed2ff;
			border: 2px solid #fff;
		}

		.diagram-bar-container {
			.diagram-bar {
				background-color: #7ed2ff;
				border: 2px solid #fff;
			}
		}
	}
`;
