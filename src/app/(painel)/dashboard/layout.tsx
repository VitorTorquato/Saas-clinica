import React, { ReactNode } from 'react'
import { SideBarDashboard } from './_components/SideBar'

export default function Dashboardlayout({children}: { children: ReactNode}) {
  return (
    <>
       <SideBarDashboard>
        {children}
       </SideBarDashboard>
    </>
  )
}
