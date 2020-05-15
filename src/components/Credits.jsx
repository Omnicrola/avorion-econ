import React from "react";

export function Credits({amount}){
    return <span>{Intl.NumberFormat('en-US').format(amount)} Cr</span>
}