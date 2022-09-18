// dependencies
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { forwardRef, ForwardRefExoticComponent, PointerEvent, RefAttributes } from 'react';
import styled from 'styled-components';

// resources
import { useNotification } from '../hooks/notification';

export type CanvasRef = {
	clear: () => void;
	getChannels(scale?: number): number[][] | null;
	getAlphaChannels(scale?: number): number[][] | null;
};

export type CanvasProps = {
	onDraw?: (...args: any[]) => void;
	size: number;
};

type TCanvas = ForwardRefExoticComponent<CanvasProps & RefAttributes<CanvasRef>>;

export const Canvas: TCanvas = forwardRef<CanvasRef, CanvasProps>((props, ref) => {
	const size: number = props.size;
	const [draw, setDraw] = useState<boolean>(false);
	const lineJoin: CanvasLineJoin = 'round'; //const [lineJoin, setLineJoin] = useState<CanvasLineJoin>('round');
	const lineCap: CanvasLineCap = 'round'; // const [lineCap, setLineCap] = useState<CanvasLineCap>('round');
	const lineWidth = 10; // const [lineWidth, setLineWidth] = useState<number>(14);

	const notification = useNotification();

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const getChannels = useCallback<() => number[][] | null>(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d') ?? null;

		if (canvas === null || context === null) return null;
		const imageData: ImageData = context.getImageData(0, 0, size, size);

		function channelsReducer(channels: number[][], value: number, index: number): number[][] {
			const rowIndex: number = Math.floor(index / 4 / size);
			if (channels[rowIndex] === undefined) channels[rowIndex] = [];

			channels[rowIndex].push(value);
			return channels;
		}

		const channels: number[][] = imageData.data.reduce(channelsReducer, []);
		return channels;
	}, [size]);

	const getAlphaChannels = useCallback<() => number[][] | null>(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d') ?? null;

		if (canvas === null || context === null) return null;
		const imageData: ImageData = context.getImageData(0, 0, size, size);

		function alphaChannelsReducer(alphaChannels: number[][], value: number, index: number): number[][] {
			if ((index + 1) % 4 !== 0) return alphaChannels;

			const rowIndex: number = Math.floor(index / 4 / size);
			if (alphaChannels[rowIndex] === undefined) alphaChannels[rowIndex] = [];

			alphaChannels[rowIndex].push(value);
			return alphaChannels;
		}

		const alphaChannels: number[][] = imageData.data.reduce(alphaChannelsReducer, []);
		return alphaChannels;
	}, [size]);

	useEffect(() => {
		if (ref === null) return;
		(ref as MutableRefObject<CanvasRef>).current = { clear, getAlphaChannels, getChannels };
	}, [ref, getChannels, getAlphaChannels]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas === null) return;

		function handlePointerMove() {
			if (props.onDraw === undefined || draw === false) return;
			props.onDraw();
		}

		canvas.addEventListener('pointermove', handlePointerMove);
		return () => canvas.removeEventListener('pointermove', handlePointerMove);
	}, [props, draw]);

	function clear() {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d') ?? null;

		if (canvas === null || context === null) return;
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	function getPosition(canvas: HTMLCanvasElement, event: PointerEvent<HTMLCanvasElement>): [number, number] {
		const { x: offsetX, y: offsetY } = canvas.getBoundingClientRect();
		const { clientX, clientY } = event;

		const positionX: number = clientX - offsetX;
		const positionY: number = clientY - offsetY;

		return [positionX, positionY];
	}

	function handleDrawBegin(event: PointerEvent<HTMLCanvasElement>): void {
		notification.info({ title: 'Hello World' });

		setDraw(true);

		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d') ?? null;
		if (canvas === null || context === null) return;

		context.lineCap = lineCap;
		context.lineJoin = lineJoin;
		context.lineWidth = lineWidth;

		const [positionX, positionY] = getPosition(canvas, event);
		context.beginPath();
		context.moveTo(positionX, positionY);
	}

	function handleDraw(event: PointerEvent<HTMLCanvasElement>): void {
		if (draw === false) return;

		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d') ?? null;

		if (canvas === null || context === null) return;

		const [positionX, positionY] = getPosition(canvas, event);

		context.lineTo(positionX, positionY);
		context.stroke();
	}

	function handleDrawEnd() {
		setDraw(false);
	}

	return (
		<StyledCanvas
			ref={canvasRef}
			onPointerDown={handleDrawBegin}
			onPointerMove={handleDraw}
			onPointerUp={handleDrawEnd}
			onPointerLeave={() => setDraw(false)}
			height={size}
			width={size}
		/>
	);
});

type StyledCanvasProps = {
	height: number;
	width: number;
};

const StyledCanvas = styled.canvas<StyledCanvasProps>`
	height: ${({ height }) => height}px;
	width: ${({ width }) => width}px;

	box-shadow: 0 2rem 3rem #0004;
	background-color: #fffa;
	border-radius: 10%;
	cursor: crosshair;
`;
