import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import './i18n'
import { Suspense } from 'react'

ReactDOM.render(<Suspense fallback="loading..." ><App /></Suspense>, document.getElementById('root'));