import React from 'react'

function StatusCard({ title, value }) {
    return (
        <div className="w-2/12 rounded-xl shadow-2xl bg-gray-100 rouded-xl border-t-4 border-indigo-500 hover:animate-pulse">
            <div className="flex flex-col">
                <span className='w-full bg-white rounded-t-xl p-3 text-center font-bold text-gray-600 text-sm'>{title}</span>
                <span className=' text-center p-3 font-bold text-gray-500 text-sm'>{value}</span>
            </div>
        </div>
    )
}

export default StatusCard
