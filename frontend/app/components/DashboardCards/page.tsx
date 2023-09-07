import React from 'react'

interface Props {
  value: number,
  text: string,
  color: string
}

interface PropsObj {
  props: Props
}

export const DashboardCards = ({props}: PropsObj, key:number) => {
  return (
    <div className={`${props.color} block  shadow-md rounded-lg w-1/4 text-center py-5 lg:py-10 `}>
      <h2 className='text-xl font-semibold mb-2 text-gray-200'>
        {props.value}
      </h2>
      <p className='text-gray-100'>
        {props.text}
      </p>
    </div>
  )
}

export default DashboardCards
