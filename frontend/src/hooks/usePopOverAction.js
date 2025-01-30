import { useState } from 'react'

const usePopOverAction = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleOpenChange = (open) => {
        setIsPopoverOpen(open);
    };

    return {
        isPopoverOpen, setIsPopoverOpen, handleOpenChange
    }
}

export default usePopOverAction
