import 'antd/dist/antd.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import './i18n'
import './index.css'

ReactDOM.render(<Suspense fallback="loading..." ><App /></Suspense>, document.getElementById('root'))
