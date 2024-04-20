import { Router } from '../router/Router';

export default function TopBar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const router = Router();

  function openFormList() {
    router.navigate('/');
  }

  function openFormEditor() {
    router.navigate('/formeditor');
  }

  return (
    <>
      <div id="app-topbar">
        <button type="button" onClick={() => toggleSidebar()}>
          Toggle Sidebar
        </button>
        <button type="button" onClick={() => openFormList()}>
          List
        </button>
        <button type="button" onClick={() => openFormEditor()}>
          Editor
        </button>
        <div>topbar</div>
      </div>
    </>
  );
}
