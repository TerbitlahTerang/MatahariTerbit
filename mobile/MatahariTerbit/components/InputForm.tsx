import React from 'react'
import NativeBaseIcon from './NativeBaseIcon'
import { FormControl, Input, VStack } from 'native-base'

export const InputForm = () => {
  return(<VStack width="90%" mx="3" maxW="300px">
    <FormControl>
      <FormControl.Label _text={{ bold: true }}>
        Monthly Electricity bill
      </FormControl.Label>
      <Input keyboardType='numeric' placeholder='1000000' />
      <FormControl.Label _text={{ bold: true }}>
        Connection power
      </FormControl.Label>
      <Input keyboardType='numeric' placeholder='1000000' />
    </FormControl>
  </VStack>)
}