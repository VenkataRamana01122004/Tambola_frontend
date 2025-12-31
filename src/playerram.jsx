import { useEffect, useState } from "react";
import { socket } from "./socket";

export default function PlayerJoin() {
  const [playerCode, setPlayerCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [called, setCalled] = useState([]);
  const [current, setCurrent] = useState(null);
  const [claims, setClaims] = useState({});
  const [marked, setMarked] = useState({});

  // Professional claim labels
  const claimLabels = {
    FIRST_FIVE: "1st Five",
    FIRST_LINE: "1st Line",
    MIDDLE_LINE: "Middle Line",
    LAST_LINE: "Last Line",
    FULL_HOUSE: "Full House",
  };

  // derived numbers
  const lastFive = called.slice(-5);
  const pastNumbers = called.slice(0, -5);

  // Core palette: black / grey / gold
  const colors = {
    bgRoot: "#02040A",
    bgPanel: "#050816",
    bgSection: "#050B12",
    borderSoft: "rgba(148,163,184,0.35)",
    borderStrong: "rgba(75,85,99,0.8)",
    textPrimary: "#F9FAFB",
    textMuted: "#9CA3AF",
    textSoft: "#6B7280",
    gold: "#FACC15",
    goldStrong: "#EAB308",
    goldSoft: "#FEF9C3",
    successBorder: "rgba(34,197,94,0.6)",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: 20,
    background: "radial-gradient(circle at top, #020617 0%, #02040A 70%, #020617 100%)",
    borderRadius: 20,
    border: `1px solid ${colors.borderSoft}`,
    boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
    color: colors.textPrimary,
    minHeight: "90vh",
    fontFamily: "system-ui, sans-serif",
  };

  const threeColumnStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 16,
    flex: "none",
    height: 240,
  };

  const fullWidthCardStyle = {
    background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85))",
    borderRadius: 16,
    padding: 24,
    border: `1px solid ${colors.borderStrong}`,
  };

  const thirdCardStyle = {
    background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85))",
    borderRadius: 12,
    padding: 12,
    border: `1px solid ${colors.borderStrong}`,
    display: "flex",
    flexDirection: "column",
  };

  const primaryButton = {
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    background: `linear-gradient(135deg, ${colors.goldSoft}, ${colors.goldStrong})`,
    color: "#020617",
    boxShadow: "0 0 20px rgba(250,204,21,0.45)",
    transition: "all 0.2s ease",
    fontFamily: "system-ui, sans-serif",
  };

  const claimButton = (claimType) => ({
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${colors.borderStrong}`,
    backgroundColor: claims[claimType] ? colors.bgSection : colors.bgRoot,
    color: claims[claimType] ? colors.gold : colors.textPrimary,
    cursor: claims[claimType] ? "default" : "pointer",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    margin: 4,
    opacity: claims[claimType] ? 0.6 : 1,
    transition: "all 0.2s ease",
    flex: 1,
  });

  const toggleMark = (ticketIndex, number) => {
  if (!number) return;

  setMarked(prev => {
    const key = `${ticketIndex}-${number}`;
    const copy = { ...prev };

    if (copy[key]) {
      delete copy[key];
    } else {
      copy[key] = true;
    }

    return copy;
  });
};


  const currentNumberStyle = {
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: current
      ? `radial-gradient(circle at 30% 30%, ${colors.goldSoft}, ${colors.gold}, #92400e)`
      : "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: current ? "#020617" : colors.textSoft,
    fontSize: 40,
    fontWeight: 800,
    boxShadow: current
      ? "0 0 40px rgba(250,204,21,0.75)"
      : "0 0 0 rgba(0,0,0,0)",
    border: `3px solid ${colors.gold}`,
    margin: "0 auto 8px",
  };

  const lastFiveStyle = {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: `2px solid ${colors.successBorder}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `radial-gradient(circle at 30% 30%, #bbf7d0, #22c55e, #166534)`,
    color: "#022c22",
    fontWeight: 700,
    fontSize: 13,
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 10,
    border: `1px solid ${colors.borderStrong}`,
    backgroundColor: colors.bgRoot,
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: 8,
    outline: "none",
    textTransform: "uppercase",
    fontWeight: 500,
  };

  const ticketCellStyle = (isCalled) => ({
    height: 68,
    borderRadius: 14,
    fontSize: 20,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: isCalled
      ? `3px solid ${colors.goldStrong}`
      : `1px solid ${colors.borderStrong}`,
    background: isCalled
      ? `linear-gradient(135deg, ${colors.gold}, ${colors.goldStrong})`
      : "linear-gradient(135deg, #020617, #030712)",
    color: isCalled ? "#020617" : colors.textMuted,
    boxShadow: isCalled
      ? "0 0 20px rgba(250,204,21,0.75)"
      : "none",
    transition: "all 0.2s ease",
  });

  const sectionHeaderStyle = {
    margin: "0 0 4px 0",
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.5,
    textAlign: "center",
  };

  useEffect(() => {
    socket.on("player_joined", d => {
      setPlayerName(d.playerName || "");
      setTickets(d.tickets || []);
      setCalled(d.called || []);
      setCurrent(d.current);
      setClaims(d.claims || {});
      setRoomCode(d.roomCode);
    });

    socket.on("number_called", d => {
      setCurrent(d.number);
      setCalled(d.called);
    });

    socket.on("claim_accepted", d =>
      setClaims(c => ({ ...c, [d.claimType]: d.winner }))
    );

    socket.on("claim_rejected", d =>
      alert(`${claimLabels[d.claimType] || d.claimType} INVALID`)
    );

    return () => socket.off();
  }, [claimLabels]);

  return (
    <div style={containerStyle}>
      {/* TOP ROW: Welcome Board - Join+Winners | Current | Claims */}
      <div style={threeColumnStyle}>
        {/* COLUMN 1: Player Join + Winners COMBINED */}
        <div style={thirdCardStyle}>
          
          
          {playerName ? (
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 700, 
                color: colors.gold,
                padding: "6px 10px",
                backgroundColor: colors.bgSection,
                borderRadius: 8,
                border: `1px solid ${colors.borderSoft}`,
                marginBottom: 8,
                textTransform: "uppercase",
              }}>
                Welcome {playerName} 👋
              </div>
              {/* <span style={{ fontSize: 11, color: colors.textMuted }}>👋</span> */}
            </div>
          ) : (
            <>
            <h3 style={sectionHeaderStyle}>🎫 Join</h3>
              <input
                placeholder="Code"
                value={playerCode}
                onChange={e => setPlayerCode(e.target.value.toUpperCase())}
                style={inputStyle}
              />
              <button
                style={primaryButton}
                onClick={() => socket.emit("player_join_with_code", { playerCode })}
                disabled={!playerCode}
              >
                Join
              </button>
            </>
          )}

          {/* WINNERS INSIDE JOIN COLUMN */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <h4 style={{ 
              margin: "8px 0 8px 0", 
              color: colors.gold,
              fontSize: 12,
              textAlign: "center",
              fontWeight: 700
            }}>
              🏆 Winners
            </h4>
            <ul style={{ 
              listStyle: "none", 
              padding: 0, 
              margin: 0,
              backgroundColor: colors.bgSection,
              borderRadius: 8,
              border: `1px dashed ${colors.borderSoft}`,
              maxHeight: 150,
              overflowY: "auto",
              flex: 1
            }}>
              {["FIRST_FIVE", "FIRST_LINE", "MIDDLE_LINE", "LAST_LINE", "FULL_HOUSE"].map(c => (
                <li key={c} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 8px",
                  borderBottom: `1px dotted ${colors.borderSoft}`,
                  fontSize: 20
                }}>
                  <span style={{ 
                    // color: colors.textMuted, 
                    textTransform: "uppercase",
                    letterSpacing: 0.1,
                    fontSize: 14
                  }}>
                    {claimLabels[c]}
                  </span>
                  <span style={{ 
                    color: claims[c] ? colors.gold : colors.textSoft,
                    fontWeight: claims[c] ? 700 : 400,
                    fontSize: 18
                  }}>
                    {claims[c] ? `🏆${claims[c]}` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLUMN 2: Current Number + Last 5 */}
        <div style={thirdCardStyle}>
          <h3 style={sectionHeaderStyle}>🔢 Current</h3>
          <div style={currentNumberStyle}>
            {current || "—"}
          </div>
          
          {called.length > 0 && (
            <div>
              <h4 style={{ 
                margin: "0 0 4px", 
                color: colors.textMuted, 
                fontSize: 11,
                textAlign: "center"
              }}>
                Last 5
              </h4>
              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                {lastFive.map(n => (
                  <div key={n} style={lastFiveStyle}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUMN 3: Claim Options (ALWAYS VISIBLE) */}
        <div style={thirdCardStyle}>
          <h3 style={{ 
            ...sectionHeaderStyle,
            color: colors.gold
          }}>⚡ Claims</h3>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 6,
            marginTop: 4
          }}>
            {["FIRST_FIVE", "FIRST_LINE"].map(c => (
              <button
                key={c}
                disabled={!roomCode || !!claims[c]}
                style={claimButton(c)}
                onClick={() =>
                  socket.emit("player_claim", {
                    roomCode,
                    playerCode,
                    claimType: c
                  })
                }
              >
                {claimLabels[c]}
              </button>
            ))}
          </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 6,
            marginTop: 4
          }}>
            {["MIDDLE_LINE", "LAST_LINE"].map(c => (
              <button
                key={c}
                disabled={!roomCode || !!claims[c]}
                style={claimButton(c)}
                onClick={() =>
                  socket.emit("player_claim", {
                    roomCode,
                    playerCode,
                    claimType: c
                  })
                }
              >
                {claimLabels[c]}
              </button>
            ))}
          </div>
          <button
            disabled={!roomCode || !!claims["FULL_HOUSE"]}
            style={claimButton("FULL_HOUSE")}
            onClick={() =>
              socket.emit("player_claim", {
                roomCode,
                playerCode,
                claimType: "FULL_HOUSE"
              })
            }
          >
            {claimLabels["FULL_HOUSE"]}
          </button>
        </div>
      </div>

      {/* BOTTOM ROW: Tickets */}
      {tickets.length > 0 && (
  <div style={fullWidthCardStyle}>
    <h3 style={{ 
      margin: "0 0 24px", 
      color: colors.textPrimary,
      fontSize: 22,
      textAlign: "center"
    }}>
      🎟️ Your Tickets ({tickets.length})
    </h3>

    <div
      style={{
        display: "flex",
        justifyContent: tickets.length === 1 ? "center" : "space-between",
        gap: 40,
        flexWrap: "wrap",
      }}
    >
      {tickets.map((ticket, i) => (
        <div
          key={i}
          style={{
            flex: tickets.length === 1 ? "0 1 auto" : "1",
            maxWidth: 500,
          }}
        >
          <h4 style={{ 
            margin: "0 0 16px", 
            color: colors.gold, 
            fontSize: 18,
            textAlign: "center"
          }}>
            Ticket {i + 1}
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 72px)",
              gap: 14,
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
                        {ticket.map(n => {
  const isMarked = marked[`${i}-${n}`];

  return (
    <div
      key={n}
      style={ticketCellStyle(isMarked)}
      onClick={() => toggleMark(i, n)}
    >
      {n || " "}
    </div>
  );
})}
            {/* {ticket.map(n => (
              <div
                key={n}
                style={ticketCellStyle(called.includes(n))}
              >
                {n || " "}
              </div>
            ))} */}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      {/* {tickets.length > 0 && (
        <div style={fullWidthCardStyle}>
          <h3 style={{ 
            margin: "0 0 24px", 
            color: colors.textPrimary,
            fontSize: 22,
            textAlign: "center"
          }}>
            🎟️ Your Tickets ({tickets.length})
          </h3>
          {tickets.map((ticket, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <h4 style={{ 
                margin: "0 0 16px", 
                color: colors.gold, 
                fontSize: 18,
                textAlign: "center"
              }}>
                Ticket {i + 1}
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 72px)",
                  gap: 14,
                  justifyContent: "center",
                  maxWidth: 450,
                  margin: "0 auto"
                }}
              >
                {ticket.map(n => (
                  <div
                    key={n}
                    style={ticketCellStyle(called.includes(n))}
                  >
                    {n || " "}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )} */}

      {/* Past Numbers (collapsible) */}
      {pastNumbers.length > 0 && (
        <details style={{ 
          backgroundColor: colors.bgSection, 
          padding: 20, 
          borderRadius: 14, 
          border: `1px solid ${colors.borderSoft}`
        }}>
          <summary style={{ 
            color: colors.textPrimary, 
            fontWeight: 600, 
            cursor: "pointer",
            fontSize: 16,
            marginBottom: 12
          }}>
            📜 Past Numbers ({pastNumbers.length})
          </summary>
          <div style={{ 
            fontSize: 15, 
            color: colors.textMuted,
            fontFamily: "monospace",
            lineHeight: 1.7,
            padding: "12px 0"
          }}>
            {pastNumbers.join(", ")}
          </div>
        </details>
      )}
    </div>
  ); 
}
