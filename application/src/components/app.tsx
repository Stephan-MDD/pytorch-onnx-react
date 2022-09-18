// dependencies
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { InferenceSession, Tensor } from 'onnxjs';

// resources
import { NotificationProvider } from '../hooks/notification';
import { Canvas, CanvasRef } from './canvas';
import { Diagram } from './diagram';
// import { Network } from './network';
import { Icon } from './icon';

import { matrixReducer } from '../utilities/matrix-reducer';

export const App: FC = () => {
	const canvasSize = 280;

	const [predictions, setPredictions] = useState<number[]>(Array(10).fill(0));
	const [inferenceSession, setInferenceSession] = useState<InferenceSession | null>(null);

	const canvasRef = useRef<CanvasRef>(null);
	const predictionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const loadInferenceSessionModel = useCallback(async (uri: string) => {
		const inferenceSession: InferenceSession = new InferenceSession();

		try {
			await inferenceSession.loadModel(uri);
			setInferenceSession(inferenceSession);
		} catch (error) {
			console.error(error);
			// model not loaded
		}
	}, []);

	useEffect(() => {
		const modelUri = './resources/onnx_model.onnx';
		loadInferenceSessionModel(modelUri);
	}, [loadInferenceSessionModel]);

	function clearCanvas(): void {
		const canvas = canvasRef.current;
		if (canvas === null) return;

		setPredictions(Array(10).fill(0));
		canvas.clear();
	}

	function getPrediction() {
		if (predictions === null) return;

		const maxPrediction: number = Math.max(...predictions);
		const predictionIndexes = predictions.filter((prediction) => prediction === maxPrediction);

		if (predictionIndexes.length !== 1) return null;
		return predictions.indexOf(predictionIndexes[0]);
	}

	function handleOnDraw(): void {
		const canvas = canvasRef.current;
		if (canvas === null || predictionTimeoutRef.current !== null) return;

		const channels: number[][] | null = canvas.getAlphaChannels();
		if (channels === null) return;

		predictionTimeoutRef.current = setTimeout(async () => {
			await predict(channels);
			predictionTimeoutRef.current = null;
		}, 500);
	}

	async function predict(channels: number[][]): Promise<void> {
		if (inferenceSession === null) return;
		let features: number[];

		try {
			const reduceMatrix = matrixReducer(channels, 28, 28);
			features = reduceMatrix.flat();
		} catch (error) {
			console.error((error as Error).message);
			return; // show notification
		}

		const featureTensor = new Tensor(new Float32Array(features), 'float32', [1, 28 ** 2]);
		const resultMap = await inferenceSession.run([featureTensor]);
		const [prediction] = Array.from(resultMap.values());
		const predictionValues = prediction.data.map((value) => Number(value));
		setPredictions(Array.from(predictionValues));
	}

	return (
		<NotificationProvider>
			<StyledMain>
				<h1>{getPrediction() ?? '?'}</h1>
				<div>
					<div className="caption-container">
						<h2>PyTorch MNIST</h2>
						<button onClick={clearCanvas}>
							<Icon symbol="trashcan" />
						</button>
					</div>
					<Canvas ref={canvasRef} size={canvasSize} onDraw={handleOnDraw} />
				</div>

				<Diagram predictions={predictions} />

				{/* <Network /> */}
			</StyledMain>
		</NotificationProvider>
	);
};

const StyledMain = styled.main`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	position: relative;

	h1 {
		position: absolute;
		color: #fff4;
		font-size: 80vh;
		right: 10vw;
		user-select: none;
	}

	.caption-container {
		color: #fff;
		display: flex;
		justify-content: space-between;
	}

	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		font-size: 2rem;
		transition: all 350ms;
		position: relative;
	}
`;
