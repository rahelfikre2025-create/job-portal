import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; 

const ProtectedRoute = ({ children }) => {
    
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const location = useLocation(); 

    
    const ADMIN_ROLE = "Administrator";
    const RECRUITER_ROLE = "Recruiter";

    
    useEffect(() => {
       
        if (!user) {
            
            navigate("/login"); 
            return;
        }

        const userRole = user.role;
        const currentPath = location.pathname;

        
        let isAuthorized = false;

       
        if (currentPath.startsWith("/super-admin")) {
            
            if (userRole === ADMIN_ROLE) {
                isAuthorized = true;
            } else {
                
                console.warn(`Access Denied: ${userRole} tried to access ${currentPath}`);
                navigate("/"); 
                return;
            }
        } 
        
      
        else if (currentPath.startsWith("/admin")) {
            // Only Administrators may access /admin pages
            if (userRole === ADMIN_ROLE) {
                isAuthorized = true;
            } else {
                console.warn(`Access Denied: ${userRole} tried to access ${currentPath}`);
                navigate("/"); 
                return;
            }
        }
        else if (currentPath.startsWith("/recruiter")) {
            // Only Recruiters may access /recruiter pages
            if (userRole === RECRUITER_ROLE) {
                isAuthorized = true;
            } else {
                console.warn(`Access Denied: ${userRole} tried to access ${currentPath}`);
                navigate("/");
                return;
            }
        }
        
       
        else {
             isAuthorized = true;
        }


    }, [user, navigate, location.pathname]); 


    if (!user) {
        return null;
    }


    return <>{children}</>; 
};

export default ProtectedRoute;