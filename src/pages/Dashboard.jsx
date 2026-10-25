import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Routes, Route } from 'react-router-dom';
import { useAccount, useMsal } from '@azure/msal-react';

import AdminView from './AdminView';
import SupervisorView from './SupervisorView';
import ClienteView from './ClienteView';
import { CatalogList } from '../components/CatalogList';
import { getBackendRoles } from '../services/api';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
    const { instance, accounts } = useMsal();
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);

    useEffect(() => {
        if (accounts.length > 0) {
            getBackendRoles(instance).then(r => {
                setRoles(r);
                setLoadingRoles(false);
            });
        }
    }, [instance, accounts]);

    if (loadingRoles) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 h-10 w-10" /></div>;
    }

    let DefaultView = ClienteView;
    if (roles.includes("Admin")) {
        DefaultView = AdminView;
    } else if (roles.includes("Supervisor")) {
        DefaultView = SupervisorView;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
            <Navbar roles={roles} />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<DefaultView />} />
                    <Route path="/catalog" element={<CatalogList />} />
                </Routes>
            </main>
        </div>
    );
}
