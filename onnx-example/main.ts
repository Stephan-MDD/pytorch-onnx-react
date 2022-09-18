import { InferenceSession, Tensor } from 'onnxjs';

(async () => {
	/*
	[
		[4, 8, 12, 16]
		[4, 8, 12, 16]
		[4, 8, 12, 16]
		[4, 8, 12, 16]
		...
	]
	
	
	*/

	const featureMatrix = [
		[1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
		[1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
		[1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
		[1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
		[5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8],
		[5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8],
		[5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8],
		[5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8],
		[9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12],
		[9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12],
		[9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12],
		[9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12],
		[13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16],
		[13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16],
		[13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16],
		[13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16],
	];

	const reducedMatrix = getReduceMatrix(featureMatrix, 4, 4);
	console.log(reducedMatrix);
})();

function getReduceMatrix(matrix: number[][], height: number, width: number): number[][] {
	if (matrix.length % height !== 0 || matrix[0].length % width !== 0) {
		throw new Error('Cant scale to non integer ratio');
	}

	const reduceMatrix: number[][] = [];
	const reduceWidthMatrix: number[][] = [];
	const heightRatio: number = matrix.length / height;
	const widthRatio: number = matrix[0].length / width;

	for (const rowIndex in matrix) {
		const row: number[] = matrix[rowIndex];
		const reducedRow: number[] = [];

		for (const columnIndex in row) {
			const targetIndex: number = Math.floor(Number(columnIndex) / widthRatio);
			if (reducedRow[targetIndex] === undefined) reducedRow[targetIndex] = 0;
			reducedRow[targetIndex] += row[columnIndex];
		}

		reduceWidthMatrix[rowIndex] = reducedRow;
	}

	for (const rowIndex in reduceWidthMatrix) {
		const row: number[] = reduceWidthMatrix[rowIndex];

		for (const columnIndex in row) {
			const targetRowIndex: number = Math.floor(Number(rowIndex) / heightRatio);
			if (reduceMatrix[targetRowIndex] === undefined) reduceMatrix[targetRowIndex] = [];
			if (reduceMatrix[targetRowIndex][columnIndex] === undefined) reduceMatrix[targetRowIndex][columnIndex] = 0;
			reduceMatrix[targetRowIndex][columnIndex] += row[columnIndex];
		}
	}

	return reduceMatrix;
}
