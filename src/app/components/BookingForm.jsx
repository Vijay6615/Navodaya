'use client';
import {useState} from 'react'
import { useRouter } from 'next/navigation'

export default function BookingForm(){
  const router = useRouter()
  const [form,setForm] = useState({name:'',phone:'',puja:'Ganesh Puja',date:'',time:'8:00 AM - 10:00 AM',address:''})

  function change(e){ setForm({...form,[e.target.name]: e.target.value}) }

  function submit(e){
    e.preventDefault()
    const bookings = JSON.parse(localStorage.getItem('bookings')||'[]')
    const id = Date.now()
    const newBooking = {...form,id,ref: Math.random().toString(36).slice(2,9).toUpperCase(),status:'Pending'}
    bookings.push(newBooking)
    localStorage.setItem('bookings',JSON.stringify(bookings))
    router.push(`/booking/confirmation?id=${id}`)
  }

  return (
    <form onSubmit={submit} className="frosted">
      <label>Select Puja
        <select name="puja" value={form.puja} onChange={change} style={{display:'block',width:'100%',padding:10,marginTop:6}}>
          <option>Ganesh Puja</option>
          <option>Satyanarayan</option>
          <option>Havan</option>
        </select>
      </label>

      <label style={{display:'block',marginTop:12}}>Name
        <input name="name" value={form.name} onChange={change} required style={{display:'block',width:'100%',padding:10,marginTop:6}}/>
      </label>

      <label style={{display:'block',marginTop:12}}>Phone
        <input name="phone" value={form.phone} onChange={change} required style={{display:'block',width:'100%',padding:10,marginTop:6}}/>
      </label>

      <label style={{display:'block',marginTop:12}}>Date
        <input type="date" name="date" value={form.date} onChange={change} required style={{display:'block',width:'100%',padding:10,marginTop:6}}/>
      </label>

      <label style={{display:'block',marginTop:12}}>Address
        <input name="address" value={form.address} onChange={change} style={{display:'block',width:'100%',padding:10,marginTop:6}}/>
      </label>

      <div style={{marginTop:12}}>
        <button className="btn" type="submit">Confirm Booking</button>
      </div>
    </form>
  )
}
