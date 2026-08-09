import PremiumHome from "./PremiumHome.jsx";

// The main website ("/") shows this site's own portfolio directly — no directory,
// no login prompt. Set VITE_MAIN_SLUG in the frontend .env to your admin slug
// (e.g. "beenish"). Other admins on the same platform are still reachable at
// their own address, e.g. /zeeshan — that route still uses the original
// Portfolio.jsx (untouched), so nothing existing breaks.
const MAIN_SLUG = import.meta.env.VITE_MAIN_SLUG || "beenish";

const Home = () => <PremiumHome slugProp={MAIN_SLUG} />;

export default Home;