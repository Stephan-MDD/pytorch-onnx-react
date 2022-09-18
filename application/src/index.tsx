// dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/roboto';

// resources
import { App } from './components/app';
import { GlobalStyle } from './styles/global';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<React.StrictMode>
		<App />
		<GlobalStyle />
	</React.StrictMode>
);
