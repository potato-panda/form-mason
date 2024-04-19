import './App.css';
import Layout from './layouts/Layout';
import { EventBusServiceProvider } from './providers/EventBusServiceProvider';
import { ModalServiceProvider } from './providers/ModalServiceProvider';
import { RoutingServiceProvider } from './providers/RoutingServiceProvider';
import { UserFormServiceProvider } from './providers/UserFormServiceProvider';

function App() {
  return (
    <EventBusServiceProvider>
      <RoutingServiceProvider>
        <ModalServiceProvider>
          <UserFormServiceProvider>
            <Layout />
          </UserFormServiceProvider>
        </ModalServiceProvider>
      </RoutingServiceProvider>
    </EventBusServiceProvider>
  );
}

export default App;
