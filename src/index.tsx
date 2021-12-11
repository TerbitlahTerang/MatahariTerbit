import 'antd/dist/antd.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import './i18n'
import './index.css'

declare global {
  interface ImportMeta {
    hot: {
      accept: Function;
      dispose: Function;
    };
    env: {
      SNOWPACK_PUBLIC_SERVICE_WORKER: string;
      SNOWPACK_PUBLIC_PACKAGE_VERSION: string;
    };
  }
}

ReactDOM.render(<Suspense fallback="loading..." ><App /></Suspense>, document.getElementById('root'))
