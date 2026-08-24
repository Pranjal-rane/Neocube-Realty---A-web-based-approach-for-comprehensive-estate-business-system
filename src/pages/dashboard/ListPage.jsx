import { Link } from 'react-router-dom'

export default function ListPage({type}){
  const visit=type==='visits'
  const title=visit?'My Site Visits':'My Inquiries'
  const data=JSON.parse(localStorage.getItem(visit?'neoVisits':'neoInquiries')||'[]')
  return <div><p className="text-xs font-bold uppercase tracking-widest text-wine-700">Customer Dashboard</p><h1 className="mt-2 font-display text-4xl font-bold">{title}</h1><div className="card mt-7 overflow-x-auto p-4 md:p-6">{data.length?<table className="min-w-[700px] w-full text-left text-sm"><thead><tr className="border-b bg-wine-50"><th className="p-3">#</th><th className="p-3">Name</th><th className="p-3">Property</th><th className="p-3">{visit?'Visit Date':'Budget'}</th><th className="p-3">Created</th></tr></thead><tbody>{data.map((item,index)=><tr className="border-b last:border-0" key={index}><td className="p-3">{index+1}</td><td className="p-3">{item.name||'—'}</td><td className="p-3">{item.property||'—'}</td><td className="p-3">{visit?`${item.date||'—'} ${item.time||''}`:(item.budget||'—')}</td><td className="p-3">{item.createdAt||'—'}</td></tr>)}</tbody></table>:<div className="py-12 text-center text-sm text-gray-500">No records yet.<div><Link className="btn-primary mt-4" to={visit?'/schedule-visit':'/inquiry'}>{visit?'Schedule a Site Visit':'Send an Inquiry'}</Link></div></div>}</div></div>
}
