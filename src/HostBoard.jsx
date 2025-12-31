import { useEffect, useState } from "react";
import { socket } from "./socket";

export default function HostBoard() {
  const [roomCode, setRoomCode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [called, setCalled] = useState([]);
  const [current, setCurrent] = useState(null);
  const [assigned, setAssigned] = useState({});
  const [showPast, setShowPast] = useState(false);
  const [ticketCount, setTicketCount] = useState({});

  const [autoGenerate, setAutoGenerate] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(5);


  const [claims, setClaims] = useState({
    FIRST_FIVE: null,
    FIRST_LINE: null,
    MIDDLE_LINE: null,
    LAST_LINE: null,
    FULL_HOUSE: null,
  });

  // Professional claim labels
  const claimLabels = {
    FIRST_FIVE: "1st Five",
    FIRST_LINE: "1st Line",
    MIDDLE_LINE: "Middle Line",
    LAST_LINE: "Last Line",
    FULL_HOUSE: "Full House",
  };

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
    dangerBorder: "rgba(248,113,113,0.9)",
    dangerBg: "rgba(239,68,68,0.08)",
    successBorder: "rgba(34,197,94,0.6)",
  };

  const containerStyle = {
    display: "flex",
    gap: 24,
    padding: 24,
    background:
      "radial-gradient(circle at top, #020617 0%, #02040A 40%, #020617 100%)",
    borderRadius: 16,
    border: `1px solid ${colors.borderSoft}`,
    boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
    color: colors.textPrimary,
    alignItems: "stretch",
    minHeight: "82vh",
  };

  const leftPanelStyle = {
    flex: 2.5,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const rightPanelStyle = {
    flex: 2.5,
    backgroundColor: colors.bgPanel,
    borderRadius: 14,
    border: `1px solid ${colors.borderStrong}`,
    padding: 20,
    display: "flex",
    flexDirection: "column",
  };

  const sideBySideContainer = {
    display: "flex",
    gap: 12,
    flex: 1,
  };

  const sideBySideItem = {
    flex: 1,
  };

  const cardStyle = {
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85))",
    borderRadius: 14,
    border: `1px solid ${colors.borderStrong}`,
  };

  const sectionHeaderStyle = {
    margin: "0 0 10px",
    color: colors.textPrimary,
    fontSize: 16,
    letterSpacing: 0.03,
  };

  const primaryButton = {
    padding: "10px 18px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    background: `linear-gradient(135deg, ${colors.goldSoft}, ${colors.goldStrong})`,
    color: "#020617",
    boxShadow: "0 0 24px rgba(250,204,21,0.55)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    fontFamily: "system-ui, sans-serif",
  };

  const secondaryButton = {
    padding: "8px 14px",
    borderRadius: 999,
    border: `1px solid ${colors.borderStrong}`,
    backgroundColor: colors.bgRoot,
    color: colors.textPrimary,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    transition: "all 0.15s ease",
    fontFamily: "system-ui, sans-serif",
  };

  const dangerButton = {
    ...secondaryButton,
    borderColor: colors.dangerBorder,
    color: "#FCA5A5",
    backgroundColor: colors.dangerBg,
  };

  const currentNumberStyle = {
    width: 88,
    height: 88,
    borderRadius: "50%",
    background: current
      ? `radial-gradient(circle at 30% 30%, ${colors.goldSoft}, ${colors.gold}, #92400e)`
      : "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: current ? "#020617" : colors.textSoft,
    fontSize: 36,
    fontWeight: 800,
    boxShadow: current
      ? "0 0 40px rgba(250,204,21,0.75)"
      : "0 0 0 rgba(0,0,0,0)",
    border: `3px solid ${colors.gold}`,
    margin: "10px 0 6px",
    alignSelf: "center",
  };

  const boardContainerStyle = {
    marginTop: 12,
    padding: 24,
    borderRadius: 20,
    background: "radial-gradient(circle at top, #020617, #020617 35%, #050816 100%)",
    border: `2px solid ${colors.borderStrong}`,
    flex: 1,
    overflow: "hidden",
  };

  const boardGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(10, 44px)",
    columnGap: 10,
    rowGap: 10,
    justifyContent: "center",
    padding: "12px",
  };

  const numberCellStyle = (isCalled, isCurrent) => ({
    height: 44,
    width: 44,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: isCalled
      ? `2px solid ${colors.goldStrong}`
      : `1px solid ${colors.borderStrong}`,
    background: isCurrent
      ? `radial-gradient(circle at 30% 30%, ${colors.goldSoft}, ${colors.goldStrong})`
      : isCalled
      ? `linear-gradient(135deg, ${colors.gold}, ${colors.goldStrong})`
      : "linear-gradient(135deg, #020617, #030712)",
    color: isCalled ? "#020617" : colors.textMuted,
    boxShadow: isCalled
      ? "0 0 16px rgba(250,204,21,0.7)"
      : "0 0 0 rgba(0,0,0,0)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  });

  const lastFiveStyle = {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: `1px solid ${colors.successBorder}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `radial-gradient(circle at 30% 30%, #bbf7d0, #22c55e, #166534)`,
    color: "#022c22",
    fontWeight: 700,
    fontSize: 14,
  };

  const inputStyle = {
    width: 60,
    padding: "6px 8px",
    borderRadius: 999,
    border: `1px solid ${colors.borderStrong}`,
    backgroundColor: colors.bgRoot,
    color: colors.textPrimary,
    fontSize: 11,
    textAlign: "center",
    outline: "none",
  };

  const playerCardStyle = {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.bgSection,
    border: `1px solid ${colors.borderStrong}`,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
  };

  useEffect(() => {
  if (!autoGenerate || !roomCode) return;

  const interval = setInterval(() => {
    socket.emit("host_call_number", { roomCode });
  }, intervalSeconds * 1000);

  return () => clearInterval(interval);
  }, [autoGenerate, intervalSeconds, roomCode]);


  useEffect(() => {
    socket.on("game_created", ({ roomCode }) => {

      setAutoGenerate(false);
      setIntervalSeconds(5);

      setRoomCode(roomCode);
      setPlayers([]);
      setAssigned({});
      setCalled([]);
      setCurrent(null);
      setShowPast(false);
      setTicketCount({});
      setClaims({
        FIRST_FIVE: null,
        FIRST_LINE: null,
        MIDDLE_LINE: null,
        LAST_LINE: null,
        FULL_HOUSE: null,
      });
    });

    socket.on("player_added", (p) =>
      setPlayers((prev) => [...prev, p])
    );

    socket.on("room_closed", () => {
  alert("Game finished. New room created by host.");
});


    socket.on("ticket_assigned", ({ playerCode }) =>
      setAssigned((a) => ({ ...a, [playerCode]: true }))
    );

    socket.on("player_removed", ({ playerCode }) => {
      setPlayers((p) => p.filter((x) => x.playerCode !== playerCode));
      setAssigned((a) => {
        const copy = { ...a };
        delete copy[playerCode];
        return copy;
      });
      setTicketCount((c) => {
        const copy = { ...c };
        delete copy[playerCode];
        return copy;
      });
    });

    socket.on("number_called", ({ number, called }) => {
      setCurrent(number);
      setCalled(called);
    });

    socket.on("game_reset", () => {
      setCalled([]);
      setCurrent(null);
      setShowPast(false);
      setClaims({
        FIRST_FIVE: null,
        FIRST_LINE: null,
        MIDDLE_LINE: null,
        LAST_LINE: null,
        FULL_HOUSE: null,
      });
    });

    socket.on("claim_accepted", ({ claimType, winner }) =>
      setClaims((c) => ({ ...c, [claimType]: winner }))
    );

    return () => socket.off();
  }, []);

  const lastFive = called.slice(-5);

  return (
    <div style={containerStyle}>
      {/* LEFT SIDE: Controls + Players/Winners Side-by-Side */}
      <div style={leftPanelStyle}>
        {/* Host Control */}
        <div style={{ ...cardStyle, padding: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  color: colors.textPrimary,
                }}
              >
                🎮 Host Control
              </h2>
              {roomCode && (
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 13,
                    color: colors.textMuted,
                  }}
                >
                  Room <span style={{ color: colors.gold }}>#{roomCode}</span>
                </p>
              )}
            </div>

            {!roomCode && (
              <button
                style={primaryButton}
                onClick={() => socket.emit("host_create_game")}
              >
                ✨ Create Game
              </button>
            )}
          </div>

          {roomCode && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 12,
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={secondaryButton}
                  onClick={() => {
                    const name = prompt("Player name");
                    if (name)
                      socket.emit("host_add_player", {
                        roomCode,
                        playerName: name,
                      });
                  }}
                >
                  ➕ Add Player
                </button>
                <button
                  style={secondaryButton}
                  onClick={() =>
                    // socket.emit("host_new_game", { roomCode })
                    socket.emit("host_new_game", { oldRoomCode: roomCode })
                  }
                >
                  🔄 New Game
                </button>
                {/* <button
                  style={primaryButton}
                  onClick={() =>
                    socket.emit("host_call_number", { roomCode })
                  }
                >
                  🎲 Generate Number
                </button> */}
                <button
                  style={{
                    ...primaryButton,
                    opacity: autoGenerate ? 0.6 : 1,
                    cursor: autoGenerate ? "not-allowed" : "pointer",
                  }}
                  disabled={autoGenerate}
                  onClick={() =>
                    socket.emit("host_call_number", { roomCode })
                  }
                >
                  🎲 Generate Number
                </button>

              </div>

              <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginTop: 12,
    flexWrap: "wrap",
  }}
>
  {/* Seconds Input */}
  <label style={{ fontSize: 12, color: colors.textMuted }}>
    ⏱ Seconds
    <input
      type="number"
      min="1"
      value={intervalSeconds}
      onChange={(e) =>
        setIntervalSeconds(Math.max(1, Number(e.target.value)))
      }
      style={{
        ...inputStyle,
        width: 70,
        fontSize: 14,
        fontWeight: 600,
        marginLeft: 6,
      }}
    />
  </label>

  {/* Auto Generate Checkbox */}
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      color: colors.textPrimary,
      cursor: "pointer",
    }}
  >
    <input
      type="checkbox"
      checked={autoGenerate}
      onChange={(e) => setAutoGenerate(e.target.checked)}
    />
    🤖 Auto Generate
  </label>
</div>


              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 8,
                }}
              >
                <div style={currentNumberStyle}>
                  {current || "—"}
                </div>

                <div>
                  <h4
                    style={{
                      margin: "0 0 6px",
                      color: colors.textMuted,
                      fontSize: 13,
                    }}
                  >
                    📊 Last 5 Numbers
                  </h4>
                  <div style={{ display: "flex", gap: 6 }}>
                    {lastFive.map((n) => (
                      <div key={n} style={lastFiveStyle}>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* PLAYERS + WINNERS SIDE BY SIDE - TALLER (280px) */}
        <div style={sideBySideContainer}>
          {/* Players List */}
          <div style={{ ...cardStyle, padding: 24, ...sideBySideItem }}>
            <h3 style={sectionHeaderStyle}>
              👥 Players ({players.length})
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxHeight: 325,
                minHeight: 280,
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {players.map((p) => (
                <div key={p.playerCode} style={playerCardStyle}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: colors.textPrimary,
                        fontSize: 20,
                      }}
                    >
                      {p.playerName}
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        color: colors.textMuted,
                        marginTop: 1
                      }}
                    >
                      {p.playerCode}{" "}
                      {/* {assigned[p.playerCode]
                        ? "✅"
                        : "⏳"} */}
                    </div>
                  </div>

                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={ticketCount[p.playerCode] || 1}
                    onChange={(e) =>
                      setTicketCount({
                        ...ticketCount,
                        [p.playerCode]: Number(e.target.value),
                      })
                    }
                    style={{
    ...inputStyle,
    fontSize: "20px",
    fontWeight: "600",
  }}
                  />

                 <button
  // style={ticketButton}
  style={dangerButton}
  onClick={() =>
    socket.emit("host_assign_ticket", {
      roomCode,
      playerCode: p.playerCode,
      count: ticketCount[p.playerCode] || 1,
    })
  }
>
  {assigned[p.playerCode] ? "✔️" : "⏳"}
</button>


                  <button
                    style={dangerButton}
                    onClick={() =>
                      socket.emit("host_remove_player", {
                        roomCode,
                        playerCode: p.playerCode,
                      })
                    }
                  >
                    ❌
                  </button>
                </div>
              ))}
              {players.length === 0 && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: colors.textSoft,
                    textAlign: "center",
                    padding: "40px 0",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No players yet
                </p>
              )}
            </div>
          </div>

          {/* Winners List - TALLER + BIGGER FONTS */}
          <div style={{ ...cardStyle, padding: 14, ...sideBySideItem }}>
            <h3
              style={{
                margin: "0 0 10px",
                color: colors.gold,
                fontSize: 16,
                letterSpacing: 0.08,
                textTransform: "uppercase",
                fontWeight: 900,
              }}
            >
              🏆 Winners
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: 12,
                backgroundColor: colors.bgSection,
                borderRadius: 10,
                border: `1px dashed ${colors.borderSoft}`,
                height: 325,
                minHeight: 280,
                // overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {Object.entries(claims).map(([type, winner]) => (
                <li
                  key={type}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderBottom: "1px dotted rgba(55,65,81,0.6)",
                    minHeight: "44px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: colors.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.06,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {claimLabels[type]}
                  </span>
                  <span
                    style={{
                      color: winner ? colors.gold : colors.textSoft,
                      fontWeight: winner ? 700 : 500,
                      fontSize: 13,
                    }}
                  >
                    {winner || "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Numbers Board */}
      <div style={rightPanelStyle}>
        <h3
          style={{
            margin: "0 0 12px",
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          🎯 Numbers Board (1–90)
        </h3>

        <p
          style={{
            margin: "0 0 14px",
            fontSize: 14,
            color: colors.textMuted,
            lineHeight: 1.4,
          }}
        >
          Called numbers glow gold. Current number shines brightest.
        </p>

        {roomCode ? (
          <div style={boardContainerStyle}>
            <div style={boardGridStyle}>
              {Array.from({ length: 90 }, (_, i) => i + 1).map((n) => {
                const isCalled = called.includes(n);
                const isCurrent = current === n;
                return (
                  <div
                    key={n}
                    style={numberCellStyle(isCalled, isCurrent)}
                    title={`Number ${n}${isCalled ? " (called)" : ""}`}
                  >
                    {n}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: 30,
              textAlign: "center",
              fontSize: 13,
              color: colors.textSoft,
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Create a game to view and control the board.
          </div>
        )}
      </div>
    </div>
  );
}
