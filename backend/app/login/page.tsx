import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';

export default function LoginPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Auth test</h1>
      <LoginButton />
      <div style={{ height: 12 }} />
      <LogoutButton />
    </main>
  );
}