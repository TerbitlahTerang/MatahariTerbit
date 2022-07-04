import { Coordinate, mapStore } from '../util/mapStore'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import { Avatar, List, Space } from 'antd'
import {
  FacebookOutlined,
  InstagramOutlined, LinkedinOutlined,
  LinkOutlined,
  PhoneOutlined, WhatsAppOutlined
} from '@ant-design/icons'

interface Vendor {
  icon: string
  name: string
  description: string
  location: Coordinate,
  details: VendorDetails
}

interface VendorDetails {
  link: string,
  phone: string,
  address: string
  instagram?: string
  facebook?: string
  whatsapp?: string
  linkedin?: string
}

const vendors: Vendor[] = [
  {
    icon: 'assets/vendors/smartenergytech/icon.png',
    description: 'Have your own smart solar energy system, anywhere in Indonesia.',
    name: 'Smart Energy Tech',
    location: {
      lat: -8.6728578,
      lng: 115.2563974
    },
    details: {
      phone: '+62 812-3742-6724',
      address: 'Jl. Bypass Ngurah Rai No.180, Denpasar, Bali',
      link: 'https://www.smartenergy.tech/solar-panel-indonesia',
      instagram: 'https://www.instagram.com/smartenergy.tech/',
      whatsapp: 'https://wa.link/4d241n'
    }
  },
  {
    icon: 'assets/vendors/bti/icon.png',
    description: 'Hemat Tagihan Listrik Sayangi Lingkungan Bersama BTI Energy.',
    name: 'BTI Solar Panel di Bali',
    location: {
      lat: -8.6728578,
      lng: 115.2563974
    },
    details: {
      link: 'https://btienergy.id/',
      phone: '+62 819-1671-7995',
      address: 'Jl. Antasura No.50 Denpasar Denpasar, Bali',
      instagram: 'https://www.instagram.com/bti.energy/',
      facebook: 'https://www.facebook.com/BTI.energy/'
    }
  },
  {
    icon: 'assets/vendors/taiyo/icon.png',
    description: 'Listrik surya hijaukan dunia.\n TakaEnergi merupakan bagian dari PT Taiyo Global Persada Energi.',
    name: 'TakaEnergi',
    location: {
      lat: -6.2486205,
      lng: 106.8812313
    },
    details: {
      link: 'http://www.taiyoglobal.com/',
      phone: '+62 218-6615-774',
      address: 'Graha Inspirasi. Jalan Manunggal Pratama No. 8, Jakarta',
      linkedin: 'https://www.linkedin.com/company/taiyo-global-persada-energi/'
    }
  },
  {
    icon: 'assets/vendors/fsi/icon.png',
    description: 'French Solar Industry produces its own panels with the latest technology, performance and warranties on the market.',
    name: 'French Solar Industry',
    location: {
      lat: -8.7039336,
      lng: 115.1738993
    },
    details: {
      link: 'https://frenchsolarindustry.com/',
      phone: '+62 812-3687-9516',
      address: 'Jalan Dewi Sri II A, Legian, Kuta Bali 80361',
      facebook: 'https://www.facebook.com/French-Solar-Industry-445018702701046/'
    }
  }
]

const asin = Math.asin
const cos = Math.cos
const sin = Math.sin
const PI_180 = Math.PI / 180

function hav(x: number) {
  const s = sin(x / 2)
  return s * s
}

function relativeHaversineDistance(a: Coordinate, b: Coordinate) {
  const aLatRad = a.lat * PI_180
  const bLatRad = b.lat * PI_180
  const aLngRad = a.lng * PI_180
  const bLngRad = b.lng * PI_180

  const ht = hav(bLatRad - aLatRad) + cos(aLatRad) * cos(bLatRad) * hav(bLngRad - aLngRad)
  // since we're only interested in relative differences instead of real distances,
  // there no need to multiply by earth radius or to sqrt the squared differences
  return asin(ht)
}

export const VendorList: React.FunctionComponent = () => {

  const [position, setPosition] = useState<Coordinate|undefined>(undefined)
  const sortedVendors: Vendor[] = useMemo(() => {
    if (position) {
      const res = vendors.sort((a: Vendor, b: Vendor) => relativeHaversineDistance(a.location, position) - relativeHaversineDistance(b.location, position))
      return res
    } else return []
  }, [position])

  useLayoutEffect(() => {
    mapStore.subscribe((state) => {
      setPosition(state.location)
    })
  }, [])

  if (!position) return(<></>)

  return (<List itemLayout="vertical" size="large" dataSource={sortedVendors}
    renderItem={(item: Vendor) =>(<List.Item key={item.name}
      actions={[
        <Space><a href={`tel: ${item.details.phone}`}><PhoneOutlined /></a></Space>,
        <Space><a href={item.details.link} target='_blank'><LinkOutlined /></a></Space>,
        item.details.instagram ? <Space><a href={item.details.instagram} target='_blank'><InstagramOutlined /></a></Space>: undefined,
        item.details.facebook ? <Space><a href={item.details.facebook} target='_blank'><FacebookOutlined /></a></Space>: undefined,
        item.details.linkedin ? <Space><a href={item.details.linkedin} target='_blank'><LinkedinOutlined /></a></Space>: undefined,
        item.details.whatsapp ? <Space><a href={item.details.whatsapp} target='_blank'><WhatsAppOutlined /></a></Space>: undefined
      ].filter(x => x !== undefined)}
    >
      <List.Item.Meta avatar={<Avatar shape='square' src={item.icon} />} title={<a href={item.details.link}>{item.name}</a> }
        description={item.description}
      />

    </List.Item>)}
  >
        
  </List>)
}