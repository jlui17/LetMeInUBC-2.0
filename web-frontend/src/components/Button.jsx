import React from "react";
import { Link } from "react-router-dom";

export const Button = ({
    children,
    className,
    onClick,
    Path,
    Target,

}) => {
    return (
        <Link to={Path} target={Target} className="btn-nav"> 
            <button className={className} onClick={onClick}>
                {children}
            </button>
        </Link >
    ) 
    
}