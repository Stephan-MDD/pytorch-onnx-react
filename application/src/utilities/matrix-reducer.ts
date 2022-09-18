export function matrixReducer(matrix: number[][], height: number, width: number): number[][] {
	if (matrix.length % height !== 0 || matrix[0].length % width !== 0) {
		throw new Error('Cant reduce to non integer ratio');
	}

	const heightRatio: number = matrix.length / height;
	const widthRatio: number = matrix[0].length / width;

	const reduceMatrix: number[][] = [];
	const reduceWidthMatrix: number[][] = [];

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
