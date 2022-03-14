import 'antd/dist/antd.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { QueryParamProvider } from 'use-query-params'
import './i18n'
import './index.css'

ReactDOM.render(<Suspense fallback="loading..." >
  <QueryParamProvider >
    <App />
  </QueryParamProvider>
</Suspense>, document.getElementById('root'))
