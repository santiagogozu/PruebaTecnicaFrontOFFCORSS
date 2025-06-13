import {ApolloProvider} from "@apollo/client";
import client from "./apollo";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/login/Login";
import Dashboard from "./pages/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductDetail from "./components/productDetail/ProductDetail";
import "tachyons/css/tachyons.min.css";
import {AuthProvider} from "./context/AuthContext";
import UserDetail from "./components/user/UserDetail";
import Navbar from "./components/common/Navbar";

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/producto/:id" element={<ProductDetail />} />
                    <Route path="/usuario" element={<UserDetail />} />
                  </Routes>
                </>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
