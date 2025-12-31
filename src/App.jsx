// import { useState } from "react";
// import HostBoard from "./HostBoard";
// import PlayerJoin from "./PlayerJoin";

// export default function App() {
//   const [mode, setMode] = useState("");

//   const appStyle = {
//     minHeight: "100vh",
//     margin: 0,
//     padding: 0,
//     fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
//     background: "radial-gradient(circle at top, #111827 0, #020617 60%, #000000 100%)",
//     color: "#e5e7eb",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   };

//   const cardStyle = {
//     backgroundColor: "rgba(15, 23, 42, 0.9)", // dark gray card
//     borderRadius: 16,
//     padding: 24,
//     boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
//     border: "1px solid rgba(148, 163, 184, 0.3)",
//     width: 420,
//   };

//   const headerStyle = {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   };

//   const titleStyle = {
//     fontSize: 22,
//     letterSpacing: 1,
//   };

//   const badgeStyle = {
//     fontSize: 12,
//     textTransform: "uppercase",
//     color: "#facc15",
//     border: "1px solid rgba(250, 204, 21, 0.3)",
//     borderRadius: 999,
//     padding: "4px 10px",
//     background:
//       "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(15,23,42,0.9))",
//   };

//   const toggleGroupStyle = {
//     display: "flex",
//     gap: 8,
//     marginBottom: 16,
//     backgroundColor: "#020617",
//     padding: 4,
//     borderRadius: 999,
//     border: "1px solid rgba(55,65,81,0.9)",
//   };

//   const toggleButton = (active) => ({
//     flex: 1,
//     padding: "8px 0",
//     borderRadius: 999,
//     border: "none",
//     cursor: "pointer",
//     fontWeight: 600,
//     fontSize: 14,
//     letterSpacing: 0.5,
//     textTransform: "uppercase",
//     background: active
//       ? "linear-gradient(135deg, #facc15, #eab308)"
//       : "transparent",
//     color: active ? "#020617" : "#e5e7eb",
//     boxShadow: active ? "0 0 20px rgba(250, 204, 21, 0.45)" : "none",
//     transition: "all 0.18s ease-out",
//   });

//   const dividerStyle = {
//     height: 1,
//     border: "none",
//     margin: "14px 0 18px",
//     background:
//       "linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.7), transparent)",
//   };

//   return (
//     <div style={appStyle}>
//       <div style={cardStyle}>
//         <div style={headerStyle}>
//           <h1 style={titleStyle}>Tambola Arena</h1>
//           <span style={badgeStyle}>{mode === "host" ? "Host View" : mode === "player" ? "Player View" : "Select Mode"}</span>
//         </div>

//         <div style={toggleGroupStyle}>
//           <button
//             style={toggleButton(mode === "host")}
//             onClick={() => setMode("host")}
//           >
//             Host
//           </button>
//           <button
//             style={toggleButton(mode === "player")}
//             onClick={() => setMode("player")}
//           >
//             Player
//           </button>
//         </div>

//         <hr style={dividerStyle} />

//         {mode === ""
//           ? <p style={{ color: "#9ca3af", fontSize: 14 }}>Choose how you want to join the game.</p>
//           : mode === "host"
//           ? <HostBoard />
//           : <PlayerJoin />}
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import HostBoard from "./HostBoard";
import PlayerJoin from "./PlayerJoin";

export default function App() {
  const [mode, setMode] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setMode("host")}>Host</button>
      <button onClick={() => setMode("player")}>Player</button>

      <hr style={{ margin: "20px 0" }} />

      {/* {mode === "host" ? <HostBoard /> : mode === "player" ? <PlayerJoin /> : <p>Select Host or Player</p>} */}
      {mode === "host" ? <HostBoard /> : <PlayerJoin />}
    
    </div>
  );
}
