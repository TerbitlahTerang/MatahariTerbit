import { Card } from 'antd'
import React from 'react'
import InputForm from './InputForm'

export default function App() {
  return (
    <div className="container">
      <Card title="Solar panel calculator">
        <InputForm />
      </Card>
    </div>
  )
}
