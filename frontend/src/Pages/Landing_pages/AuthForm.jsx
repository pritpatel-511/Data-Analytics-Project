// import React, { useState } from 'react';
// import './Styles/Authform.css'; // Make sure this path is correct

// export default function AuthForm() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loginEmail, setLoginEmail] = useState('');
//   const [loginPassword, setLoginPassword] = useState('');
//   const [signupName, setSignupName] = useState('');
//   const [signupEmail, setSignupEmail] = useState('');
//   const [signupPassword, setSignupPassword] = useState('');
//   const [message, setMessage] = useState("");

//   const clearForm = () => {
//     setLoginEmail('');
//     setLoginPassword('');
//     setSignupName('');
//     setSignupEmail('');
//     setSignupPassword('');
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: loginEmail, password: loginPassword }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setMessage(`Success: ${data.message || "Logged in"}`);
//         if (data.token && data.user) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("user", JSON.stringify(data.user));
//           localStorage.setItem("userRole", data.user.role); // ✅ Store role

//           // ✅ Redirect based on role
//           if (data.user.role === "admin") {
//             window.location.href = "/AdminPanel";
//           } else {
//             window.location.href = "/Layout/home";
//           }
//         }
//       } else {
//         setMessage(`Error: ${data.message}`);
//       }
//     } catch (err) {
//       setMessage("Error connecting to server.");
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: signupName,
//           email: signupEmail,
//           password: signupPassword,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setIsLogin(true);
//         clearForm();
//         setMessage("Your account was created successfully. Login with registered email & password.");
//       } else {
//         setMessage(`Error: ${data.message}`);
//       }
//     } catch (err) {
//       setMessage("Error connecting to server.");
//     }
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="form-container">
//         <div className="form-toggle">
//           <button
//             className={isLogin ? "active" : ""}
//             onClick={() => {
//               setIsLogin(true);
//               clearForm();
//               setMessage("");
//             }}
//           >
//             Login
//           </button>
//           <button
//             className={!isLogin ? "active" : ""}
//             onClick={() => {
//               setIsLogin(false);
//               clearForm();
//               setMessage("");
//             }}
//           >
//             Sign Up
//           </button>
//         </div>

//         {isLogin ? (
//           <form className="form" onSubmit={handleLogin}>
//             <h2>Login</h2>
//             {message && (
//               <p className={message.startsWith("Error") ? "error-message" : "success-message"}>
//                 {message}
//               </p>
//             )}
//             <input
//               type="email"
//               placeholder="Email"
//               value={loginEmail}
//               onChange={(e) => setLoginEmail(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={loginPassword}
//               onChange={(e) => setLoginPassword(e.target.value)}
//               required
//             />
//             <button type="submit">Login</button>
//             <p>
//               Don't have an account?{" "}
//               <span
//                 style={{ color: "#007bff", cursor: "pointer" }}
//                 onClick={() => {
//                   setIsLogin(false);
//                   clearForm();
//                   setMessage("");
//                 }}
//               >
//                 Sign Up
//               </span>
//             </p>
//           </form>
//         ) : (
//           <form className="form" onSubmit={handleSignup}>
//             <h2>Sign Up</h2>
//             {message && (
//               <p className={message.startsWith("Error") ? "error-message" : "success-message"}>
//                 {message}
//               </p>
//             )}
//             <input
//               type="text"
//               placeholder="Name"
//               value={signupName}
//               onChange={(e) => setSignupName(e.target.value)}
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={signupEmail}
//               onChange={(e) => setSignupEmail(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={signupPassword}
//               onChange={(e) => setSignupPassword(e.target.value)}
//               required
//             />
//             <button type="submit">Sign Up</button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import './Styles/Authform.css';
import logo from './web_logo.jpg'; // Replace with your actual logo path

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [message, setMessage] = useState("");

  const clearForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Success: ${data.message || "Logged in"}`);
        if (data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("userRole", data.user.role);

          if (data.user.role === "admin") {
            window.location.href = "/AdminPanel";
          } else {
            window.location.href = "/Layout/home";
          }
        }
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsLogin(true);
        clearForm();
        setMessage("Your account was created successfully. Login with registered email & password.");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="logo-section">
          <img src={logo} alt="Graphlytics Logo" className="auth-logo" />
          <h1>Graphlytics</h1>
        </div>
        <p>A powerful platform for AI-driven data analytics</p>
        <ul className="auth-features">
          <li>✅ Secure platform</li>
          <li>🤖 AI integration</li>
          <li>📊 Download & Analyze Reports</li>
          <li>📁 Manage History</li>
        </ul>
      </div>

      <div className="auth-right">
        <div className="form-container">
          <div className="form-toggle">
            <button className={isLogin ? "active" : ""} onClick={() => { setIsLogin(true); clearForm(); setMessage(""); }}>Login</button>
            <button className={!isLogin ? "active" : ""} onClick={() => { setIsLogin(false); clearForm(); setMessage(""); }}>Sign Up</button>
          </div>

          {isLogin ? (
            <form className="form" onSubmit={handleLogin}>
              <h2>Login</h2>
              {message && <p className={message.startsWith("Error") ? "error-message" : "success-message"}>{message}</p>}
              <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              <button type="submit">Login</button>
              <p>Don't have an account? <span onClick={() => { setIsLogin(false); clearForm(); setMessage(""); }}>Sign Up</span></p>
            </form>
          ) : (
            <form className="form" onSubmit={handleSignup}>
              <h2>Sign Up</h2>
              {message && <p className={message.startsWith("Error") ? "error-message" : "success-message"}>{message}</p>}
              <input type="text" placeholder="Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
              <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
              <button type="submit">Sign Up</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
