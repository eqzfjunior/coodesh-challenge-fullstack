'use client'

export interface Summary {
  sellerName: string
  totalSales: number
  totalCommissions: number
  balance: number
}

export interface TableProps {
  items: Summary[]
}

export function Table({ items = [] }: TableProps) {
  return (
    <div className="my-8">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Seller</th>
            <th className="text-left">Total Sales</th>
            <th className="text-left">Total Commission</th>
            <th className="text-left">Balance</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => {
            return (
              <tr key={item.sellerName} data-testid="table-row">
                <td>{item.sellerName}</td>
                <td>{item.totalSales}</td>
                <td>{item.totalCommissions}</td>
                <td>{item.balance}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
