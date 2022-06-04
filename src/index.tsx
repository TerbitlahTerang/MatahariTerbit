import 'antd/dist/antd.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { QueryParamProvider } from 'use-query-params'
import './i18n'
import './index.css'
import { LoadingOutlined } from '@ant-design/icons'

ReactDOM.render(<Suspense fallback={<div className="container"><LoadingOutlined style={{ fontSize: 32 }}  spin /></div>} >
  <QueryParamProvider >
    <App />
  </QueryParamProvider>
</Suspense>, document.getElementById('root'))
