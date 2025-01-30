import React from 'react'
import { motion } from 'framer-motion';

const Anime = ({ children, val = 0, position = 'bottomTop' }) => {

    const motionParams = (axis = 'y') => ({
        initial: { opacity: 0, [axis]: 100 },
        animate: { opacity: 1, [axis]: 0 },
        exit: { opacity: 0, [axis]: -100 },
        transition: { duration: 0.3 },
    })

    const animePosition = {
        'bottomTop': motionParams('y'),
        'rightLeft': motionParams('x')
    }

    return (
        <motion.div
            key={val}
            {...animePosition[position]}
        >
            {children}
        </motion.div>
    )
}

export default Anime
