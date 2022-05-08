import 'antd/dist/antd.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { QueryParamProvider } from 'use-query-params'
import './i18n'
import './index.css'
import { Spin } from 'antd'

ReactDOM.render(<Suspense fallback={<div className="container"><Spin size='large' /></div>} >
  <QueryParamProvider >
    <App />
  </QueryParamProvider>
</Suspense>, document.getElementById('root'))
