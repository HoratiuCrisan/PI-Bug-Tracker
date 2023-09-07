import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface Properties {
  props: Props
}

interface Props {
  id: number,
  text: string,
  color: string,
  value: number,
  progress: number
}

export const TicketCard = ({props}:Properties, key:number) => {
  return (
    <div className='block w-1/4 bg-white rounded-md shadow-lg text-lg font-bold text-center my-5'>
        <h1 className='my-2'>
          {props.text}
        </h1>
        <div className='w-20 md:w-28 mx-auto mb-5'>
          <CircularProgressbar 
            key={key}
            value={props.progress} 
            text={`${props.value}`} 
            styles={buildStyles({
              pathColor: props.color,
              trailColor: '#d4d4d4',
              textColor: props.color
            })}  
          />
        </div>
    </div>
  )
}
