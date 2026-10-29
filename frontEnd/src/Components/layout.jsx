import { Outlet } from "react-router-dom";
import Header from "./header.jsx";
import Nav from "./nav.jsx";
import '../styling/layout.css';

// Shared shell for every page after login: header on top, nav on the side
// (bottom-of-header strip on mobile) and a scrollable main area.
export default function AppLayout() {
    return (
        <div className="appShell">
            <Header />
            <Nav />
            <main className="appMain">
                <Outlet />
            </main>
        </div>
    );
}
