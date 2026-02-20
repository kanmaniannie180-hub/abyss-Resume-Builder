/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import ATSPage from './pages/ATSPage';
import BiasPage from './pages/BiasPage';
import CVViewer from './pages/CVViewer';
import Editor from './pages/Editor';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Preview from './pages/Preview';
import ResumeViewer from './pages/ResumeViewer';
import Share from './pages/Share';
import Splash from './pages/Splash';
import Templates from './pages/Templates';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ATSPage": ATSPage,
    "BiasPage": BiasPage,
    "CVViewer": CVViewer,
    "Editor": Editor,
    "Home": Home,
    "Portfolio": Portfolio,
    "Preview": Preview,
    "ResumeViewer": ResumeViewer,
    "Share": Share,
    "Splash": Splash,
    "Templates": Templates,
}

export const pagesConfig = {
    mainPage: "Splash",
    Pages: PAGES,
    Layout: __Layout,
};