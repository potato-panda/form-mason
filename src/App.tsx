import './App.css';
import Layout from './layouts/layout';
import { EventBusServiceProvider } from './providers/eventBusServiceProvider';
import { ModalServiceProvider } from './providers/modalServiceProvider';
import { RoutingServiceProvider } from './providers/routingServiceProvider';
import { UserFormServiceProvider } from './providers/userFormServiceProvider';

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
