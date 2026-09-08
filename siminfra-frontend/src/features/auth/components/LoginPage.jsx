import { Lock } from 'lucide-react';

export default function LoginPage({
  username,
  password,
  loginError,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          backgroundColor: '#fff',
          padding: '2.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
          width: '360px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <Lock size={36} color="#2563eb" />

          <h2
            style={{
              margin: '0.5rem 0 0 0',
              color: '#1e293b',
            }}
          >
            SimInfra Admin
          </h2>

          <p
            style={{
              color: '#64748b',
              fontSize: '0.85rem',
            }}
          >
            Inicia sesión para gestionar el sistema
          </p>
        </div>

        {loginError && (
          <p
            style={{
              color: '#ef4444',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}
          >
            {loginError}
          </p>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              fontSize: '0.8rem',
              color: '#475569',
              fontWeight: 'bold',
            }}
          >
            Usuario
          </label>

          <input
            type="text"
            required
            value={username}
            onChange={(e) =>
              onUsernameChange(e.target.value)
            }
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              marginTop: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              fontSize: '0.8rem',
              color: '#475569',
              fontWeight: 'bold',
            }}
          >
            Contraseña
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) =>
              onPasswordChange(e.target.value)
            }
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              marginTop: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '0.75rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}