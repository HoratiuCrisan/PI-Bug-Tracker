"use client"
import React, {useState} from 'react'
import { ProfileDescription } from '../ProfileDescription/page'
import {AiOutlineDashboard} from 'react-icons/ai'
import {SlPuzzle} from 'react-icons/sl'
import {IoTicketOutline, IoDiamondOutline} from 'react-icons/io5'
import {IoIosArrowForward, IoIosArrowDown} from 'react-icons/io'
import {GoDot} from 'react-icons/go'
import { useAppContext } from '../AppContext/page'
import generateUserData from '../ProtectedRouter/route'

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface Props {
  props: User
}

export const Sidebar = ({props}:Props) => {
  const userData = generateUserData()
  const {setActiveComponent} = useAppContext()
  const [openProjects, setOpenProjects] = useState<boolean>(false)
  const [openTickets, setOpenTickets] = useState<boolean>(false)

  //Sidebar items 
  const items = 
  [
    {
        name: 'Dashboard',
        href: '/',
        icon: <AiOutlineDashboard />,
    },
    {
        name: 'Projects',
        icon: <SlPuzzle />,
        isOpened: openProjects,
        options: () => {setOpenProjects(!openProjects)},
        values: [
          {
            valueName: 'All Projects',
            valueHref: '/AllProjects'
          }, 
          {
            valueName: 'My Projects',
            valueHref: '/MyProjects'
          },
          {
            valueName: 'Create Project',
            valueHref: '/CreateProject'
          },
          {
            valueName: 'Archived Projects',
            valueHref: '/ArchivedProjects'
          }
        ]
    },
    {
        name: 'Tickets',
        icon: <IoTicketOutline />,
        isOpened: openTickets,
        options: () => {setOpenTickets(!openTickets)},
        values: [
          {
            valueName: 'All Tickets',
            valueHref: '/AllTickets'
          }, 
          {
            valueName: 'My Tickets',
            valueHref: '/MyTickets'
          },
          {
            valueName: 'Create Ticket',
            valueHref: '/AddTicket'
          },
          {
            valueName: 'Archived Tickets',
            valueHref: '/ArchivedTickets'
          }
        ]
    },
    //Admin shoud be visible only to those with Admin Role
    {
      name: 'Admin',
      href: '/Admin',
      icon: <IoDiamondOutline />,
    }
  ]

  return (
    <aside className="w-64 bg-gray-100">
      <ProfileDescription props={props}/>
        <ul className="ml-2">
          {/* If the object contains an options parameter than it is a dropdown menu and not a link*/}
          {
            items.map((elem, index) => (
            <div key={index}> {/* Adding key to the outermost div */}
              {'options' in elem ? 
              (
                <div>
                  <div
                    onClick={elem.options}
                    className="flex mt-5 ml-4 hover:ml-5 cursor-pointer"
                  >
                    <span className="text-blue-600 text-xl mt-0.5">
                      {elem.icon}
                    </span>
                    <li
                      key={elem.href} 
                      className="ml-4 text-lg"
                    >
                      {elem.name}
                    </li>
                    {/* Change the arrow icon depending on the state of the menu */}
                    {
                      elem.isOpened === false ? 
                      (
                        <IoIosArrowForward 
                          size={10} 
                          className="ml-5 mt-2.5" 
                        />
                      ) : (
                        <IoIosArrowDown 
                          size={10}
                          className="ml-5 mt-2.5" 
                        />
                      )
                    }
                  </div>
                  {/* display the subitems of the menu if it is opened */}
                  {
                    elem.isOpened === true ? 
                    (
                      <div className="mt-3 ml-8">
                        {elem.values.map((item, subIndex) => 
                          (
                           (item.valueName === 'Archived Tickets' || item.valueName === "Archived Projects" || item.valueName === "Create Project") && userData.role.toLowerCase() !== 'admin'?
                           '' :
                            <div 
                              key={subIndex}
                              onClick={() => setActiveComponent(item.valueName)}
                              className='flex mt-2 cursor-pointer'
                            > 
                              <span>
                                <GoDot  
                                  size={10}
                                  className="text-blue-500 mr-2 mt-1.5" 
                                />
                              </span>
                              <li 
                                key={item.valueName}
                                className="hover:ml-0.5"
                              >
                                {item.valueName}
                              </li>
                            
                            </div>
                          ))
                        }
                      </div>
                    ) : ('')}
                  </div>
              ) 
                : 
              (
                <div >
                  {
                    userData.role.toLowerCase() !== "admin" &&
                    elem.name === "Admin" ?
                    ''
                    :
                    <div className="flex mt-5 ml-4 hover:ml-5">
                      <span className="text-blue-600 text-xl mt-0.5">
                    {elem.icon}
                  </span>

                  {
                    elem.href ? 
                    (
                      <div onClick={() => setActiveComponent(elem.name)}>
                        <li 
                              key={elem.href}
                              className="ml-4 text-lg cursor-pointer"
                            >
                              {elem.name}
                            </li>
                      </div>
                    ) : ('')}
                    </div>
                  }
                </div>
              )
            }
            </div>
          ))}
        </ul>
    </aside>
  );
};
