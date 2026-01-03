
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserMenu: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleAvatarClick = () => {
        navigate('/database');
    };

    return (
        <button 
            onClick={handleAvatarClick}
            className="hover:opacity-80 transition-opacity focus:outline-none border-0 bg-transparent p-0 m-0"
            title="View My Database"
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full block" />
            ) : (
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <UserIcon size={16} className="sm:w-5 sm:h-5" />
                </div>
            )}
        </button>
    );
};

export default UserMenu;
