import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import ReactPasswordChecklist from "react-password-checklist"; // Import the PasswordChecklist component

const PWD_RULES = ["minLength", "specialChar", "number", "capital", "match"];

const debounce = (cb, time) => {
    let timer;
    return (...args) => {
        if (timer) clearTimeout(timer);  // Clear any previously set timer
        timer = setTimeout(() => {
            cb(...args);  // Only call the callback after the delay
        }, time);
    };
};

const usePasswordChecker = () => {
    const [isFormValid, setIsFormValid] = useState(false);

    const onPasswordCheckerChange = (value) => {
        setIsFormValid(value);
    };

    const debouncedToastFn = useCallback(
        debounce((pwd, confirmPwd) => {
            toast(
                <ReactPasswordChecklist
                    rules={PWD_RULES}
                    minLength={5}
                    value={pwd}
                    valueAgain={confirmPwd}
                    onChange={onPasswordCheckerChange} // Updating form validation state
                />,
                {
                    dismissible: true,
                    duration: Infinity,
                    onDismiss: () => toast.dismiss(),
                }
            );
        }, 500),
        [] // Empty dependency array to ensure it's only created once
    );

    return { debouncedToastFn, isFormValid };
};

export default usePasswordChecker;
