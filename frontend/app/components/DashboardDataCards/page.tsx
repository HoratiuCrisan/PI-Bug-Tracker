import React from 'react'

interface CompanyData {
    text: string,
    icon: Element,
    value: number
}

interface Props {
    props: CompanyData[]
}

export const DashboardDataCards = ({props}:any) => {
  return (
    <div className='w-1/4 bg-gray-50 p-2 rounded-md shadow-xl'>
        <div className='overflow-x-full'>
            {props.map((elem:any) => {
                return (
                   <div className='block my-2' key={elem.id}>
                        <div className='flex gap-2 my-4' >
                            <div className='bg-gray-200 rounded-md p-2 text-2xl my-auto'>
                                {elem.icon}
                            </div>
                            
                            <div className='block w-full'>
                                <h1 className='hidden md:block'>{elem.text}</h1>
                                <h1 className='mt-2 md:mt-0 font-bold'>{elem.value}</h1>
                            </div>
                        </div>
                        {elem.id != props.length &&
                            <hr className='h-px bg-gray-200 border-0'/>
                        }
                   </div>
                )
            })}
        </div>
    </div>
  )
}
