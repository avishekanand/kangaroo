import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    username: string;
    created_at: string;
}

interface UserContextType {
    user: User | null;
    users: User[];
    setUser: (user: User) => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/users');
                const data = await response.json();
                setUsers(data);

                // Restore session or default to first user
                const storedUserId = localStorage.getItem('userId');
                if (storedUserId) {
                    const found = data.find((u: User) => u.id === parseInt(storedUserId));
                    if (found) setUser(found);
                } else if (data.length > 0) {
                    setUser(data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSetUser = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('userId', newUser.id.toString());
    };

    return (
        <UserContext.Provider value={{ user, users, setUser: handleSetUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
