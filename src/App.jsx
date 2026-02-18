import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx"
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import WhatsApp from "/src/components/WhatsApp.jsx"
import RTI from "/src/pages/RTI.jsx"
import ActRules from "/src/pages/ActRules.jsx"
import Admin from "./pages/Admin.jsx";
import RMPLogin from "./pages/RMPLogin.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import RMPProfile from "./pages/RMPProfile.jsx";
import ImportantLinks from "./pages/ImportantLinks.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";
import Cpd from "./pages/CPD.jsx";
import OnlineCPDPlatform from "./pages/OnlineCPDPlatform.jsx";
import Feedback from "./pages/Feedback.jsx";
import Administrator from "./pages/Administrator.jsx";
import ServiceLoginUnavailable from "./pages/ServiceLoginUnavailable.jsx";
import OnlinePayment from "./pages/OnlinePayment.jsx";
import PaymentStatus from "./pages/PaymentStatus.jsx";
import Complaint from "./pages/Complaint.jsx";
import CPDMaintenance from "./pages/CPDMaintenance.jsx";

function App() {

  return (
    <div className="min-h-screen flex flex-col">
    <Navbar />
    <WhatsApp />
    <div className="flex-1">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about-us" element={<AboutUs/>} />
        <Route path="/contact-us" element={<ContactUs/>} />
        <Route path="/rti" element={<RTI/>} />
        <Route path="/act-rules" element={<ActRules/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/rmp-login" element={<RMPLogin/>} />
        <Route path="/rmp-profile" element={<RMPProfile/>} />
        <Route path="/disclaimer" element={<Disclaimer/>} />
        <Route path="/important-links" element={<ImportantLinks/>} />
        <Route path="/terms-conditions" element={<TermsConditions/>} />
        <Route path="/cpd" element={<Cpd/>} />
        <Route path="/cpd/maintenance" element={<CPDMaintenance/>} />
        <Route path="/online-cpd-platform" element={<OnlineCPDPlatform/>} />
        <Route path="/feedback" element={<Feedback/>} />
        <Route path="/administrator" element={<Administrator/>} />
        <Route path="/id-card-order" element={<ServiceLoginUnavailable serviceKey="id-card-order" />} />
        <Route path="/ccmp-registration" element={<ServiceLoginUnavailable serviceKey="ccmp-registration" />} />
      <Route path="/id-card-print" element={<ServiceLoginUnavailable serviceKey="id-card-print" />} />
      <Route path="/rmp-information" element={<ServiceLoginUnavailable serviceKey="rmp-information" />} />
      <Route path="/online-payment" element={<OnlinePayment/>} />
      <Route path="/payment-status" element={<PaymentStatus/>} />
      <Route path="/complaint" element={<Complaint/>} />
    </Routes>
    </div>
    <Footer />
    </div>
  )
}

export default App
