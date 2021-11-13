import { Card, Select } from 'antd'
import React from 'react'
import InputForm from './InputForm'
import { useTranslation } from "react-i18next";

export default function App() {
    const {t, i18n} = useTranslation()

    const changeLanguage = (value: string) => {
        i18n.changeLanguage(value)
    }

    return (
        <div className="container">
            <Card title={t('languageSelector')}>
                <Select onChange={changeLanguage}>
                    <Select.Option key="en" value="en-US">EN</Select.Option>
                    <Select.Option key="id" value="id-ID">ID</Select.Option>
                </Select>
            </Card>
            <Card title={t('title')}>
                <InputForm/>
            </Card>
        </div>
    )
}
