import React, { use } from 'react'
import { useAuth } from '../../providers/AuthProvider';
import { signout } from '../../_auth/FirebaseAuth';

const Navbar = () => {
    const { AuthState } = useAuth();
    return (
        <div>
            <header className="gov-header">
                <div className="emblem" aria-hidden="true">⚑</div>
                <div className="org">
                    <div className="org-title">National Civic Aid & Services</div>
                    <div className="org-sub">Partnering with NGOs for public welfare</div>
                </div>
                
                <div className="contact">
                    <button className="btn-contact">
                        {AuthState.isAuthenticated ? <button onClick={signout}>Logout</button> : ""}
                    </button>
                </div>
            </header>
        </div>
    )
}
export default Navbar
