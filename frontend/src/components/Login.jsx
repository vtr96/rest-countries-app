import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/auth/users/login', {
                email,
                senha
            }, {
                withCredentials: true
            });
            navigate('/search');
        } catch (err) {
            setError(err.response?.data?.mensagem || 'Login failed. Please try again.');
        }
    };

    return (
        <div className={'login-div'} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#f7f7f7'
        }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className={'login-form'} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: '#fff',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
                {error && (
                    <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
                )}

            </form>
        </div>
    );
}

export default Login;
