import './App.css';
import Layout from './layouts/layout';
import { ModalServiceProvider } from './providers/modalServiceProvider';
import { RoutingServiceProvider } from './providers/routingServiceProvider';
import { UserFormDataServiceProvider } from './providers/userFormDataServiceProvider';

function App() {
  return (
    <UserFormDataServiceProvider>
      <RoutingServiceProvider>
        <ModalServiceProvider>
          <Layout />
        </ModalServiceProvider>
      </RoutingServiceProvider>
    </UserFormDataServiceProvider>
  );
}

export default App;
