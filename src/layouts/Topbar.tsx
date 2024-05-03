import { useNavigate } from 'react-router-dom';

export default function TopBar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      <div id="app-topbar" className="align-content-center">
        {/* <button type="button" onClick={() => toggleSidebar()}>
          Toggle Sidebar
        </button> */}
        <span></span>
        <div className="flex gap-2">
          <button
            type="button"
            className="button"
            onClick={() => navigate('/')}
          >
            List
          </button>
          <button
            type="button"
            className="button"
            onClick={() => navigate('/formeditor')}
          >
            Editor
          </button>
        </div>
      </div>
    </>
  );
}
