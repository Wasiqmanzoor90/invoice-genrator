"use client";

import React, { useEffect, useState } from 'react';
import InvoiceForm from '../../../component/invoiceForm';
import isAuthorised from '../../../../utils/isAuthorized';
import { useRouter } from "next/navigation";

function Form() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    (async () => {
      const verify = await isAuthorised();
      if (!verify) {
        router.push('/');
      } else {
        setLoading(false);
        console.log("ok");
      }
    })();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <InvoiceForm/>
    </div>
  );
}

export default Form;
