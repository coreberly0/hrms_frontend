import React from 'react'
import HrDashboard from './HrDashboard';

export default async function page({ params }) {
  const { id } = await params;
  return (
    <div><HrDashboard id={id}/></div>
  )
}
