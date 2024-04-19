import Router, { Routes } from '../router';

export default function Content() {
  const router = Router();

  const Component = Routes[router.path].component;

  const args = {};

  return (
    <>
      <main id="app-content">
        <div>Content</div>
        <Component {...args}></Component>
      </main>
    </>
  );
}
