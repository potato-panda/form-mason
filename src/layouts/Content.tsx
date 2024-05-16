import { Outlet } from 'react-router-dom';

export default function Content() {

  return (
    <>
      <main id="app-content">
        <Outlet />
      </main>
    </>
  );
}
