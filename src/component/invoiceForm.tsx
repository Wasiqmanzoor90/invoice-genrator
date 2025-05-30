"use client"

import React, { useState } from 'react'
import CompanyinfoForm from './componyinfoForm'
import { Company } from '../../types/invoice'
import ClientinfoForm from './clientinfoForm';
import { Client } from '../../types/invoice';

function InvoiceForm() {
  const[company, setCompany] = useState<Company>
  ({
    Name: '',
    Phone: '',
    Email: '',
    Adress: ''
  });

  const[client, setClient] = useState<Client>
  ({
    Name: '',
    Email: '',
    Address: ''
   
  });

  return (
    
      <div style={{backgroundColor: "#f7f8fa"}}>
        <CompanyinfoForm
          company={company}
          onChange={setCompany}
        />

        <ClientinfoForm
        client={client}
        onChange={setClient}
        />
      </div>
    
  )
}

export default InvoiceForm