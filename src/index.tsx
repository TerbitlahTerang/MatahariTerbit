import 'antd/dist/reset.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { QueryParamProvider } from 'use-query-params'
import './i18n'
import './index.css'
import { LoadingOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const url = new URL(window.location.href)
if (url.searchParams.has('enc')) {
  const pars = url.searchParams.get('enc') ?? ''
  const decoded = decodeURIComponent(pars)
  window.location.search = decoded
}

ReactDOM.render(<Suspense fallback={<div className="container"><LoadingOutlined style={{ fontSize: 32 }}  spin /></div>} >
  <QueryParamProvider >
    <ConfigProvider theme={{ hashed: false }}>
      <App />
    </ConfigProvider>
  </QueryParamProvider>
</Suspense>, document.getElementById('root'))
