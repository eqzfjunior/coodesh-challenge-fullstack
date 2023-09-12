'use client'

import { Table } from "@/components/Table";
import { Uplaod } from "@/components/Upload";
import iziToast from "izitoast"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [items, setItems] = useState([]);

  const inputRef = useRef<HTMLInputElement>(null)

  async function getData() {
    try {
      const response = await fetch('/api/transactions/summary')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setItems(data)
    } catch (e) {
      iziToast.error({
        title: 'Error',
        message: e?.message || 'Something went wrong'
      })
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleUploadChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files
    
    const body = new FormData()
    body.append('file', files[0])

    async function send() {
      try {
        const response = await fetch('/api/transactions/import', {
          method: 'POST',
          body
        })

        if (!response.ok) {
          throw new Error('Error file upload')
        }

        if (inputRef.current) {
          inputRef.current.value = ''
        }

        getData()
      } catch (e) {
        iziToast.error({
          title: 'Error',
          message: e?.message || 'Error file upload'
        })
      }
    }
    
    send()
  }

  return (
    <main className="max-w-[960px] mx-auto mt-10">
      <Uplaod
        ref={inputRef}
        onChange={handleUploadChange}
      />
      <Table items={items} />
    </main>
  )
}
