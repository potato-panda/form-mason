import { Router } from '../router/router';

export default function TopBar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const router = Router();

  function openList() {
    router.navigate('/');
  }

  function openBuilder() {
    router.navigate('/formbuilder');
  }

  return (
    <>
      <div id="app-topbar">
        <button type="button" onClick={() => toggleSidebar()}>
          Toggle Sidebar
        </button>
        <button type="button" onClick={() => openList()}>
          List
        </button>
        <button type="button" onClick={() => openBuilder()}>
          Builder
        </button>
        <div>topbar</div>
      </div>
    </>
  );
}
