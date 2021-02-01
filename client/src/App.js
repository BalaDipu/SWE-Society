import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Footer from "./components/generic/footer";
import MyNavbar from "./components/generic/navbar";
import ProtectedRoute from "./components/generic/protectedRoutes";
import NotFound from "./pages/404";
import Landing from "./pages/landing";
import Profile from "./pages/profile";
import SignIn from "./pages/signIn";
import Administrator from "./pages/administrator";

function App() {
  return (
    <Router>
      <MyNavbar />

      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/administrator" component={Administrator} />
        <ProtectedRoute exact path="/profile" component={Profile} />
        <Route path="*" component={NotFound} />
      </Switch>

      <Footer />
    </Router>
  );
}

export default App;
