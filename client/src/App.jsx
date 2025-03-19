import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import CreateListing from "./pages/CreateListing";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import UpdateListing from "./pages/updateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<Search />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/listing/create" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
