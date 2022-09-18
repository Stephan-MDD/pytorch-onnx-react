// dependencies
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
	:root {
		font-size: 10px;
		font-family: "Roboto", sans-serif;
	}

	body {
		font-size: 16px;
		margin: 0;
		background: rgb(140,60,255);
		background: linear-gradient(60deg, #8c3cff 0%, #7ed2ff 100%);
		box-sizing: border-box;
	}

	#root {
		position: relative;
		height: 100vh;
		width: 100vw;

		display: flex;
		align-items: center;
		justify-content: center;
	}
`;
