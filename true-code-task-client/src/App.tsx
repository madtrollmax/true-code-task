import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

import { AuthenticationProvider } from './app';
import { UserProfile, CommentsList } from './entities';
import { Layout } from 'antd';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <Layout style={{ height: '100vh', padding: '20px' }}>
          <Layout.Content
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <UserProfile />
            <CommentsList />
          </Layout.Content>
        </Layout>
      </AuthenticationProvider>
    </QueryClientProvider>
  );
}

export default App;
