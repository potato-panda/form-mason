export default function Sidebar({ showSidebar }: { showSidebar: boolean }) {
  return (
    <>
      <div id="app-sidebar">
        <div
          className={['sidebar-container', showSidebar ? 'show' : ''].join(' ')}
        >
          Sidebar
        </div>
      </div>
    </>
  );
}
