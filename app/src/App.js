import CreateAccount from "./components/CreateAccount";
import 'tailwindcss/tailwind.css'; 

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <CreateAccount></CreateAccount>
    </div>
  );
}

export default App;
