import React, { ReactElement } from 'react'
import Footer from '../../../features/common/Footer'
import Score from './components/Score'
import Stats from './components/Stats'
import Stories from './components/Stories'

interface Props {
    leaderboard:any
}

export default function index({leaderboard}: Props): ReactElement {
    return (
        <div>
            <Score leaderboard={leaderboard} />
            
            <Stats/>
            <Stories/>
            <Footer/>
        </div>
    )
}
