import {ApolloProvider} from "@apollo/client";
import client from "./apollo";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/login/Login";
import Dashboard from "./pages/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductDetail from "./components/productDetail/ProductDetail";
import "tachyons/css/tachyons.min.css";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
