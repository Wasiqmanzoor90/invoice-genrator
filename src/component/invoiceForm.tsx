import React from 'react'
import CompanyinfoForm from './componyinfoForm'

function invoiceForm() {
  return (
    
      <div>
        <CompanyinfoForm
          company={{ Name: '', Phone: '', Email: '' }}
          onChange={() => {}}
        />
      </div>
    
  )
}

export default invoiceForm