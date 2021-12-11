import React from 'react'
import { Workbox, messageSW } from 'workbox-window'
import { Button } from 'antd'

export default function ServiceWorkerIntegration() {
  const workbox = new Workbox(import.meta.env.SNOWPACK_PUBLIC_SERVICE_WORKER)
  const [updateNotificationOpen, setUpdateNotificationOpen] = React.useState(false)
  const [registration, setRegistration] = React.useState<ServiceWorkerRegistration>()

  const showSkipWaitingPrompt = () => {
    setUpdateNotificationOpen(true)
  }

  const updateApplication = (currentRegistration?: ServiceWorkerRegistration) => () => {
    // skip waiting until all service workers are closed to force update
    if (currentRegistration?.waiting) {
      messageSW(currentRegistration.waiting, { type: 'SKIP_WAITING' })
      setUpdateNotificationOpen(false)
      window.location.reload()
    }
  }

  // register service worker on first load if the browser supports it
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Open update prompt because there is an update waiting
      workbox.addEventListener('waiting', showSkipWaitingPrompt)
      workbox.register().then((r) => {
        setRegistration(r)
      })
    }
  }, [])

  return (
    <Button onClick={updateApplication(registration)} color="primary">
    </Button>
  )
}