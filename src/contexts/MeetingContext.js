import React, { useContext, useState, useEffect } from 'react'
//import { MeetingArray } from '../database/database'

const MeetingContext = React.createContext()

export function useMeeting() {
    return useContext(MeetingContext)
}

export function MeetingProvider({ children }) { 
    const [meetings, setMeetings] = useState(getMeetings())
    const [loading, setLoading] = useState(true)
    
    function getMeetings() {
        return null
        //return MeetingArray()
    }

    useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <MeetingContext.Provider value={ meetings }>
            {!loading && children}
        </MeetingContext.Provider>
    )
}