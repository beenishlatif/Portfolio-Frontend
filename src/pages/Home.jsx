import Portfolio from "./Portfolio.jsx";

// The main website ("/") shows this site's own portfolio directly — no directory,
// no login prompt. Set VITE_MAIN_SLUG in the frontend .env to your admin slug
// (e.g. "beenish"). Other admins on the same platform are still reachable at
// their own address, e.g. /zeeshan — this page only decides what "/" shows.
const MAIN_SLUG = import.meta.env.VITE_MAIN_SLUG || "beenish";

const Home = () => <Portfolio slugProp={MAIN_SLUG} />;

export default Home;
